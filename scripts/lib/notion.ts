/**
 * Notion REST API 的極簡 client。刻意不裝 @notionhq/client——
 * 我們只用到 query 與 blocks 兩個端點，一個 fetch 就夠了，
 * 而這支腳本只在建置前跑，少一個相依就少一個要跟著升級的東西。
 *
 * API 版本釘在 2022-06-28。Notion 之後推出的版本改用 data source 的概念，
 * 舊版仍可用 database_id 直接查，行為穩定；要升版時整份改這裡一個常數。
 */
import process from 'node:process'

const API = 'https://api.notion.com/v1'
const VERSION = '2022-06-28'

/** Notion 的速率限制是平均每秒 3 次請求，超過會回 429（§13.5） */
const MIN_INTERVAL_MS = 350

let lastCall = 0
async function throttle() {
  const wait = lastCall + MIN_INTERVAL_MS - Date.now()
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastCall = Date.now()
}

async function request(path: string, init: RequestInit = {}, attempt = 1): Promise<any> {
  await throttle()
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token()}`,
      'Notion-Version': VERSION,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  // 429 帶 Retry-After（秒）。重試三次還不行就讓它爆，不要靜靜地產出半份資料。
  if (res.status === 429 && attempt <= 3) {
    const after = Number(res.headers.get('Retry-After') || 1) * 1000
    await new Promise(r => setTimeout(r, after))
    return request(path, init, attempt + 1)
  }
  if (!res.ok) {
    throw new Error(`Notion ${init.method || 'GET'} ${path} → ${res.status} ${await res.text()}`)
  }
  return res.json()
}

let cachedToken: string | undefined
function token() {
  if (cachedToken) return cachedToken
  const t = process.env.NOTION_TOKEN
  if (!t) {
    throw new Error(
      '缺少 NOTION_TOKEN。到 https://www.notion.so/my-integrations 建一個 internal integration，'
      + '把 secret 放進專案根目錄的 .env，再把三個資料庫用「Connections」加入這個 integration。',
    )
  }
  cachedToken = t
  return t
}

export interface NotionPage {
  id: string
  properties: Record<string, any>
  [k: string]: any
}

/** 查一個資料庫的全部資料列，自動翻頁。filter 用 Notion 的 filter 物件格式。 */
export async function queryDatabase(databaseId: string, filter?: object): Promise<NotionPage[]> {
  const out: NotionPage[] = []
  let cursor: string | undefined

  do {
    const body: Record<string, unknown> = { page_size: 100 }
    if (filter) body.filter = filter
    if (cursor) body.start_cursor = cursor

    const page = await request(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    out.push(...page.results)
    cursor = page.has_more ? page.next_cursor : undefined
  } while (cursor)

  return out
}

/** 一頁的所有頂層 block，自動翻頁。巢狀 block 我們用不到，不遞迴。 */
export async function pageBlocks(pageId: string): Promise<any[]> {
  const out: any[] = []
  let cursor: string | undefined

  do {
    const qs = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100'
    const page = await request(`/blocks/${pageId}/children${qs}`)
    out.push(...page.results)
    cursor = page.has_more ? page.next_cursor : undefined
  } while (cursor)

  return out
}

/* ---- 屬性讀取。Notion 每種型別的形狀都不一樣，統一收在這裡 ---- */

export function plainText(prop: any): string {
  const rich = prop?.rich_text ?? prop?.title
  if (!Array.isArray(rich)) return ''
  return rich.map((r: any) => r.plain_text).join('').trim()
}

export function selectName(prop: any): string {
  return prop?.select?.name ?? ''
}

export function multiSelectNames(prop: any): string[] {
  return (prop?.multi_select ?? []).map((o: any) => o.name)
}

export function checkbox(prop: any): boolean {
  return prop?.checkbox === true
}

export function dateStart(prop: any): string {
  return prop?.date?.start?.slice(0, 10) ?? ''
}

export function num(prop: any): number | undefined {
  return typeof prop?.number === 'number' ? prop.number : undefined
}

/** relation 只回傳 page id；要對應成 slug 得先把目標資料庫查一次建表。 */
export function relationIds(prop: any): string[] {
  return (prop?.relation ?? []).map((r: any) => r.id)
}

/**
 * files 屬性的第一個檔案網址。Notion 自己託管的檔案網址約 1 小時後失效，
 * 所以拿到之後一定要當場下載（§13.5），不能存進資料檔給前端用。
 */
export function firstFileUrl(prop: any): string | undefined {
  const f = (prop?.files ?? [])[0]
  if (!f) return undefined
  return f.type === 'external' ? f.external?.url : f.file?.url
}

/** blocks 轉成 { h2, paras }[]。H2 開一個新段，H2 之前的段落沒有歸屬，直接丟掉。 */
export function blocksToSections(blocks: any[]): { h2: string; paras: string[] }[] {
  const sections: { h2: string; paras: string[] }[] = []

  for (const b of blocks) {
    if (b.type === 'heading_2') {
      sections.push({ h2: plainText(b.heading_2), paras: [] })
      continue
    }
    if (b.type !== 'paragraph') continue
    const text = plainText(b.paragraph)
    if (!text) continue
    // 沒有 H2 就先出現的段落沒地方放。這是內容寫錯了，講出來比默默吞掉好。
    if (!sections.length) {
      console.warn(`  ⚠ 有段落出現在第一個 H2 之前，已略過：「${text.slice(0, 20)}…」`)
      continue
    }
    sections[sections.length - 1]!.paras.push(text)
  }

  return sections.filter(s => s.h2)
}
