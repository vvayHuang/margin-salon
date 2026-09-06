/**
 * 髮型誌。資料由 Notion 同步而來（PRD §13.4、F-07）——
 * `JOURNAL` 定義在 ./journal.data.ts，那份檔案是 `npm run sync:notion` 產生的，不要手改。
 * 要新增或修改文章請改 Notion 的「髮型誌 Journal」資料庫。
 *
 * **只有「狀態＝上線」的會被同步下來**（§13.5），草稿留在 Notion，不會進到 bundle 裡。
 * 內容排程見 04-SEO §8：M1 出 #1 #2 #5 #7，M2 出 #3 #4 #6 #8，M3 出剩下的。
 *
 * 這個檔案保留型別與衍生邏輯（PUBLISHED／findPost／readingMinutes／relatedPosts），
 * 它們跟資料來源無關，換 CMS 也不用動。
 */
import { JOURNAL } from './journal.data'
import type { StylistId } from './margin'

export type JournalCategory = '趨勢' | '保養知識' | '髮色圖鑑' | '店內公告'

export const JOURNAL_CATEGORIES: JournalCategory[] = ['趨勢', '保養知識', '髮色圖鑑', '店內公告']

export interface JournalSection {
  h2: string
  paras: string[]
}

export interface JournalPost {
  slug: string
  title: string
  status: '上線' | '草稿'
  category: JournalCategory
  /** public/img 檔名 */
  cover: string
  /** 60 字，列表與 meta description 共用（§13.4） */
  excerpt: string
  author: StylistId | null
  date: string
  pinned?: boolean
  body?: JournalSection[]
  /** 每篇至少連 1 次 /services 或 /booking（04-SEO §5） */
  cta?: { label: string; to: string }
}

export { JOURNAL }

/** 站上只出現「上線」的，依發布日期新到舊（§13.5） */
export const PUBLISHED = JOURNAL
  .filter(p => p.status === '上線')
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function findPost(slug: string | undefined) {
  return PUBLISHED.find(p => p.slug === slug)
}

/** 中文閱讀速度抓每分鐘 350 字 */
export function readingMinutes(post: JournalPost) {
  const chars = (post.body ?? []).reduce(
    (n, s) => n + s.h2.length + s.paras.reduce((m, p) => m + p.length, 0),
    0,
  )
  return Math.max(1, Math.round(chars / 350))
}

/** 相關文章：同分類優先，不足就補同作者，取 3 篇（§13.1 的作法搬過來） */
export function relatedPosts(post: JournalPost) {
  const others = PUBLISHED.filter(p => p.slug !== post.slug)
  const sameCat = others.filter(p => p.category === post.category)
  const rest = others.filter(p => !sameCat.includes(p))
  return [...sameCat, ...rest].slice(0, 3)
}
