/**
 * 建置時的圖片處理。Notion 的檔案網址約 1 小時後失效（§13.5），
 * 所以同步時就把圖抓下來、轉成 webp、存進 public/img，站上引用的一律是自家檔案。
 *
 * 響應式檔的命名沿用 app/utils/img.ts 的規則：{name}@{width}.webp。
 */
import { Buffer } from 'node:buffer'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

export const IMG_DIR = new URL('../../public/img/', import.meta.url).pathname

/** 產生哪些寬度的響應式檔。只產生比原圖小的，不放大。 */
const VARIANTS = [640, 1280]

export interface SavedImage {
  /** 不含副檔名的檔名，就是 IMG_ASSETS 的 key */
  name: string
  w: number
  h: number
}

/**
 * 下載一張 Notion 圖片並存成 public/img/{name}.webp（＋響應式檔）。
 * quality 82 是肉眼看不出差別、檔案又明顯變小的那個點。
 */
export async function downloadImage(url: string, name: string): Promise<SavedImage> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`下載圖片失敗 ${name}：${res.status} ${url}`)
  const input = Buffer.from(await res.arrayBuffer())

  const meta = await sharp(input).metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0
  if (!w || !h) throw new Error(`讀不到圖片尺寸：${name}`)

  await writeFile(join(IMG_DIR, `${name}.webp`), await sharp(input).webp({ quality: 82 }).toBuffer())

  for (const width of VARIANTS) {
    if (width >= w) continue
    const buf = await sharp(input).resize({ width }).webp({ quality: 82 }).toBuffer()
    await writeFile(join(IMG_DIR, `${name}@${width}.webp`), buf)
  }

  return { name, w, h }
}

/**
 * 掃 public/img 重新產生 IMG_ASSETS。
 * 尺寸一律讀檔案本身，不信任任何人手填的數字——這份表寫錯會讓 srcset 整個歪掉。
 */
export async function buildImgManifest() {
  const files = (await readdir(IMG_DIR)).filter(f => f.endsWith('.webp'))

  /** name → 有哪些 @{width} 響應式檔 */
  const variants = new Map<string, number[]>()
  const mains: string[] = []

  for (const f of files) {
    const base = f.slice(0, -'.webp'.length)
    const at = base.lastIndexOf('@')
    if (at === -1) {
      mains.push(base)
      continue
    }
    const width = Number(base.slice(at + 1))
    if (!Number.isFinite(width)) continue
    const name = base.slice(0, at)
    variants.set(name, [...(variants.get(name) ?? []), width])
  }

  const assets: Record<string, { w: number; h: number; v: number[] }> = {}
  for (const name of mains.sort()) {
    const meta = await sharp(join(IMG_DIR, `${name}.webp`)).metadata()
    assets[name] = {
      w: meta.width ?? 0,
      h: meta.height ?? 0,
      v: (variants.get(name) ?? []).sort((a, b) => a - b),
    }
  }
  return assets
}
