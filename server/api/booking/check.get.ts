/**
 * 設定檢查：四位設計師的日曆接上了沒、service account 讀不讀得到。
 * 第一次設定時照著這一頁的回覆修，比對著 Google Cloud 主控台猜快得多。
 *
 * 只在開發模式開放 —— 它會把日曆 id 吐出來，不該公開。
 */
import { STYLISTS } from '#shared/margin'
import { bookingDate } from '#shared/booking'

export default defineEventHandler(async () => {
  if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const config = useRuntimeConfig()
  if (!isLive()) {
    return {
      ok: false,
      hint: '還沒設定 NUXT_GOOGLE_SA_EMAIL 與 NUXT_GOOGLE_SA_KEY，照 .env.example 填一次。目前 /booking 走示範空檔。',
      serviceAccount: '',
      stylists: STYLISTS.map(s => ({ id: s.value, name: s.label, calendar: '', readable: false })),
    }
  }

  // 讀得到日曆的才會出現在 busy 裡；讀不到的原因通常是忘了把日曆分享給 service account。
  let readable: string[] = []
  let error = ''
  try {
    const busy = await busyByStylist(
      iso(bookingDate(1), '00:00'),
      iso(bookingDate(1), '23:59'),
      'any',
    )
    readable = Object.keys(busy)
  }
  catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  const stylists = STYLISTS.map(s => ({
    id: s.value,
    name: s.label,
    calendar: calendarFor(s.value),
    readable: readable.includes(s.value),
  }))

  return {
    ok: !error && stylists.some(s => s.readable),
    error,
    hint: '沒有 readable 的設計師會單獨退回示範空檔。readable 是 false 時，'
      + `到那本日曆的「設定與共用」把 ${config.googleSaEmail} 加為「變更活動」權限。`,
    serviceAccount: config.googleSaEmail,
    stylists,
  }
})
