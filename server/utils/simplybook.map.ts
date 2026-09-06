/**
 * MARGIN 站上的代號 ↔ SimplyBook.me 的 id 對照表（PRD F-06）。
 *
 * 這裡面沒有機密，所以進版控而不是塞進環境變數 —— 一串 JSON 擠在 .env 裡沒人看得懂，
 * 也 diff 不出來誰把哪個項目接錯。要填的值從你自己的 SimplyBook 後台拿：
 * 開發模式下打 `GET /api/booking/catalog`，它會把 services（event）與 providers（unit）
 * 的 id 與名稱列出來，照著填進來即可。
 *
 * 沒填（維持 null）的項目會退回站上的示範資料，不會把預約送進 SimplyBook。
 */
import type { StylistId } from '#shared/margin'

/** 設計師 → SimplyBook 的 provider（unit）id */
export const SB_UNIT: Record<StylistId, number | null> = {
  shu: null,
  yuki: null,
  ray: null,
  an: null,
}

/** MENU 項目 → SimplyBook 的 service（event）id */
export const SB_EVENT: Record<string, number | null> = {
  cut1: null,
  cut2: null,
  cut4: null,
  cut3: null,
  color1: null,
  color2: null,
  perm1: null,
  perm2: null,
  care1: null,
  scalp1: null,
}
