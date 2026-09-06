/**
 * SimplyBook 後台的服務（event）與人員（unit）清單，用來填
 * `server/utils/simplybook.map.ts` 的對照表。
 *
 * 只在開發模式開放 —— 它會把後台的內部 id 與人員 email 吐出來，不該公開。
 */
export default defineEventHandler(async () => {
  if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  if (!isLive()) {
    throw createError({
      statusCode: 503,
      statusMessage: '還沒設定 SIMPLYBOOK_LOGIN 與 SIMPLYBOOK_API_KEY，照 .env.example 填一次',
    })
  }
  return await catalog()
})
