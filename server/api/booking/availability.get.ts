import { BOOKING_MONTH } from '#shared/booking'
import type { StylistId } from '#shared/margin'

/**
 * 月曆的日期狀態。`/booking` 第三步一進去就打這支。
 * 有接 SimplyBook 就是真的空檔，沒接就是站上的示範資料 —— 前端不分兩套。
 *
 * GET /api/booking/availability?month=2026-09&stylist=yuki&services=cut1,color1
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const month = (q.month as string) || BOOKING_MONTH
  const stylist = ((q.stylist as string) || 'any') as StylistId | 'any'
  const services = String(q.services ?? '').split(',').filter(Boolean)

  try {
    return await availability(month, stylist, services)
  }
  catch (err) {
    // 預約系統掛了不該讓整頁空白：退回示範資料，並在日誌裡留下原因。
    console.error('[booking] availability →', err)
    return await availability(month, 'any', [])
  }
})
