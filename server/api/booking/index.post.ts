import {
  MENU,
  STYLISTS,
  WEEKDAY,
  BRAND,
  dateText,
  findStylist,
  hoursText,
  money,
  stylistLatin,
  type StylistId,
} from '#shared/margin'
import { bookingDay, bookingProblem, type BookingPayload, type BookingResult } from '#shared/booking'

/**
 * 送出預約（PRD F-06）＋ 寄預約完成信（F-10）。
 *
 * 三件事依序發生，而且**順序有意義**：
 *   1. 在設計師的 Google 日曆上建一個活動（沒設定金鑰就跳過，回一個站內編號）
 *   2. 寄確認信給顧客
 *   3. 寄通知信到店內收件匣
 * 只有第 1 步失敗才算預約失敗。信寄不出去預約仍然成立，畫面上會改成
 * 「確認信寄送失敗，請來電確認」—— 不會因為寄信服務掛掉就叫顧客重約。
 */

/** 顧客看到的編號：MG-260913-1500-Y，最後一碼是設計師（Shu／Yuki／Ray／An） */
function bookingCode(date: string, time: string, stylist: StylistId) {
  const stamp = date.slice(2).replace(/-/g, '')
  return `MG-${stamp}-${time.replace(':', '')}-${stylistLatin(stylist)[0]!.toUpperCase()}`
}

/**
 * Google 活動 id 只收 base32hex（a–v 與 0–9），所以不能直接用上面那個編號。
 * 用「日期＋時間＋設計師序號」算出來，同一位設計師的同一個起始時間只會有一個 id，
 * 撞號時 Google 回 409，這是我們唯一的原子性保證。
 */
function eventId(date: string, time: string, stylist: StylistId) {
  const index = STYLISTS.findIndex(s => s.value === stylist)
  return `mg${date.replace(/-/g, '')}${time.replace(':', '')}${index}`
}

export default defineEventHandler(async (event): Promise<BookingResult> => {
  if (tooMany(clientKey(event, 'booking'), 8, 10 * 60_000)) {
    throw createError({ statusCode: 429, statusMessage: '送出太多次了，休息一下再試，或直接來電。' })
  }

  const body = await readBody<BookingPayload>(event)
  const problem = bookingProblem(body)
  if (problem) throw createError({ statusCode: 400, statusMessage: problem })

  const asked = body.stylist as StylistId | 'any'
  const rows = MENU.filter(m => body.services.includes(m.id))
  const price = rows.reduce((a, b) => a + b.price, 0)
  const minutes = totalMinutes(body.services)
  const day = bookingDay(body.date)

  const serviceText = rows.map(r => r.name).join('＋')
  const timeText = `2026／09／${String(day).padStart(2, '0')}（${WEEKDAY[day % 7]}）${body.time}`

  const live = mapped(asked)
  /** 沒接上日曆時，「不指定」就維持不指定，由店家事後安排 */
  let assigned: StylistId | null = asked === 'any' ? null : asked
  let code = ''
  let cancelUrl = ''

  if (live) {
    // 前端拿到空檔到按下送出之間有時間差，這裡是唯一能確認的地方。
    const free = await freeStylist(body.date, body.time, asked, body.services)
    if (!free) {
      throw createError({
        statusCode: 409,
        statusMessage: '這個時段剛剛被別人約走了。',
        data: { taken: true },
      })
    }
    assigned = free
    code = bookingCode(body.date, body.time, free)

    const start = iso(body.date, body.time)
    const end = plusMinutes(start, minutes)

    try {
      await createEvent({
        calendarId: calendarFor(free),
        id: eventId(body.date, body.time, free),
        summary: `${body.name.trim()} ・ ${serviceText}`,
        description: [
          `預約編號：${code}`,
          `姓名：${body.name.trim()}`,
          `電話：${body.phone}`,
          `Email：${body.email.trim()}`,
          `首次到店：${body.first === '是' ? `是 ・ ${body.len ?? ''}髮` : '否'}`,
          `備註：${body.note?.trim() || '（沒有備註）'}`,
          asked === 'any' ? '（顧客選「不指定」，由系統排給你）' : '',
          '',
          '由官網 /booking 建立。改期或取消請直接改這個活動，網站不會自動同步。',
        ].filter(Boolean).join('\n'),
        location: BRAND.address,
        startIso: start,
        endIso: end,
      })
    }
    catch (err) {
      if (err instanceof GcalError) {
        throw createError({
          statusCode: err.taken ? 409 : 502,
          statusMessage: err.taken
            ? '這個時段剛剛被別人約走了。'
            : '預約系統現在連不上，預約沒有成立。再按一次送出就可以，資料都還在。',
          data: { taken: err.taken },
        })
      }
      throw err
    }

    cancelUrl = (useRuntimeConfig().bookingCancelUrl as string) || ''
  }
  else {
    code = bookingCode(body.date, body.time, (asked === 'any' ? 'yuki' : asked))
  }

  /* ---- 通知信 ---- */

  const stylistText = assigned ? (findStylist(assigned)?.label ?? '') : '不指定'
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
