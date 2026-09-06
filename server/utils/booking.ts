/**
 * 空檔查詢（PRD F-06 步驟 3）。
 *
 * 前端只有一條路徑：問這裡要日期狀態與時段。設定了 SimplyBook 就回真實空檔，
 * 沒設定就回站上的示範資料 —— 判斷寫在後端，`/booking` 那一頁不必分兩套邏輯。
 *
 * 示範資料逐條對回高擬真稿：9/1–9/4 已過、每週一公休、12:00 與 15:00 已滿、
 * 9/12 當天排不下（NO ROOM THAT DAY）。只修掉稿子裡的一個矛盾，見 DEMO_ALTERNATIVES。
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
import { mapped, primaryEvent, timeMatrix } from './simplybook'

/** 高擬真稿寫的是 9/13、9/14、9/16，但 9/14 是週一公休，不能拿來當替代時段。改成 9/15。 */
const DEMO_ALTERNATIVES: [number, string][] = [[13, '15:00'], [15, '11:30'], [16, '16:00']]
const DEMO_PAST_UNTIL = 4
const DEMO_MONTH_DAYS = 30

function minutesOf(id: string) {
  return MENU.find(m => m.id === id)?.minutes ?? 0
}

/** 這一輪要送進 SimplyBook 的主項目（時間最長的那一個） */
export function mainService(services: string[]) {
  return primaryEvent(services, minutesOf)
}

/** 空檔查詢每分鐘最多打一次 SimplyBook，同一個月同一位設計師連點不會變成連續請求 */
const cache = new Map<string, { at: number; value: Record<string, string[]> }>()
const CACHE_MS = 60_000

async function matrix(from: string, to: string, service: string, stylist: StylistId | 'any') {
  const key = `${from}|${to}|${service}|${stylist}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value

  const value = await timeMatrix(from, to, service, stylist)
  cache.set(key, { at: Date.now(), value })
  return value
}

/** 整個月的日期狀態 */
export async function availability(
  month: string,
  stylist: StylistId | 'any',
  services: string[],
): Promise<AvailabilityResponse> {
  const service = mainService(services)
  const live = month === BOOKING_MONTH && mapped(stylist, service)

  if (live) {
    const found = await matrix(bookingDate(1), bookingDate(DEMO_MONTH_DAYS), service, stylist)
    const days = Array.from({ length: DEMO_MONTH_DAYS }, (_, i) => {
      const day = i + 1
      const open = (found[bookingDate(day)] ?? []).length > 0
      return { day, state: open ? 'available' as const : 'full' as const }
    })
    return { month, days, live: true }
  }

  const days = Array.from({ length: DEMO_MONTH_DAYS }, (_, i) => {
    const day = i + 1
    if (day <= DEMO_PAST_UNTIL) return { day, state: 'past' as const }
    if (CLOSED_DAYS.includes(day)) return { day, state: 'full' as const }
    return { day, state: 'available' as const }
  })
  return { month, days, live: false }
}

/** 某一天的時段。沒有任何時段時附上三個替代時間。 */
export async function slots(
  date: string,
  stylist: StylistId | 'any',
  services: string[],
): Promise<SlotsResponse> {
  const service = mainService(services)
  const live = mapped(stylist, service)

  if (live) {
    const found = await matrix(date, date, service, stylist)
    const open = new Set((found[date] ?? []).map(t => t.slice(0, 5)))
    const times = [...open].sort().map(time => ({ time, state: 'available' as const }))

    // 全滿的時候往後找七天，湊三個能約的時間出來
    let alternatives: SlotsResponse['alternatives'] = []
    if (!times.length) {
      const day = Number(date.slice(8, 10))
      const to = Math.min(day + 7, DEMO_MONTH_DAYS)
      const ahead = day < to ? await matrix(bookingDate(day + 1), bookingDate(to), service, stylist) : {}
      alternatives = Object.entries(ahead)
        .flatMap(([d, list]) => list.map(t => ({ date: d, time: t.slice(0, 5) })))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 3)
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
