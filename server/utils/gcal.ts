/**
 * Google 日曆（PRD F-06、D-12）。
 *
 * 設計師本來就在用日曆，所以這裡不引進第二套後台：
 * **空檔就是日曆上沒事的時段，預約就是日曆上多一個事件。**
 * 店家要看今天有誰要來，打開自己的 Google 日曆就好。
 *
 * 跟 `scripts/lib/notion.ts`、`server/utils/mail.ts` 同一個判斷：不裝 googleapis。
 * 我們只用到三個端點（拿 token、freeBusy、events.insert），
 * service account 的 JWT 用 node 內建的 crypto 就簽得出來，
 * 為此拉進一包上百檔案的 SDK 並不划算。
 *
 * 身分走 service account：把每位設計師的日曆分享給 service account 的信箱、
 * 給「變更活動」權限就好，不需要任何人跑 OAuth 同意畫面。
 *
 * 沒設定 service account 金鑰時 `isLive()` 回 false，
 * 呼叫端會退回站上的示範空檔 —— 這是一個作品集網站，沒有金鑰也要跑得起來。
 */
import { createSign } from 'node:crypto'
import { STYLISTS, type StylistId } from '#shared/margin'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const CAL_API = 'https://www.googleapis.com/calendar/v3'

/**
 * 只要兩個範圍：freeBusy 要讀、建立預約要寫活動。
 * 不要 `auth/calendar` 那個全權範圍 —— 那把權限包含刪掉整本日曆。
 */
const SCOPE = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ')

/** Google 的 access token 一小時到期，抓 55 分鐘換一次，留一點餘裕 */
const TOKEN_TTL_MS = 55 * 60 * 1000
const TIMEOUT_MS = 8000

export class GcalError extends Error {
  status: number
  /** 時段已經被佔走（活動 id 撞號）。呼叫端靠這個決定要不要跳「時段被搶走」 */
  taken: boolean
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.taken = status === 409
  }
}

/* ---------------------------------------------------------------- 設定 */

function credentials() {
  const c = useRuntimeConfig()
  return {
    email: c.googleSaEmail as string,
    /**
     * .env 裡的私鑰是一整行、換行寫成字面上的 \n，
     * 這裡還原成真的換行，不然 crypto 讀不出 PEM。
     */
    key: (c.googleSaKey as string || '').replace(/\\n/g, '\n'),
  }
}

export function isLive() {
  const { email, key } = credentials()
  return !!email && !!key
}

/** 設計師 → 日曆 id。日曆 id 是一組信箱，屬於部署身分，所以放環境變數不進版控。 */
export function calendarFor(stylist: StylistId): string {
  const c = useRuntimeConfig()
  return (c.gcal as Record<string, string>)[stylist] || ''
}

/** 這一輪要查哪幾位。指定就一位，不指定就是所有「已經接上日曆」的設計師。 */
export function stylistsFor(stylist: StylistId | 'any'): StylistId[] {
  const all = stylist === 'any' ? STYLISTS.map(s => s.value) : [stylist]
  return all.filter(id => !!calendarFor(id))
}

/** 這一組有沒有真的接上日曆，沒有就走示範資料 */
export function mapped(stylist: StylistId | 'any') {
  return isLive() && stylistsFor(stylist).length > 0
}

/* ---------------------------------------------------------------- 身分 */

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url')
}

let cached: { token: string; until: number } | undefined

/**
 * service account 的 JWT bearer 流程：自己簽一個 JWT，換一個 access token。
 * 這是 OAuth2 的 `urn:ietf:params:oauth:grant-type:jwt-bearer`，沒有互動步驟。
 */
