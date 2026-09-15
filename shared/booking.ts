/**
 * 預約與應徵的前後端共用契約（PRD F-06／F-10／F-11）。
 *
 * 這一份同時被 `app/` 與 `server/` import，所以**不要**在這裡碰任何
 * 只有其中一邊有的東西（no `process.env`、no `useState`）。驗證規則寫一次，
 * 前端拿來畫錯誤態、後端拿來擋髒資料，兩邊不會各長一套。
 */
import { CLOSED_DAYS, MENU, STYLISTS, phoneBad, type StylistId } from './margin'

/**
 * 月曆固定顯示 2026 年 9 月（docs/開發筆記.md「還是暫代的部分」）。
 * 流程裡到處在傳「幾號」這個整數，真正打 API 要的是 Y-m-d，
 * 換算只走這一個常數，之後接上換月的箭頭時改這裡。
 */
export const BOOKING_MONTH = '2026-09'

/** 12 → '2026-09-12' */
export function bookingDate(day: number) {
  return `${BOOKING_MONTH}-${String(day).padStart(2, '0')}`
}

/**
 * '2026-09-12' → 12；格式不對、不是本月、或本月沒有這一天都回 0。
 * 以前只比對前綴，'2026-09-12 後面接任何字' 與 '2026-09-99' 都過得去，
 * 後面那段字會一路帶進預約編號與確認信主旨（資安報告 F4）。
 */
export function bookingDay(date: string) {
  const match = new RegExp(`^${BOOKING_MONTH}-(\\d{2})$`).exec(String(date))
  const day = match ? Number(match[1]) : 0
  // 9 月只有 30 天
  return day >= 1 && day <= 30 ? day : 0
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
  /**
   * 沒寄成功的話是哪一種。兩者要分開講：
   * `not-configured` 是這個環境根本沒接寄信服務（作品集展示時的正常狀態）；
   * `send-failed` 是接了但寄失敗（例如 Resend 沒驗證網域，只能寄給自己）。
   * 混在一起說會讓人往錯的方向查。
   */
  reason?: 'not-configured' | 'send-failed' | ''
}

/* ---------------------------------------------------------------- 驗證 */

/**
 * 只擋明顯不是 email 的字串，不做 RFC 等級的較真 —— 真正的驗證是那封信寄不寄得到。
 *
 * 兩道防 ReDoS（資安報告 F1）：
 * 1. 先擋長度。254 是 email 位址的上限，超過就不用跑正則。
 * 2. 網域段的字元類別排除「.」，每一段的邊界由點決定，量詞之間不重疊。
 *    舊寫法 `[^\s@]+\.[^\s@]{2,}` 讓點同時屬於兩個量詞，一長串點就是二次方回溯。
 */
export function emailBad(email: string) {
  const value = email.trim()
  if (value.length > 254) return true
  return !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value)
}

/**
 * 姓名與備註的上限（資安報告 F4）。
 * 確認信會寄到「填表的人自己填的」信箱，沒有人確認那真的是他的——
 * 所以會進到確認信的自由文字要短，而且不能帶網址，免得被拿來寄釣魚信。
 * 備註已經不進確認信（只進店內通知與日曆），上限是為了日曆與通知信的版面。
 */
export const NAME_MAX = 30
export const NOTE_MAX = 300

/** 網址的樣子：協定、www、或常見網域結尾。姓名欄沒有理由出現這些 */
const LINK_LIKE = /(https?:\/\/|www\.|\.(com|net|org|io|co|tw|me|app|link|xyz)\b)/i

/** 沒填、太長、或夾著網址 */
export function nameBad(name: string) {
  const value = name.trim()
  return !value || value.length > NAME_MAX || LINK_LIKE.test(value)
}

const STYLIST_IDS = STYLISTS.map(s => s.value) as string[]
const MENU_IDS = MENU.map(m => m.id)

const isText = (value: unknown): value is string => typeof value === 'string'

/**
 * 回第一個問題的中文說明，沒問題回空字串。
 * 前端已經用同樣的規則把送出鍵停用了，這裡是第二道 —— 直接打 API 的請求也要擋得住，
 * 所以每個欄位都先確認型別：JSON 裡的數字或陣列不能讓 `.trim()` 直接炸成 500。
 */
export function bookingProblem(p: Partial<BookingPayload>): string {
  if (!p || typeof p !== 'object') return '資料格式不正確'
  if (!isText(p.stylist) || (p.stylist !== 'any' && !STYLIST_IDS.includes(p.stylist))) return '設計師選項不正確'
  if (!Array.isArray(p.services) || !p.services.length) return '還沒選服務項目'
  if (p.services.some(id => !MENU_IDS.includes(id))) return '服務項目不正確'
  if (!isText(p.date) || bookingDay(p.date) === 0) return '日期不正確'
  // 週一公休原本只在月曆那層擋，直接打 API 就約得到（資安報告 F5）
  if (CLOSED_DAYS.includes(bookingDay(p.date))) return '週一公休，請換一天'
  // 只驗格式，不限定 SLOT_TIMES：示範模式的替代時段有 11:30。
  // 接上日曆時，送出前的 freeStylist 只認 SLOT_TIMES 裡的時間，範圍外的會回「被約走」。
  if (!isText(p.time) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time)) return '時段不正確'
  if (!isText(p.name) || !p.name.trim()) return '還沒填姓名'
  if (nameBad(p.name)) return `姓名請在 ${NAME_MAX} 字以內，也不要放網址`
  if (!isText(p.phone) || phoneBad(p.phone)) return '手機號碼看起來不對'
  if (!isText(p.email) || emailBad(p.email)) return 'Email 看起來不對'
  if (p.note !== undefined && (!isText(p.note) || p.note.length > NOTE_MAX)) return `備註請在 ${NOTE_MAX} 字以內`
  if (p.first !== undefined && p.first !== '是' && p.first !== '否') return '是否第一次到店的選項不正確'
  if (p.len !== undefined && p.len !== '短' && p.len !== '中長' && p.len !== '長') return '髮長選項不正確'
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
