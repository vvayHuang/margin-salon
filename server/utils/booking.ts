/**
 * 空檔計算（PRD F-06 步驟 3、§6.9 預約規則）。
 *
 * 前端只有一條路徑：問這裡要日期狀態與時段。接上 Google 日曆就是真實空檔，
 * 沒接上就回站上的示範資料 —— 判斷寫在後端，`/booking` 那一頁不必分兩套邏輯。
 *
 * 「有沒有空」這件事的規則全部在這裡，不在 Google 那邊：
 *   - 營業時間是 SLOT_TIMES（11:00–18:00 開始）＋ CLOSE_TIME（20:00 打烊）
 *   - 週一公休是 CLOSED_DAYS
 *   - 需提前 LEAD_MINUTES 分鐘預約（PRD §6.9）
 *   - 服務要做多久由 MENU 決定，做不完就不開放那個時段
 * Google 日曆只回答一件事：這位設計師哪幾段時間已經有事了。
 *
 * 示範資料逐條對回高擬真稿：9/1–9/4 已過、每週一公休、12:00 與 15:00 已滿、
 * 9/12 當天排不下（NO ROOM THAT DAY）。
 */
import {
  CLOSED_DAYS,
  FULL_TIMES,
  MENU,
  NO_ROOM_DAY,
  SLOT_TIMES,
  type StylistId,
} from '#shared/margin'
import {
  BOOKING_MONTH,
  bookingDate,
  type AvailabilityResponse,
  type SlotsResponse,
} from '#shared/booking'
import { busyByStylist, mapped, type Busy } from './gcal'

/** 打烊時間。做得完才開放 —— 18:00 開始的三小時服務會超過，那個時段就不給選。 */
const CLOSE_TIME = '20:00'
/** 需提前一小時預約，當日可預約（PRD §6.9） */
const LEAD_MINUTES = 60
const MONTH_DAYS = 30

/** 高擬真稿寫的是 9/13、9/14、9/16，但 9/14 是週一公休，不能拿來當替代時段。改成 9/15。 */
const DEMO_ALTERNATIVES: [number, string][] = [[13, '15:00'], [15, '11:30'], [16, '16:00']]
const DEMO_PAST_UNTIL = 4

/* ---------------------------------------------------------------- 時間工具 */

/** 台灣沒有日光節約時間，固定 +08:00 就夠準，不必拉時區資料庫進來 */
const OFFSET = '+08:00'

export function iso(date: string, time: string) {
  return `${date}T${time.length === 5 ? time + ':00' : time}${OFFSET}`
}

/**
 * 從一個 +08:00 的時間往後推 N 分鐘，回傳的**還是 +08:00 的字串**。
 * 不要圖方便用 `new Date(...).toISOString()` —— 那會回 UTC 的 Z 格式，
 * 於是同一個 events.insert 請求裡 start 是 +08:00、end 是 Z，
 * 時間點雖然對，但兩種格式混用很難讀也很容易在之後改壞。
 */
export function plusMinutes(startIso: string, minutes: number) {
  const shifted = new Date(Date.parse(startIso) + (minutes + 8 * 60) * 60_000)
  return shifted.toISOString().slice(0, 19) + OFFSET
}

function ms(date: string, time: string) {
  return Date.parse(iso(date, time))
}

/** 這一輪服務總共要多久。沒選項目時當成一個時段（60 分），至少擋得住明顯排不下的時間。 */
export function totalMinutes(services: string[]) {
  const sum = MENU.filter(m => services.includes(m.id)).reduce((a, b) => a + b.minutes, 0)
  return sum || 60
}

function overlaps(start: number, end: number, busy: Busy[]) {
  return busy.some(b => start < b.end && end > b.start)
}

/* ---------------------------------------------------------------- 核心規則 */

/**
 * 某一天、某一位設計師，每個時段能不能約。
 * 已滿的時段**照樣回傳**、標成 full —— PRD §6.9 明講「已滿顯示為停用態，不隱藏」。
 */
function slotStates(date: string, busy: Busy[], minutes: number) {
  const closeMs = ms(date, CLOSE_TIME)
  const earliest = Date.now() + LEAD_MINUTES * 60_000

  return SLOT_TIMES.map((time) => {
    const start = ms(date, time)
    const end = start + minutes * 60_000
    const ok = end <= closeMs && start >= earliest && !overlaps(start, end, busy)
    return { time, state: ok ? 'available' as const : 'full' as const }
  })
}

