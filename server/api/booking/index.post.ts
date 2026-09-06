import {
  MENU,
  WEEKDAY,
  dateText,
  findStylist,
  hoursText,
  money,
  type StylistId,
} from '#shared/margin'
import { bookingDay, bookingProblem, type BookingPayload, type BookingResult } from '#shared/booking'

/**
 * 送出預約（PRD F-06）＋ 寄預約完成信（F-10）。
 *
 * 三件事依序發生，而且**順序有意義**：
 *   1. 進 SimplyBook（沒設定金鑰就跳過，回一個站內編號）
 *   2. 寄確認信給顧客
 *   3. 寄通知信到店內收件匣
 * 只有第 1 步失敗才算預約失敗。信寄不出去預約仍然成立，畫面上會改成
 * 「確認信寄送失敗，請來電確認」—— 不會因為寄信服務掛掉就叫顧客重約。
 */

/** 沒有接預約系統時的站內編號：MG-260910-4821 */
function localCode(date: string, time: string) {
  const stamp = date.slice(2).replace(/-/g, '') + time.replace(':', '')
  return `MG-${stamp.slice(0, 6)}-${stamp.slice(6)}`
}

export default defineEventHandler(async (event): Promise<BookingResult> => {
  if (tooMany(clientKey(event, 'booking'), 8, 10 * 60_000)) {
    throw createError({ statusCode: 429, statusMessage: '送出太多次了，休息一下再試，或直接來電。' })
  }

  const body = await readBody<BookingPayload>(event)
  const problem = bookingProblem(body)
  if (problem) throw createError({ statusCode: 400, statusMessage: problem })

  const stylistId = body.stylist as StylistId | 'any'
  const rows = MENU.filter(m => body.services.includes(m.id))
  const price = rows.reduce((a, b) => a + b.price, 0)
  const minutes = rows.reduce((a, b) => a + b.minutes, 0)
  const day = bookingDay(body.date)

  const stylistText = stylistId === 'any' ? '不指定' : (findStylist(stylistId)?.label ?? '')
  const serviceText = rows.map(r => r.name).join('＋')
  const timeText = `2026／09／${String(day).padStart(2, '0')}（${WEEKDAY[day % 7]}）${body.time}`

  const config = useRuntimeConfig()
  const service = mainService(body.services)
  const live = mapped(stylistId, service)

  let code = localCode(body.date, body.time)
  let cancelUrl = ''

  if (live) {
    const unit = await unitFor(body.date, body.time, service, stylistId)
    if (unit == null) {
      // 前端拿到空檔到按下送出之間有時間差，這裡是唯一能確認的地方。
      throw createError({
        statusCode: 409,
        statusMessage: '這個時段剛剛被別人約走了。',
        data: { taken: true },
      })
    }

    try {
      // additional 是 SimplyBook 的 intake form 欄位，欄位 id 每個後台都不一樣，
      // 亂填會被擋（-32070）。備註與髮長改由店內通知信帶，設計師一樣看得到。
      const record = await book({
        eventId: eventId(service)!,
        unitId: unit,
        date: body.date,
        time: body.time,
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.replace(/[\s-]/g, ''),
      })
      code = record.code || record.id
      cancelUrl = (config.simplybookCancelUrl as string)
        .replace('{id}', record.id)
        .replace('{hash}', record.hash)
    }
    catch (err) {
      if (err instanceof SimplybookError) {
        throw createError({
          statusCode: err.taken ? 409 : 502,
          statusMessage: err.message,
          data: { taken: err.taken },
        })
      }
      throw err
    }
  }

  /* ---- 通知信 ---- */

  const mailData = {
    code,
    name: body.name.trim(),
    stylist: stylistText,
    service: serviceText,
    time: timeText,
    total: `${money(price)} 起（${hoursText(minutes)}，長髮加價到店確認）`,
    phone: body.phone,
    email: body.email.trim(),
    note: body.note?.trim() ?? '',
    first: body.first === '是' ? `第一次到店 ・ ${body.len ?? ''}髮` : '來過了',
    cancelUrl,
    live,
  }

  const mailed = await sendMail(bookingMail(mailData))
  if (hasInbox()) await sendMail(bookingNotice(mailData, inboxAddress()))

  return {
    code,
    stylist: stylistText,
    service: serviceText,
    time: `${dateText(day)} ${body.time}`,
    start: `${body.date}T${body.time}`,
    minutes,
    price,
    live,
    mailed,
    cancelUrl,
  }
})
