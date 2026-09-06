import { bookingDay } from '#shared/booking'
import type { StylistId } from '#shared/margin'

/**
 * 某一天的可預約時段。
 * GET /api/booking/slots?date=2026-09-10&stylist=yuki&services=cut1,color1
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const date = String(q.date ?? '')
  if (!bookingDay(date)) {
    throw createError({ statusCode: 400, statusMessage: 'date 必須是 2026-09-DD' })
  }

  const stylist = ((q.stylist as string) || 'any') as StylistId | 'any'
  const services = String(q.services ?? '').split(',').filter(Boolean)

  try {
    return await slots(date, stylist, services)
  }
  catch (err) {
    console.error('[booking] slots →', err)
    return await slots(date, 'any', [])
  }
})
