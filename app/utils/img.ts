/**
 * public/img 的資產清單。由 public/img 目錄實際檔案產生（尺寸取自檔案本身），
 * 用途是讓 MgImage 只吃一個檔名就能組出 srcset —— 響應式檔的命名規則是 {name}@{width}.webp。
 * 素材換成實拍後重新產生這份表即可，元件不用動。
 */
export interface ImgAsset {
  /** 主檔像素寬 */
  w: number
  /** 主檔像素高 */
  h: number
  /** 另有 @{width}.webp 的尺寸，不含主檔 */
  v: number[]
}

export const IMG_ASSETS: Record<string, ImgAsset> = {
  about_hero: { w: 1920, h: 1080, v: [640, 1280] },
  about_intro: { w: 1600, h: 1067, v: [640, 1280] },
  hero_desktop: { w: 2400, h: 1000, v: [640, 1280, 2400] },
  hero_desktop_alt: { w: 2400, h: 1000, v: [640, 1280, 2400] },
  hero_mobile: { w: 1080, h: 1350, v: [640] },
  location_env_01: { w: 1920, h: 1080, v: [640, 1280] },
  location_exterior: { w: 1920, h: 1080, v: [640, 1280] },
  location_stairs: { w: 1920, h: 1080, v: [640, 1280] },
  service_color: { w: 800, h: 800, v: [640] },
  service_cut: { w: 800, h: 800, v: [640] },
  service_cut_alt: { w: 800, h: 800, v: [640] },
  service_perm: { w: 800, h: 800, v: [640] },
  service_scalp: { w: 800, h: 800, v: [640] },
  service_scalp_alt: { w: 800, h: 800, v: [640] },
  service_treatment: { w: 800, h: 800, v: [640] },
  space_alt_01: { w: 1920, h: 1080, v: [640, 1280] },
  space_alt_02: { w: 1920, h: 1080, v: [640, 1280] },
  space_cutting: { w: 1920, h: 1080, v: [640, 1280] },
  space_detail: { w: 1920, h: 1080, v: [640, 1280] },
  space_lounge: { w: 1920, h: 1080, v: [640, 1280] },
  stylist_an: { w: 600, h: 600, v: [640] },
  stylist_ray: { w: 600, h: 600, v: [640] },
  stylist_shu: { w: 600, h: 600, v: [640] },
  stylist_yuki: { w: 600, h: 600, v: [640] },
  works_001_back: { w: 1200, h: 1500, v: [640] },
  works_001_front: { w: 1200, h: 1500, v: [640] },
  works_001_thumb: { w: 800, h: 800, v: [] },
  works_002_back: { w: 1200, h: 1500, v: [640] },
  works_002_front: { w: 1200, h: 1500, v: [640] },
  works_002_thumb: { w: 800, h: 800, v: [] },
  works_003_front: { w: 1200, h: 1500, v: [640] },
  works_003_thumb: { w: 800, h: 800, v: [] },
  works_004_front: { w: 1200, h: 1500, v: [640] },
  works_004_thumb: { w: 800, h: 800, v: [] },
  works_005_front: { w: 1200, h: 1500, v: [640] },
  works_005_thumb: { w: 800, h: 800, v: [] },
  works_006_front: { w: 1200, h: 1500, v: [640] },
  works_006_thumb: { w: 800, h: 800, v: [] },
  works_007_front: { w: 1200, h: 1500, v: [640] },
  works_007_thumb: { w: 800, h: 800, v: [] },
  works_008_front: { w: 1200, h: 1500, v: [640] },
  works_008_thumb: { w: 800, h: 800, v: [] },
  works_009_front: { w: 1200, h: 1500, v: [640] },
  works_009_thumb: { w: 800, h: 800, v: [] },
  works_010_front: { w: 1200, h: 1500, v: [640] },
  works_010_thumb: { w: 800, h: 800, v: [] },
  works_011_front: { w: 1200, h: 1500, v: [640] },
  works_011_thumb: { w: 800, h: 800, v: [] },
  works_012_front: { w: 1200, h: 1500, v: [640] },
  works_012_thumb: { w: 800, h: 800, v: [] },
  works_013_front: { w: 1200, h: 1500, v: [640] },
  works_013_thumb: { w: 800, h: 800, v: [] },
  works_014_front: { w: 1200, h: 1500, v: [640] },
  works_014_thumb: { w: 800, h: 800, v: [] },
  works_015_back: { w: 1200, h: 1500, v: [640] },
  works_015_front: { w: 1200, h: 1500, v: [640] },
  works_015_thumb: { w: 800, h: 800, v: [] },
  works_016_front: { w: 1200, h: 1500, v: [640] },
  works_016_thumb: { w: 800, h: 800, v: [] },
  works_017_front: { w: 1200, h: 1500, v: [640] },
  works_017_thumb: { w: 800, h: 800, v: [] },
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
