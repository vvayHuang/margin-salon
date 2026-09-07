/**
 * 設定檢查：金鑰對不對、四本日曆接上了沒、沒接上是卡在哪一步。
 *
 * 設定其實是兩件獨立的事，這支把它們分開回報：
 *   1. service account 的金鑰換不換得到 token
 *   2. 每位設計師的日曆 ID 有沒有填、填了讀不讀得到
 * 分開講的原因是「日曆 ID 還沒填」跟「填了但沒分享權限」要做的事完全不同，
 * 混在同一句提示裡只會把人指到錯的地方。
 *
 * 只在開發模式開放 —— 它會把日曆 id 與 service account 信箱吐出來，不該公開。
 */
import { STYLISTS } from '#shared/margin'
import { bookingDate } from '#shared/booking'

type Status = 'ok' | 'missing-id' | 'unreadable'

/** 寄信設定（PRD F-10 預約完成信、F-11 徵才通知信） */
function mailStatus() {
  const c = useRuntimeConfig()
  const from = c.mailFrom as string
  const inbox = c.mailInbox as string
  const on = isMailLive()

  return {
    ok: on,
    from: on ? from : '',
    inbox,
    fix: on
      ? (inbox
          ? ''
          : '沒填 NUXT_MAIL_INBOX，顧客的確認信會寄，但新預約與應徵的通知信沒有收件人 —— '
            + '徵才表單會回 mailed:false。')
      : '沒填 NUXT_RESEND_API_KEY 或 NUXT_MAIL_FROM，所以完全不寄信。'
        + '預約與應徵仍然送得出去，畫面會照實說明沒有寄出。到 https://resend.com 拿一把 key，'
        + '還沒有自己的網域就先用 MARGIN <onboarding@resend.dev>（只能寄到你註冊 Resend 的信箱）。',
  }
}

export default defineEventHandler(async () => {
  if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const config = useRuntimeConfig()
  const sa = config.googleSaEmail as string

  if (!isLive()) {
    return {
      ok: false,
      next: '還沒設定 NUXT_GOOGLE_SA_EMAIL 與 NUXT_GOOGLE_SA_KEY，照 .env.example 走一次。'
        + '（環境變數要 NUXT_ 開頭，少了前綴 Nuxt 會安靜忽略。）目前 /booking 走示範空檔。',
      credentials: { ok: false, error: '' },
      serviceAccount: '',
      stylists: STYLISTS.map(s => ({
        id: s.value,
        name: s.label,
        calendar: '',
        status: 'missing-id' as Status,
        fix: '',
      })),
    }
  }

  // 先單獨驗金鑰。這一步不需要任何日曆，所以日曆 ID 還沒填也驗得出來。
  const credentials = await verifyCredentials()

  // 讀得到的日曆才會出現在 busy 裡。填了 ID 卻不在裡面，就是沒分享給 service account。
  let readable: string[] = []
  if (credentials.ok) {
    try {
      const busy = await busyByStylist(
        iso(bookingDate(1), '00:00'),
        iso(bookingDate(1), '23:59'),
        'any',
      )
      readable = Object.keys(busy)
    }
    catch (err) {
      console.error('[check] freeBusy →', err)
    }
  }

  const stylists = STYLISTS.map((s) => {
    const calendar = calendarFor(s.value)
    const status: Status = !calendar
      ? 'missing-id'
      : readable.includes(s.value) ? 'ok' : 'unreadable'

    return {
      id: s.value,
      name: s.label,
      calendar,
      status,
      fix: {
        'ok': '',
        'missing-id': `還沒填 NUXT_GCAL_${s.value.toUpperCase()}。到這位設計師的 Google 日曆 → `
          + '設定與共用 → 最下面「整合日曆」那一區，把「日曆 ID」複製過來。',
        'unreadable': `日曆 ID 填了但讀不到。到這本日曆的「設定與共用」→「與特定使用者或群組共用」→ `
          + `新增 ${sa}，權限選「變更活動」。也確認一下 ID 有沒有貼錯。`,
      }[status],
    }
  })

  const done = stylists.filter(s => s.status === 'ok')
  const next = !credentials.ok
    ? `金鑰換不到 token，日曆先不用管。錯誤訊息：${credentials.error}`
    : done.length === 0
      ? '金鑰沒問題。接下來把日曆 ID 填進 .env（每位設計師看下面各自的 fix），四位可以一位一位接。'
      : done.length < stylists.length
        ? `${done.length} 位接上了，其餘的看各自的 fix。沒接上的設計師會單獨退回示範空檔，不影響已接上的。`
        : '四位都接上了。/booking 現在讀的是真的空檔。'

  return {
    ok: credentials.ok && done.length > 0,
    next,
    credentials,
    serviceAccount: sa,
    stylists,
    // 寄信是另一條獨立的線（F-10／F-11），沒設定不影響預約，但信不會寄出去。
    mail: mailStatus(),
  }
})
