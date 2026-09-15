/**
 * 極簡的記憶體流量限制。`/api/booking` 與 `/api/careers` 都是公開的 POST，
 * 而且會往外寄信 —— 沒有這一層的話，一支腳本就能讓店家的收件匣爆掉。
 *
 * 記在記憶體裡，重啟就歸零，多台機器也各算各的。這對一間沙龍的流量夠用；
 * 之後真的需要跨機器再換成 Redis，呼叫端不用改。
 *
 * 兩道防線（資安報告 F2／F3）：
 * - **鍵用可信的 IP。** 預設是連線本身的位址，只有明確設定 `clientIpHeader` 才讀標頭。
 *   以前讀 X-Forwarded-For 的第一段，那是客戶端自己填的，每換一個值就是一份新額度。
 * - **Map 有上限。** 最多 MAX_KEYS 個鍵、每個鍵最多記 limit + 1 筆；清理改成每分鐘一次，
 *   不再是超過 500 筆之後每個請求都把整個 Map 掃一遍。
 */
const MAX_KEYS = 10_000
const SWEEP_EVERY_MS = 60_000

interface Bucket {
  times: number[]
  windowMs: number
}

const hits = new Map<string, Bucket>()
let lastSweep = 0

/** 清掉過期的紀錄。每個鍵用自己的時間窗，不是呼叫當下那條路由的 */
function sweep(now: number) {
  for (const [key, bucket] of hits) {
    bucket.times = bucket.times.filter(t => now - t < bucket.windowMs)
    if (!bucket.times.length) hits.delete(key)
  }
  lastSweep = now
}

/** 超過額度回 true。key 用「路由:IP」，不同路由各有各的額度。 */
export function tooMany(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (now - lastSweep >= SWEEP_EVERY_MS) sweep(now)

  const bucket = hits.get(key)
  const times = (bucket?.times ?? []).filter(t => now - t < windowMs)
  // 已經超額就不再記：被擋下的請求不佔記憶體，陣列最長 limit + 1
  if (times.length <= limit) times.push(now)

  if (!bucket && hits.size >= MAX_KEYS) {
    // 滿了就丟最早建立的鍵（Map 依插入順序迭代）。鍵來自可信 IP，攻擊者湊不出上萬個
    hits.delete(hits.keys().next().value!)
  }
  hits.set(key, { times, windowMs })
  return times.length > limit
}

/**
 * 「路由:IP」。IP 預設取連線本身的位址。
 * 部署在平台或反向代理後面時，連線位址會是代理自己，所有人擠同一個額度——
 * 這時在 NUXT_CLIENT_IP_HEADER 填平台會覆寫、客戶端改不了的標頭（見 .env.example）。
 */
export function clientKey(event: Parameters<typeof getRequestIP>[0], route: string) {
  const header = useRuntimeConfig(event).clientIpHeader as string
  const fromHeader = header ? getRequestHeader(event, header)?.split(',')[0]?.trim() : ''
  const ip = fromHeader || getRequestIP(event) || 'unknown'
  return `${route}:${ip.slice(0, 64)}`
}