/** 把幾位設計師的時段狀態疊起來：只要有一位空著，這個時段就約得到 */
function mergeSlots(perStylist: { time: string; state: 'available' | 'full' }[][]) {
  return SLOT_TIMES.map((time, i) => ({
    time,
    state: perStylist.some(list => list[i]?.state === 'available')
      ? 'available' as const
      : 'full' as const,
  }))
}

/* ---------------------------------------------------------------- 對外 */

/** 整個月的日期狀態 */
export async function availability(
  month: string,
  stylist: StylistId | 'any',
  services: string[],
): Promise<AvailabilityResponse> {
  const live = month === BOOKING_MONTH && mapped(stylist)

  if (live) {
    const minutes = totalMinutes(services)
    const busy = await busyByStylist(
      iso(bookingDate(1), '00:00'),
      iso(bookingDate(MONTH_DAYS), '23:59'),
      stylist,
    )
    const lists = Object.values(busy) as Busy[][]
    const today = new Date().toISOString().slice(0, 10)

    const days = Array.from({ length: MONTH_DAYS }, (_, i) => {
      const day = i + 1
      const date = bookingDate(day)
      if (date < today) return { day, state: 'past' as const }
      if (CLOSED_DAYS.includes(day)) return { day, state: 'full' as const }

      const open = mergeSlots(lists.map(list => slotStates(date, list, minutes)))
        .some(s => s.state === 'available')
      return { day, state: open ? 'available' as const : 'full' as const }
    })
    return { month, days, live: true }
  }

  const days = Array.from({ length: MONTH_DAYS }, (_, i) => {
    const day = i + 1
    if (day <= DEMO_PAST_UNTIL) return { day, state: 'past' as const }
    if (CLOSED_DAYS.includes(day)) return { day, state: 'full' as const }
    return { day, state: 'available' as const }
  })
  return { month, days, live: false }
}

/** 某一天的時段。整天都排不下時附上三個替代時間。 */
export async function slots(
  date: string,
  stylist: StylistId | 'any',
  services: string[],
): Promise<SlotsResponse> {
  const live = mapped(stylist)

  if (live) {
    const minutes = totalMinutes(services)
    const busy = await busyByStylist(iso(date, '00:00'), iso(date, '23:59'), stylist)
    const times = mergeSlots(
      (Object.values(busy) as Busy[][]).map(list => slotStates(date, list, minutes)),
    )

    let alternatives: SlotsResponse['alternatives'] = []
    if (!times.some(t => t.state === 'available')) {
      alternatives = await nextOpenings(date, stylist, minutes)
    }
    return { date, times, alternatives, live: true }
  }

  const day = Number(date.slice(8, 10))
  if (day === NO_ROOM_DAY) {
    return {
      date,
      times: [],
      alternatives: DEMO_ALTERNATIVES.map(([d, time]) => ({ date: bookingDate(d), time })),
      live: false,
    }
  }
  return {
    date,
    times: SLOT_TIMES.map(time => ({
      time,
      state: FULL_TIMES.includes(time) ? 'full' as const : 'available' as const,
    })),
    alternatives: [],
    live: false,
  }
}

/** 那天全滿的時候，往後找七天湊三個約得到的時間 */
async function nextOpenings(date: string, stylist: StylistId | 'any', minutes: number) {
  const day = Number(date.slice(8, 10))
  const to = Math.min(day + 7, MONTH_DAYS)
  if (day >= to) return []

  const busy = await busyByStylist(
    iso(bookingDate(day + 1), '00:00'),
    iso(bookingDate(to), '23:59'),
    stylist,
  )
  const lists = Object.values(busy) as Busy[][]
  const out: { date: string; time: string }[] = []

  for (let d = day + 1; d <= to && out.length < 3; d++) {
    if (CLOSED_DAYS.includes(d)) continue
    const on = bookingDate(d)
    for (const slot of mergeSlots(lists.map(list => slotStates(on, list, minutes)))) {
      if (slot.state === 'available' && out.length < 3) out.push({ date: on, time: slot.time })
    }
  }
  return out
}

/**
 * 這個時段是哪一位設計師空著的。不指定設計師時用來決定要把預約掛在誰身上。
 * 也是送出前的最後一次確認 —— 前端拿到空檔到按下送出之間，別人可能先約走了。
 */
export async function freeStylist(
  date: string,
  time: string,
  stylist: StylistId | 'any',
  services: string[],
): Promise<StylistId | null> {
  const minutes = totalMinutes(services)
  const busy = await busyByStylist(iso(date, '00:00'), iso(date, '23:59'), stylist)

  for (const [id, list] of Object.entries(busy) as [StylistId, Busy[]][]) {
    const slot = slotStates(date, list, minutes).find(s => s.time === time)
    if (slot?.state === 'available') return id
  }
  return null
}