async function token(force = false) {
  if (!force && cached && cached.until > Date.now()) return cached.token

  const { email, key } = credentials()
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }

  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claim))}`
  let signature: string
  try {
    signature = createSign('RSA-SHA256').update(unsigned).sign(key, 'base64url')
  }
  catch {
    throw new GcalError(500, 'NUXT_GOOGLE_SA_KEY 不是一把讀得出來的私鑰，確認整段 PEM 都有貼進來（含 BEGIN／END 那兩行）')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new GcalError(res.status, `Google 換 token 失敗：${await res.text()}`)

  const body = await res.json() as { access_token: string }
  cached = { token: body.access_token, until: Date.now() + TOKEN_TTL_MS }
  return body.access_token
}

/** 打一個日曆 API。401 就重換一次 token 再試，只重試一次。 */
async function call(path: string, init: RequestInit, retried = false): Promise<any> {
  const res = await fetch(`${CAL_API}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${await token()}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  if (res.status === 401 && !retried) {
    cached = undefined
    return call(path, init, true)
  }
  if (!res.ok) throw new GcalError(res.status, `Google Calendar ${path} → ${res.status} ${await res.text()}`)
  return res.json()
}

/* ---------------------------------------------------------------- 查空檔 */

export interface Busy { start: number; end: number }

/**
 * 一次問完所有設計師在這段期間的忙碌區間。
 * freeBusy 一個請求最多吃 50 本日曆，所以整個月、四個人也只是一次往返。
 *
 * 某本日曆讀不到（沒分享給 service account）時 Google 會在 `errors` 裡回報，
 * 我們把那一位當成「沒接上」讓他退回示範資料，而不是當成「整天都有空」——
 * 後者會讓網站把根本約不到的時段賣出去。
 */
export async function busyByStylist(
  fromIso: string,
  toIso: string,
  stylist: StylistId | 'any',
): Promise<Partial<Record<StylistId, Busy[]>>> {
  const ids = stylistsFor(stylist)
  if (!ids.length) return {}

  const body = await call('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({
      timeMin: fromIso,
      timeMax: toIso,
      timeZone: 'Asia/Taipei',
      items: ids.map(id => ({ id: calendarFor(id) })),
    }),
  }) as { calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }> }

  const out: Partial<Record<StylistId, Busy[]>> = {}
  for (const id of ids) {
    const entry = body.calendars?.[calendarFor(id)]
    if (!entry || entry.errors?.length) {
      console.error(`[gcal] ${id} 的日曆讀不到：`, entry?.errors ?? 'no entry')
      continue
    }
    out[id] = (entry.busy ?? []).map(b => ({
      start: Date.parse(b.start),
      end: Date.parse(b.end),
    }))
  }
  return out
}

/* ---------------------------------------------------------------- 建立預約 */

export interface EventInput {
  calendarId: string
  /** 我們自己指定的活動 id，同一位設計師的同一個時段只會有一個 —— 撞號就是被搶走了 */
  id: string
  summary: string
  description: string
  location: string
  startIso: string
  endIso: string
}

/**
 * 在設計師的日曆上建一個活動。
 *
 * 活動 id 由「日期＋時間＋設計師」算出來，所以同一位設計師的同一個起始時間
 * 只可能存在一個活動，Google 會用 409 擋掉第二個。這是我們唯一拿得到的
 * 原子性保證 —— 但它只擋得住「起始時間完全一樣」，擋不住「11:00 做三小時」
 * 和「12:00 做一小時」這種重疊。所以 createEvent 之前仍然要查一次 freeBusy，
 * 那中間的空窗（幾百毫秒）就是「時段被搶走」這個狀態存在的原因。
 *
 * 不加 attendees：service account 沒有 domain-wide delegation 時不能寄邀請，
 * 加了整個請求會被拒絕。顧客那封信由 Resend 寄（F-10），本來就不靠日曆邀請。
 */
export async function createEvent(input: EventInput) {
  return await call(`/calendars/${encodeURIComponent(input.calendarId)}/events`, {
    method: 'POST',
    body: JSON.stringify({
      id: input.id,
      summary: input.summary,
      description: input.description,
      location: input.location,
      start: { dateTime: input.startIso, timeZone: 'Asia/Taipei' },
      end: { dateTime: input.endIso, timeZone: 'Asia/Taipei' },
    }),
  }) as { id: string; htmlLink: string }
}
