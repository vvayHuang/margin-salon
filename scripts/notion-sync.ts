/**
 * Notion → 程式碼的內容同步（PRD F-07、D-05）。
 *
 * 跑法：`npm run sync:notion`。它會產生三個檔案，這三個都不要手改：
 *   shared/journal.data.ts   髮型誌（§13.4）
 *   shared/works.data.ts     作品集（§13.1）
 *   app/utils/img.assets.ts  public/img 的尺寸表
 * 並把 Notion 上的圖片下載進 public/img。
 *
 * 為什麼是「產生檔案 ＋ 進版控」而不是在 build 時打 API：
 *   1. §13.5 要求建置時抓、不在執行時抓，且圖片必須落地（Notion 網址 1 小時失效）
 *   2. 產出物進版控之後，build 完全不需要 NOTION_TOKEN，也不會因為 Notion 掛掉就發不了版
 *   3. 內容變更會出現在 git diff 裡，改壞了看得見、也可以 revert
 *
 * 只抓「狀態＝上線」的資料（§13.5）。草稿留在 Notion，不會進到 bundle 裡。
 */
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import { header, renderImgAssets, ts } from './lib/codegen.ts'
import { buildImgManifest, downloadImage } from './lib/images.ts'
import {
  blocksToSections,
  checkbox,
  dateStart,
  firstFileUrl,
  num,
  pageBlocks,
  plainText,
  queryDatabase,
  relationIds,
  selectName,
} from './lib/notion.ts'

const ROOT = new URL('../', import.meta.url).pathname

/**
 * 資料庫 ID 在 main() 裡才讀。放在模組頂層的話，缺變數時會在 import 階段就爆，
 * 那個錯誤繞過下面的 catch，使用者看到的是一整串 stack trace 而不是該做什麼。
 */
let DB: { journal: string; works: string; stylists: string }

function env(key: string) {
  const v = process.env[key]
  if (!v) throw new Error(`缺少環境變數 ${key}，請對照 .env.example 設定專案根目錄的 .env`)
  return v
}

/** 只要上線的（§13.5） */
const ONLINE = { property: '狀態', select: { equals: '上線' } }

/** 服務類型：Notion 的中文選項 → 程式裡的 ServiceId（shared/margin.ts 的 CATEGORIES） */
const SERVICE_ID: Record<string, string> = {
  剪髮: 'cut',
  染髮: 'color',
  燙髮: 'perm',
  護髮: 'care',
  頭皮養護: 'scalp',
}

async function main() {
  // 先確認 token，這是唯一需要自己去申請的東西；資料庫 ID 在 .env.example 裡已經填好
  env('NOTION_TOKEN')
  DB = {
    journal: env('NOTION_DB_JOURNAL'),
    works: env('NOTION_DB_WORKS'),
    stylists: env('NOTION_DB_STYLISTS'),
  }

  console.log('→ 讀取設計師…')
  const stylists = await queryDatabase(DB.stylists)
  /** relation 給的是 page id，換成程式裡用的 StylistId */
  const stylistSlug = new Map<string, string>()
  for (const p of stylists) {
    const slug = plainText(p.properties.Slug)
    if (slug) stylistSlug.set(p.id, slug)
  }
  console.log(`  ${stylistSlug.size} 位`)

  const posts = await syncJournal(stylistSlug)
  const works = await syncWorks(stylistSlug)

  console.log('→ 重建 public/img 尺寸表…')
  const assets = await buildImgManifest()
  await writeFile(`${ROOT}app/utils/img.assets.ts`, renderImgAssets(assets))
  console.log(`  ${Object.keys(assets).length} 張`)

  console.log(`\n完成：髮型誌 ${posts} 篇、作品 ${works} 件。`)
  console.log('產出的檔案請一起 commit，build 才讀得到。')
}

/* ---------------------------------------------------------------- 髮型誌 */

