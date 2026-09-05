import { PAGE_SIZE, WORKS, type ServiceId, type SortId, type StylistId } from '#shared/margin'

/**
 * 作品集列表。目前讀本地暫代資料；換成真正的資料來源時，
 * 前端的 query 介面（service / stylist / sort / limit）不需要改。
 */
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const service = (query.service as ServiceId | undefined) || ''
  const stylist = (query.stylist as StylistId | undefined) || ''
  const sort = ((query.sort as SortId | undefined) || 'new') as SortId
  const limit = Number(query.limit) || PAGE_SIZE

  let list = WORKS.filter(
    w => (!service || w.service === service) && (!stylist || w.stylist === stylist),
  )
  // 「最早上架」就是把預設順序倒過來 —— 與高擬真稿的邏輯一致
  if (sort === 'old') list = list.slice().reverse()

  return {
    items: list.slice(0, limit),
    matched: list.length,
    total: WORKS.length,
  }
})
