/**
 * 信件樣板（PRD F-10、F-11）。
 *
 * 設計規則跟站上同一套（README「系統規則」）：只有黑白＋單一強調色 #C8351C、
 * 無圓角無陰影、對客人用「你」不用「您」、不使用 emoji、不出現 LINE。
 * 信件裡沒有 webfont 可用，所以標題退回 Georgia／襯線，正文走系統無襯線。
 *
 * 版面用 table 排，因為 Outlook 到今天還是不吃 flex 與 grid。
 */
import { BRAND, STORE_TIPS } from '#shared/margin'
import type { Mail } from './mail'

const ACCENT = '#C8351C'
const INK = '#111111'
const MUTED = '#6E6E6E'
const LINE = '#E4E4E4'

// 字體名稱用單引號包 —— 這些字串會被塞進 style="…" 這種雙引號屬性裡，
// 用雙引號的話屬性會在第一個字體名稱就被截斷，整條樣式失效。
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif"
const SERIF = "Georgia,'Noto Serif TC','Songti TC',serif"

/** 顧客的姓名與備註會進到 HTML 裡，一律逃脫 */
function esc(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function label(text: string, color = MUTED) {
  return `<div style="font:600 12px/1.6 ${SANS};letter-spacing:.14em;color:${color};text-transform:uppercase">${esc(text)}</div>`
}

function rows(items: { k: string; v: string }[]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
${items.map(r => `<tr>
<td width="96" valign="top" style="border-top:1px solid ${LINE};padding:16px 16px 16px 0;font:600 12px/1.6 ${SANS};letter-spacing:.1em;color:${MUTED}">${esc(r.k)}</td>
<td valign="top" style="border-top:1px solid ${LINE};padding:16px 0;font:400 16px/1.5 ${SANS};color:${INK}">${esc(r.v)}</td>
</tr>`).join('\n')}
</table>`
}

function shell(body: string) {
  return `<!doctype html><html lang="zh-Hant-TW"><body style="margin:0;padding:0;background:#FFFFFF">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFFFFF">
<tr><td align="center" style="padding:40px 20px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%">
<tr><td>
${label('MARGIN HAIR STUDIO')}
<div style="height:32px"></div>
${body}
<div style="height:40px"></div>
<div style="border-top:1px solid ${LINE};padding-top:20px;font:400 13px/1.7 ${SANS};color:${MUTED}">
${esc(BRAND.nameZh)} ${esc(BRAND.nameEn)}<br>
${esc(BRAND.address)}<br>
${esc(BRAND.phone)} ・ IG ${esc(BRAND.ig)}
</div>
</td></tr></table>
</td></tr></table>
</body></html>`
}

function heading(text: string) {
  return `<div style="font:500 32px/1.25 ${SERIF};color:${INK};letter-spacing:-.01em">${esc(text)}</div>`
}

function para(text: string) {
  return `<div style="font:400 16px/1.7 ${SANS};color:#3A3A3A">${esc(text)}</div>`
}

export interface BookingMailData {
  code: string
  name: string
  stylist: string
  service: string
  time: string
  total: string
  phone: string
  email: string
  note: string
  first: string
  /** 空字串代表沒有線上取消連結，改請對方來電 */
  cancelUrl: string
  /** 這筆是不是真的進了預約系統 */
  live: boolean
}

/* ---------------------------------------------------------------- 顧客確認信 */

export function bookingMail(d: BookingMailData): Mail {
  const cancel = d.cancelUrl
    ? `要取消或改期，用這個連結：<a href="${esc(d.cancelUrl)}" style="color:${ACCENT}">${esc(d.cancelUrl)}</a>`
    : `要取消或改期，請來電 ${BRAND.phone}。`

  const tips = STORE_TIPS.map(t => `<tr><td valign="top" style="padding:0 0 14px;font:400 15px/1.7 ${SANS};color:#3A3A3A">${esc(t.v)}</td></tr>`).join('')

  const html = shell(`
${heading('已經收到你的預約')}
<div style="height:20px"></div>
${para(`${d.name}你好，這是你的預約明細。${d.live ? '到店前一天我們會再確認一次。' : ''}`)}
<div style="height:28px"></div>
${label('BOOKING CODE', ACCENT)}
<div style="font:500 28px/1.3 ${SERIF};color:${INK};padding-top:6px">${esc(d.code)}</div>
<div style="height:28px"></div>
${rows([
    { k: 'STYLIST', v: d.stylist },
    { k: 'SERVICE', v: d.service },
    { k: 'TIME', v: d.time },
    { k: 'TOTAL', v: d.total },
    ...(d.note ? [{ k: 'NOTE', v: d.note }] : []),
  ])}
<div style="height:36px"></div>
${label('BEFORE YOU COME')}
<div style="height:12px"></div>
${para('遲到 15 分鐘以上可能需要改期，因為同時段只服務你一位。當日取消請至少 3 小時前告知，我們會把時段釋出給其他人。')}
<div style="height:12px"></div>
<div style="font:400 16px/1.7 ${SANS};color:#3A3A3A">${cancel}</div>
<div style="height:36px"></div>
${label('GETTING HERE')}
<div style="height:12px"></div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${tips}</table>
`)

  const text = [
    '已經收到你的預約',
    '',
    `${d.name}你好，這是你的預約明細。`,
    '',
    `預約編號：${d.code}`,
    `設計師：${d.stylist}`,
    `服務：${d.service}`,
    `時間：${d.time}`,
    `金額：${d.total}`,
    ...(d.note ? [`備註：${d.note}`] : []),
    '',
    '到店前',
    '遲到 15 分鐘以上可能需要改期，因為同時段只服務你一位。',
    '當日取消請至少 3 小時前告知。',
    d.cancelUrl ? `取消或改期：${d.cancelUrl}` : `取消或改期請來電 ${BRAND.phone}。`,
    '',
    '交通',
    ...STORE_TIPS.map(t => t.v),
    '',
    `${BRAND.nameZh} ${BRAND.nameEn}`,
    BRAND.address,
    `${BRAND.phone} ・ IG ${BRAND.ig}`,
  ].join('\n')

  return { to: d.email, subject: `預約確認 ${d.code}｜${d.time}｜${BRAND.nameZh} MARGIN`, html, text }
}

/* ---------------------------------------------------------------- 店內預約通知 */

export function bookingNotice(d: BookingMailData, to: string): Mail {
  const html = shell(`
${heading('有一筆新預約')}
<div style="height:24px"></div>
${rows([
    { k: 'CODE', v: d.code },
    { k: 'TIME', v: d.time },
    { k: 'STYLIST', v: d.stylist },
    { k: 'SERVICE', v: d.service },
    { k: 'TOTAL', v: d.total },
    { k: 'NAME', v: d.name },
    { k: 'PHONE', v: d.phone },
    { k: 'EMAIL', v: d.email },
    { k: 'FIRST', v: d.first },
    { k: 'NOTE', v: d.note || '（沒有備註）' },
  ])}
${d.live ? '' : `<div style="height:24px"></div>${para('提醒：目前沒有接上 Google 日曆，這筆預約沒有進到任何人的行事曆，只有這封通知信。')}`}
`)

  const text = [
    '有一筆新預約',
    '',
    `編號：${d.code}`,
    `時間：${d.time}`,
    `設計師：${d.stylist}`,
    `服務：${d.service}`,
    `金額：${d.total}`,
    `姓名：${d.name}`,
    `電話：${d.phone}`,
    `Email：${d.email}`,
    `首次到店：${d.first}`,
    `備註：${d.note || '（沒有備註）'}`,
    ...(d.live ? [] : ['', '提醒：沒有接上 Google 日曆，這筆預約沒有進到任何人的行事曆。']),
  ].join('\n')

  return { to, subject: `新預約 ${d.time}｜${d.name}｜${d.stylist}`, html, text, replyTo: d.email }
}

/* ---------------------------------------------------------------- 店內應徵通知 */

export interface CareersMailData {
  name: string
  phone: string
  role: string
  link: string
  note: string
  at: string
}

export function careersNotice(d: CareersMailData, to: string): Mail {
  const linkCell = d.link
    ? `<a href="${esc(d.link)}" style="color:${ACCENT}">${esc(d.link)}</a>`
    : '（沒有附連結）'

  const html = shell(`
${heading(`有人來應徵${d.role}`)}
<div style="height:24px"></div>
${rows([
    { k: 'NAME', v: d.name },
    { k: 'PHONE', v: d.phone },
    { k: 'ROLE', v: d.role },
  ])}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">
<tr>
<td width="96" valign="top" style="border-top:1px solid ${LINE};padding:16px 16px 16px 0;font:600 12px/1.6 ${SANS};letter-spacing:.1em;color:${MUTED}">LINK</td>
<td valign="top" style="border-top:1px solid ${LINE};padding:16px 0;font:400 16px/1.5 ${SANS};color:${INK};word-break:break-all">${linkCell}</td>
</tr>
</table>
${rows([
    { k: 'NOTE', v: d.note || '（沒有留言）' },
    { k: 'AT', v: d.at },
  ])}
<div style="height:28px"></div>
${para('頁面上寫的是 5 個工作天內回覆。')}
`)

  const text = [
    `有人來應徵${d.role}`,
    '',
    `姓名：${d.name}`,
    `電話：${d.phone}`,
    `職位：${d.role}`,
    `連結：${d.link || '（沒有附連結）'}`,
    `留言：${d.note || '（沒有留言）'}`,
    `時間：${d.at}`,
    '',
    '頁面上寫的是 5 個工作天內回覆。',
  ].join('\n')

  return { to, subject: `應徵${d.role}｜${d.name}｜${d.phone}`, html, text }
}