async function syncJournal(stylistSlug: Map<string, string>) {
  console.log('→ 讀取髮型誌…')
  const rows = await queryDatabase(DB.journal, ONLINE)

  const posts: Record<string, unknown>[] = []
  for (const row of rows) {
    const p = row.properties
    const slug = plainText(p.Slug)
    if (!slug) {
      console.warn(`  ⚠ 有一篇沒填 Slug，略過：${plainText(p.標題) || row.id}`)
      continue
    }

    const cover = await resolveImage(p.封面圖, p.圖片檔名, `journal_${slug}`)
    if (!cover) {
      console.warn(`  ⚠ ${slug} 沒有封面圖也沒有圖片檔名，略過`)
      continue
    }

    const author = stylistSlug.get(relationIds(p.作者)[0] ?? '') ?? null
    const ctaLabel = plainText(p['CTA 文字'])
    const ctaTo = plainText(p['CTA 連結'])

    posts.push({
      slug,
      title: plainText(p.標題),
      status: '上線',
      category: selectName(p.分類),
      cover,
      excerpt: plainText(p.摘要),
      author,
      date: dateStart(p.發布日期),
      ...(checkbox(p.置頂) ? { pinned: true } : {}),
      body: blocksToSections(await pageBlocks(row.id)),
      ...(ctaLabel && ctaTo ? { cta: { label: ctaLabel, to: ctaTo } } : {}),
    })
    console.log(`  ${slug}`)
  }

  // 新到舊。頁面自己也會排一次，這裡先排好是為了讓 git diff 穩定。
  posts.sort((a, b) => (String(a.date) < String(b.date) ? 1 : -1))

  await writeFile(
    `${ROOT}shared/journal.data.ts`,
    header('髮型誌（PRD §13.4）')
      + `import type { JournalPost } from './journal'\n\n`
      + `export const JOURNAL: JournalPost[] = ${ts(posts)}\n`,
  )
  return posts.length
}

/* ---------------------------------------------------------------- 作品集 */

async function syncWorks(stylistSlug: Map<string, string>) {
  console.log('→ 讀取作品集…')
  const rows = await queryDatabase(DB.works, ONLINE)

  // 排序權重大者優先，同權重依建立日期新到舊（§13.2）
  rows.sort((a, b) => {
    const wa = num(a.properties.排序權重) ?? 0
    const wb = num(b.properties.排序權重) ?? 0
    if (wa !== wb) return wb - wa
    return dateStart(a.properties.建立日期) < dateStart(b.properties.建立日期) ? 1 : -1
  })

  const works: Record<string, unknown>[] = []
  for (const row of rows) {
    const p = row.properties
    const code = plainText(p.Slug)
    if (!code) {
      console.warn(`  ⚠ 有一件沒填 Slug，略過：${plainText(p.作品標題) || row.id}`)
      continue
    }

    // 頁面用的是「檔名前綴」，後面自己接 _front / _back / _thumb
    const prefix = await resolveWorkImages(p, `works_${code.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`)
    if (!prefix) {
      console.warn(`  ⚠ ${code} 沒有正面圖也沒有圖片檔名，略過`)
      continue
    }

    const serviceZh = (p.服務類型?.multi_select ?? [])[0]?.name ?? ''
    const service = SERVICE_ID[serviceZh]
    if (!service) {
      console.warn(`  ⚠ ${code} 的服務類型「${serviceZh || '（空白）'}」沒有對應的 ServiceId，略過`)
      continue
    }

    const stylist = stylistSlug.get(relationIds(p.設計師)[0] ?? '')
    if (!stylist) {
      console.warn(`  ⚠ ${code} 沒有指定設計師，略過`)
      continue
    }

    const colorCode = plainText(p.使用色號)
    works.push({
      code,
      title: plainText(p.作品標題),
      service,
      stylist,
      length: selectName(p.髮長),
      note: plainText(p.設計師的話),
      bleach: checkbox(p.需漂髮),
      ...(colorCode ? { colorCode } : {}),
      img: prefix,
    })
    console.log(`  ${code}`)
  }

  await writeFile(
    `${ROOT}shared/works.data.ts`,
    header('作品集（PRD §13.1）')
      + `import type { Work } from './margin'\n\n`
      + `export const WORKS: Work[] = ${ts(works)}\n`,
  )
  return works.length
}

/* ------------------------------------------------------------------ 圖片 */

/**
 * 封面圖有檔案就下載，沒有就退回「圖片檔名」指向 public/img 既有素材。
 * 備援存在的理由：站上目前是暫代圖，把 150MB 的佔位圖丟進 Notion 沒有意義；
 * 換成實拍時只要在 Notion 上傳，這個欄位留空就好。
 */
async function resolveImage(fileProp: any, nameProp: any, target: string) {
  const url = firstFileUrl(fileProp)
  if (url) {
    const saved = await downloadImage(url, target)
    return saved.name
  }
  return plainText(nameProp) || undefined
}

/** 作品有五張圖，共用同一個前綴，後綴對應頁面的用法 */
async function resolveWorkImages(p: any, target: string) {
  const slots: [any, string][] = [
    [p.正面圖, '_front'],
    [p.封面圖, '_thumb'],
    [p.側面圖, '_side'],
    [p.背面圖, '_back'],
    [p['Before 圖'], '_before'],
  ]

  let downloaded = false
  for (const [prop, suffix] of slots) {
    const url = firstFileUrl(prop)
    if (!url) continue
    await downloadImage(url, `${target}${suffix}`)
    downloaded = true
  }
  if (downloaded) return target

  return plainText(p.圖片檔名) || undefined
}

main().catch((err) => {
  console.error(`\n同步失敗：${err.message}`)
  process.exit(1)
})
