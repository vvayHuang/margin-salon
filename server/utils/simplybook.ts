/**
 * SimplyBook.me 的 JSON-RPC 2.0 client（PRD F-06、D-02）。
 *
 * 跟 `scripts/lib/notion.ts` 同一個做法：不裝 SDK，一個 fetch 就夠。
 * 我們只用到五個方法（getToken／getStartTimeMatrix／book／getEventList／getUnitList），
 * 為此拉進一包相依、再跟著它升級並不划算。
 *
 * 兩個服務端點：
 *   POST /login  → getToken(companyLogin, apiKey)，拿 60 分鐘有效的 token
 *   POST /       → 其餘公開方法，用 X-Company-Login ＋ X-Token 兩個標頭帶身分
 *
 * 沒設定 SIMPLYBOOK_LOGIN／SIMPLYBOOK_API_KEY 時 `isLive()` 回 false，
 * 呼叫端會退回站上的示範資料 —— 這是一個作品集網站，沒有金鑰也要跑得起來。
 */
import { SB_EVENT, SB_UNIT } from './simplybook.map'
import type { StylistId } from '#shared/margin'

const LOGIN_URL = 'https://user-api.simplybook.me/login'
const API_URL = 'https://user-api.simplybook.me/'

/** SimplyBook 的 token 官方說法是一小時，抓 55 分鐘換一次，留一點餘裕 */
const TOKEN_TTL_MS = 55 * 60 * 1000
const TIMEOUT_MS = 8000

/** JSON-RPC 錯誤碼 → 給顧客看的中文。沒列到的走通用訊息，不把英文原文丟到畫面上。 */
const ERROR_TEXT: Record<number, string> = {
  [-32051]: '這個服務項目目前沒有開放預約，換一個項目或直接來電。',
  [-32052]: '這位設計師這個時段不接單了，換一位或換個時間。',
  [-32053]: '這個日期已經不能約了，請換一天。',
  [-32054]: '這個時段剛剛被別人約走了。',
  [-32055]: '這個時段剛剛被別人約走了。',
  [-32056]: '這個時間不在可預約範圍內，最晚要提前一小時。',
  [-32061]: '姓名的格式系統不接受，換一個寫法試試。',
  [-32062]: 'Email 看起來不對，收不到確認信。',
  [-32063]: '手機號碼的格式系統不接受。',
}

/** 呼叫端可以靠 `taken` 判斷要不要跳「時段被搶走」的對話框 */
export class SimplybookError extends Error {
  code: number
  taken: boolean
  constructor(code: number, message: string) {
    super(ERROR_TEXT[code] ?? message ?? '預約系統回了一個我們沒看過的錯誤。')
    this.code = code
    this.taken = code === -32054 || code === -32055 || code === -32053
  }
}

function credentials() {
  const { simplybookLogin, simplybookApiKey } = useRuntimeConfig()
  return { login: simplybookLogin as string, apiKey: simplybookApiKey as string }
}

/** 有沒有接上真的預約系統。false 的時候整站退回示範資料。 */
export function isLive() {
  const { login, apiKey } = credentials()
  return !!login && !!apiKey
}

let cached: { token: string; until: number } | undefined

async function rpc(url: string, method: string, params: unknown[], headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new SimplybookError(res.status, `SimplyBook ${method} → HTTP ${res.status}`)

  const body = await res.json() as { result?: unknown; error?: { code: number; message: string } }
  if (body.error) throw new SimplybookError(body.error.code, body.error.message)
  return body.result
}

async function token(force = false) {
  if (!force && cached && cached.until > Date.now()) return cached.token
  const { login, apiKey } = credentials()
  const value = await rpc(LOGIN_URL, 'getToken', [login, apiKey]) as string
  cached = { token: value, until: Date.now() + TOKEN_TTL_MS }
  return value
}

/**
 * 打一個公開方法。token 過期（-32068 / -32001 都出現過）就重登一次再試，
 * 只重試一次 —— 連兩次拿不到 token 是設定問題，不是時序問題，讓它爆比較好查。
 */
async function call(method: string, params: unknown[], retried = false): Promise<any> {
  const { login } = credentials()
  try {
    return await rpc(API_URL, method, params, {
      'X-Company-Login': login,
      'X-Token': await token(),
    })
  }
  catch (err) {
    const code = err instanceof SimplybookError ? err.code : 0
    if (!retried && (code === -32068 || code === -32001 || code === 401)) {
      cached = undefined
      return call(method, params, true)
    }
    throw err
  }
}

