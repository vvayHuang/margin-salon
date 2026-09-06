/**
 * 預約與應徵的前後端共用契約（PRD F-06／F-10／F-11）。
 *
 * 這一份同時被 `app/` 與 `server/` import，所以**不要**在這裡碰任何
 * 只有其中一邊有的東西（no `process.env`、no `useState`）。驗證規則寫一次，
 * 前端拿來畫錯誤態、後端拿來擋髒資料，兩邊不會各長一套。
 */
import { MENU, STYLISTS, phoneBad, type StylistId } from './margin'

/**
 * 月曆固定顯示 2026 年 9 月（README「還是暫代的部分」）。
 * 流程裡到處在傳「幾號」這個整數，真正打 API 要的是 Y-m-d，
 * 換算只走這一個常數，之後接上換月的箭頭時改這裡。
 */
export const BOOKING_MONTH = '2026-09'

/** 12 → '2026-09-12' */
export function bookingDate(day: number) {
  return `${BOOKING_MONTH}-${String(day).padStart(2, '0')}`
}

/** '2026-09-12' → 12；不是本月的日期回 0 */
export function bookingDay(date: string) {
  return date.startsWith(BOOKING_MONTH + '-') ? Number(date.slice(8, 10)) || 0 : 0
}

/* ---------------------------------------------------------------- 日曆／時段 */

/** 日期格的狀態，與 MgDatePicker 的 DayCell 對齊 */
export type DayState = 'available' | 'past' | 'full' | 'selected' | 'selected-unavailable'
export type SlotState = 'available' | 'full' | 'selected' | 'loading'

export interface AvailabilityResponse {
  month: string
  /** 只回「客觀事實」：可約或不可約。selected 是前端自己疊上去的 */
  days: { day: number; state: Extract<DayState, 'available' | 'past' | 'full'> }[]
  /** 這批空檔是真的來自 Google 日曆，還是站上的示範資料 */
  live: boolean
}

export interface SlotsResponse {
  date: string
  times: { time: string; state: Extract<SlotState, 'available' | 'full'> }[]
  /** 該日完全排不進所選服務時，給三個替代時段（高擬真稿的 NO ROOM THAT DAY） */
  alternatives: { date: string; time: string }[]
  live: boolean
}

/* ---------------------------------------------------------------- 預約送出 */

export interface BookingPayload {
  /** 設計師代號，或 'any' 表示不指定 */
  stylist: StylistId | 'any'
  /** MENU 的項目 id，可複選 */
  services: string[]
  /** Y-m-d */
  date: string
  /** H:i */
  time: string
  name: string
  phone: string
  /** 寄預約確認信要用（F-10）。這是唯一能主動聯絡到顧客的欄位，所以必填。 */
  email: string
  note?: string
  first?: '是' | '否'
  len?: '短' | '中長' | '長'
}

export interface BookingResult {
  /** 顧客看到的預約編號 */
  code: string
  stylist: string
  service: string
  /** 已整理成中文的時間字串 */
  time: string
  /** 加入行事曆用的原始開始時間，Y-m-dTH:i（Asia/Taipei） */
  start: string
  /** 預估時長，分鐘 */
  minutes: number
  price: number
  /** 這筆是不是真的進了設計師的日曆（false 代表站上的示範模式） */
  live: boolean
  /** 確認信有沒有真的寄出去（沒設定寄信服務時是 false） */
  mailed: boolean
  /** 取消／改期連結，沒設定時是空字串，畫面改成請對方來電 */
  cancelUrl: string
}

/* ---------------------------------------------------------------- 應徵 */

export interface CareersPayload {
  name: string
  phone: string
  role: '設計師' | '助理'
  link?: string
  note?: string
  agree: boolean
  /** 蜜罐欄位：真人看不到，填了就是機器人 */
  company?: string
}

export interface CareersResult {
  /** 通知信有沒有真的寄到店裡 */
  mailed: boolean
}

/* ---------------------------------------------------------------- 驗證 */

/** 只擋明顯不是 email 的字串，不做 RFC 等級的較真 —— 真正的驗證是那封信寄不寄得到 */
export function emailBad(email: string) {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

const STYLIST_IDS = STYLISTS.map(s => s.value) as string[]
const MENU_IDS = MENU.map(m => m.id)

/**
 * 回第一個問題的中文說明，沒問題回空字串。
 * 前端已經用同樣的規則把送出鍵停用了，這裡是第二道 —— 直接打 API 的請求也要擋得住。
 */
export function bookingProblem(p: Partial<BookingPayload>): string {
  if (!p.stylist || (p.stylist !== 'any' && !STYLIST_IDS.includes(p.stylist))) return '設計師選項不正確'
  if (!Array.isArray(p.services) || !p.services.length) return '還沒選服務項目'
  if (p.services.some(id => !MENU_IDS.includes(id))) return '服務項目不正確'
  if (!p.date || bookingDay(p.date) === 0) return '日期不正確'
  if (!p.time || !/^\d{2}:\d{2}$/.test(p.time)) return '時段不正確'
  if (!p.name?.trim()) return '還沒填姓名'
  if (!p.phone || phoneBad(p.phone)) return '手機號碼看起來不對'
  if (!p.email || emailBad(p.email)) return 'Email 看起來不對'
  return ''
}

export function careersProblem(p: Partial<CareersPayload>): string {
  if (!p.name?.trim()) return '還沒填姓名'
  if (!p.phone || phoneBad(p.phone)) return '手機號碼看起來不對'
  if (p.role !== '設計師' && p.role !== '助理') return '應徵職位不正確'
  if (p.role === '設計師' && !p.link?.trim()) return '應徵設計師請附作品集或履歷連結'
  if (!p.agree) return '需要勾選同意個資使用'
  return ''
}
