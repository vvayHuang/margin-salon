import { careersProblem, type CareersPayload, type CareersResult } from '#shared/booking'

/**
 * 應徵表單的信件通知（PRD F-11）。
 *
 * 只有一個方向：把應徵資料寄到店內收件匣。表單沒有收 email 欄位（PRD §6.8 的
 * 欄位清單是姓名／電話／職位／連結／留言），所以不會有給應徵者的自動回信 ——
 * 頁面上寫的「5 個工作天內回覆」是人回的。
 *
 * 沒設定寄信服務時回 `mailed: false`，頁面會照實說「表單沒有接上寄信服務」，
 * 不會讓人以為履歷送出去了。
 */
export default defineEventHandler(async (event): Promise<CareersResult> => {
  if (tooMany(clientKey(event, 'careers'), 5, 60 * 60_000)) {
    throw createError({ statusCode: 429, statusMessage: '送出太多次了，請直接來電 07-338-0088。' })
  }

  const body = await readBody<CareersPayload>(event)

  // 蜜罐：這個欄位在畫面上被藏起來，真人填不到，填了就是機器人。
  // 回 200 假裝成功，讓對方以為送出了 —— 回錯誤只會讓它換個方法再試。
  if (body?.company) return { mailed: true }

  const problem = careersProblem(body)
  if (problem) throw createError({ statusCode: 400, statusMessage: problem })

  if (!hasInbox()) return { mailed: false }

  const mailed = await sendMail(careersNotice({
    name: body.name.trim(),
    phone: body.phone.trim(),
    role: body.role,
    link: body.link?.trim() ?? '',
    note: body.note?.trim() ?? '',
    at: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }),
  }, inboxAddress()))

  return { mailed }
})