/* ---------------------------------------------------------------- 對照表 */

/**
 * 一次預約在我們這裡可以複選多個項目，SimplyBook 的 book() 只收一個 event。
 * 取「時間最長的那一個」當主項目送出，其餘寫進備註由設計師到店確認。
 * 要讓時數完全對齊的話，正解是在 SimplyBook 後台建「剪＋染」這種組合服務，
 * 再把它的 id 填進 SB_EVENT —— 那是後台設定，不是程式問題。
 */
export function primaryEvent(services: string[], minutesOf: (id: string) => number) {
  return [...services].sort((a, b) => minutesOf(b) - minutesOf(a))[0] ?? ''
}

export function eventId(serviceId: string) {
  return SB_EVENT[serviceId] ?? null
}

/** 指定設計師回一個 id，不指定回全部已對照的 id */
export function unitIds(stylist: StylistId | 'any'): number[] {
  if (stylist === 'any') return Object.values(SB_UNIT).filter((v): v is number => v != null)
  const id = SB_UNIT[stylist]
  return id == null ? [] : [id]
}

/** 這一組（設計師＋服務）有沒有完整對照，沒有就走示範資料 */
export function mapped(stylist: StylistId | 'any', serviceId: string) {
  return isLive() && unitIds(stylist).length > 0 && eventId(serviceId) != null
}

/* ---------------------------------------------------------------- 方法 */

export type TimeMatrix = Record<string, string[]>

/**
 * 某一段日期內、某位（或任一位）設計師做某個項目的可開始時間。
 * 回來的格式是 `{'2026-09-10': ['11:00:00', ...]}`。
 * 不指定設計師時逐一問過每一位再取聯集，因為之後 book() 需要一個具體的 unit。
 */
export async function timeMatrix(
  from: string,
  to: string,
  serviceId: string,
  stylist: StylistId | 'any',
): Promise<TimeMatrix> {
  const event = eventId(serviceId)
  const units = unitIds(stylist)
  if (event == null || !units.length) return {}

  const parts = await Promise.all(
    units.map(unit => call('getStartTimeMatrix', [from, to, event, unit, 1]) as Promise<TimeMatrix>),
  )

  const merged: TimeMatrix = {}
  for (const part of parts) {
    for (const [date, times] of Object.entries(part ?? {})) {
      merged[date] = [...new Set([...(merged[date] ?? []), ...times])].sort()
    }
  }
  return merged
}

/** 這個時段是哪一位設計師空著的。不指定設計師時用來決定要把預約掛在誰身上。 */
export async function unitFor(
  date: string,
  time: string,
  serviceId: string,
  stylist: StylistId | 'any',
): Promise<number | null> {
  const event = eventId(serviceId)
  if (event == null) return null
  for (const unit of unitIds(stylist)) {
    const matrix = await call('getStartTimeMatrix', [date, date, event, unit, 1]) as TimeMatrix
    if ((matrix?.[date] ?? []).some(t => t.slice(0, 5) === time)) return unit
  }
  return null
}

export interface BookedRecord {
  id: string
  code: string
  hash: string
  is_confirmed: string
  start_date_time: string
}

/** 建立預約。回傳 SimplyBook 的第一筆 booking 紀錄。 */
export async function book(input: {
  eventId: number
  unitId: number
  date: string
  time: string
  name: string
  email: string
  phone: string
  additional?: Record<string, string>
}): Promise<BookedRecord> {
  const result = await call('book', [
    input.eventId,
    input.unitId,
    input.date,
    // book() 要的是 H:i:s
    input.time.length === 5 ? `${input.time}:00` : input.time,
    { name: input.name, email: input.email, phone: input.phone },
    input.additional ?? {},
    1,
  ]) as { bookings?: BookedRecord[] }

  const record = result?.bookings?.[0]
  if (!record) throw new SimplybookError(-32055, '預約沒有建立成功')
  return record
}

/** 後台的服務／人員清單，只給開發模式的 /api/booking/catalog 用來填對照表 */
export async function catalog() {
  const [events, units] = await Promise.all([
    call('getEventList', [true, true]),
    call('getUnitList', [true, true]),
  ])
  return { events, units }
}
