/**
 * 把資料寫成 TS 原始碼。產出物要進版控，所以重點不是省字元，
 * 是讓 git diff 看得懂——一行一個欄位、鍵不亂加引號、順序穩定。
 */

export function header(what: string) {
  return `/* eslint-disable */\n`
    + `/**\n`
    + ` * ${what} —— 由 scripts/notion-sync.ts 從 Notion 產生，請勿手動編輯。\n`
    + ` * 要改內容請改 Notion，然後跑 \`npm run sync:notion\`。\n`
    + ` */\n`
}

/** 合法的 JS 識別字就不加引號 */
export function key(k: string) {
  return /^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`
}

export function ts(value: unknown, indent = ''): string {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null || value === undefined) return 'null'

  const pad = `${indent}  `
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value.map(v => `${pad}${ts(v, pad)},`).join('\n')}\n${indent}]`
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined)
  if (!entries.length) return '{}'
  return `{\n${entries.map(([k, v]) => `${pad}${key(k)}: ${ts(v, pad)},`).join('\n')}\n${indent}}`
}

export function renderImgAssets(assets: Record<string, { w: number; h: number; v: number[] }>) {
  const rows = Object.entries(assets)
    .map(([name, a]) => `  ${key(name)}: { w: ${a.w}, h: ${a.h}, v: [${a.v.join(', ')}] },`)
    .join('\n')

  return header('public/img 資產清單')
    + `import type { ImgAsset } from './img'\n\n`
    + `export const IMG_ASSETS: Record<string, ImgAsset> = {\n${rows}\n}\n`
}
