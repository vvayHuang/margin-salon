/**
 * 寄信（PRD F-10 預約完成信、F-11 徵才通知信）。
 *
 * 走 Resend 的 HTTP API，一樣不裝 SDK —— 只有一個端點（POST /emails），
 * 帶一個 Bearer 就送得出去，為此多一包相依不值得。要換供應商的話，
 * 需要改的只有這一支檔案裡的 `deliver()`，樣板與呼叫端都不用動。
 *
 * 沒設定 RESEND_API_KEY 時 `isMailLive()` 回 false，整個流程照常完成，
 * 只是不寄信，並把這件事誠實回報到畫面上（不假裝寄出去了）。
 */
const API = 'https://api.resend.com/emails'
const TIMEOUT_MS = 8000

export interface Mail {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

function config() {
  const c = useRuntimeConfig()
  return {
    key: c.resendApiKey as string,
    from: c.mailFrom as string,
    /** 店內收件匣，預約與應徵的通知都寄到這裡 */
    inbox: c.mailInbox as string,
  }
}

export function isMailLive() {
  const { key, from } = config()
  return !!key && !!from
}

/** 店內收件匣有沒有設好（沒設的話就只寄給顧客，不寄內部通知） */
export function hasInbox() {
  return isMailLive() && !!config().inbox
}

export function inboxAddress() {
  return config().inbox
}

/**
 * 寄一封信。回傳有沒有寄成功。
 * 刻意不 throw —— 預約已經成立了，信寄不出去不該讓顧客看到「預約失敗」。
 * 失敗只寫進伺服器日誌，畫面上改成「確認信寄送失敗，請來電確認」。
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!isMailLive()) return false
  const { key, from } = config()

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error(`[mail] ${mail.subject} → HTTP ${res.status} ${await res.text()}`)
      return false
    }
    return true
  }
  catch (err) {
    console.error(`[mail] ${mail.subject} →`, err)
    return false
  }
}
