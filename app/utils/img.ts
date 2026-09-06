/**
 * public/img 的資產清單與 srcset 組裝。
 * 實際的尺寸表在 ./img.assets.ts，由 `npm run sync:notion` 掃 public/img 產生
 * （尺寸一律讀檔案本身），不要手改。響應式檔的命名規則是 {name}@{width}.webp。
 */
import { IMG_ASSETS } from './img.assets'

export interface ImgAsset {
  /** 主檔像素寬 */
  w: number
  /** 主檔像素高 */
  h: number
  /** 另有 @{width}.webp 的尺寸，不含主檔 */
  v: number[]
}

/** `works_001_front` → `/img/works_001_front.webp` */
export function imgSrc(name: string) {
  return `/img/${name}.webp`
}

/**
 * 主檔 ＋ 所有 @{width} 響應式檔組成 srcset。主檔本身的寬度也列進去，
 * 且與響應式檔重複時（Hero 的 @2400 就等於主檔）只留一筆。
 */
export function imgSrcset(name: string) {
  const a = IMG_ASSETS[name]
  if (!a) return undefined
  const widths = [...new Set([...a.v, a.w])].sort((x, y) => x - y)
  return widths
    .map(w => (w === a.w ? `${imgSrc(name)} ${w}w` : `/img/${name}@${w}.webp ${w}w`))
    .join(', ')
}

export function imgSize(name: string) {
  return IMG_ASSETS[name]
}
