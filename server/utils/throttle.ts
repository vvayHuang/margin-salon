/**
 * 極簡的記憶體流量限制。`/api/booking` 與 `/api/careers` 都是公開的 POST，
 * 而且會往外寄信 —— 沒有這一層的話，一支腳本就能讓店家的收件匣爆掉。
 *
 * 記在記憶體裡，重啟就歸零，多台機器也各算各的。這對一間沙龍的流量夠用；
 * 之後真的需要跨機器再換成 Redis，呼叫端不用改。
 */
const hits = new Map<string, number[]>()

/** 定期清掉過期的桶子，不然這個 Map 只會一直長大 */
function sweep(now: number, windowMs: number) {
  for (const [key, list] of hits) {
    const kept = list.filter(t => now - t < windowMs)
    if (kept.length) hits.set(key, kept)
    else hits.delete(key)
  }
}

/** 超過額度回 true。key 用「路由:IP」，不同路由各有各的額度。 */
export function tooMany(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (hits.size > 500) sweep(now, windowMs)

  const list = (hits.get(key) ?? []).filter(t => now - t < windowMs)
  list.push(now)
  hits.set(key, list)
  return list.length > limit
}

/** 反向代理後面拿得到真實 IP 的話用它，拿不到就退回一個共用的桶子 */
export function clientKey(event: Parameters<typeof getRequestIP>[0], route: string) {
  return `${route}:${getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'}`
}
