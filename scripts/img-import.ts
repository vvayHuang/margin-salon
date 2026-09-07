/**
 * 把本機資料夾裡的圖轉進 public/img（PRD §13.5 的落地規則，只是來源換成本機）。
 *
 * 跑法：`npm run img:import -- <來源資料夾>`，例如 `-- ~/Downloads/gemini`。
 * 檔名（不含副檔名）就是版位名稱，例如 `about_hero.jpeg` → `public/img/about_hero.webp`
 * ＋ `about_hero@640.webp`、`@1280.webp`，同名一律覆蓋。
 *
 * 來源資料夾不必在 repo 裡，也不應該在。實測過：從 public/img 的 q82 webp 重出變體，
 * 跟從原始 jpeg 出差 RMSE 2.2（0.85%）——留一份 jpeg 母片幾乎買不到畫質，
 * 卻要多一個會跟 public/img 走鐘的資料夾。真要回頭找原圖就翻 git history。
 *
 * 一個版位一張圖：站上的引用（MgImage 的 src、shared/margin.ts）只認版位名稱。
 *
 * 收尾會重建 app/utils/img.assets.ts，跟 sync:notion 走同一支 buildImgManifest。
 */
import { writeFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import process from 'node:process'
import { renderImgAssets } from './lib/codegen.ts'
import { buildImgManifest, importDir } from './lib/images.ts'

const ROOT = new URL('../', import.meta.url).pathname

async function main() {
  const arg = process.argv[2]
  if (!arg) throw new Error('要給來源資料夾：npm run img:import -- <資料夾>')
  // 相對路徑以「你現在站的地方」為準，不是專案根目錄——來源多半在 repo 外面
  const dir = isAbsolute(arg) ? arg : resolve(process.cwd(), arg)

  console.log(`→ 轉檔 ${dir} …`)
  const saved = await importDir(dir)
  if (!saved.length) throw new Error(`${dir} 裡沒有可以轉的圖（只吃 jpg／png／webp）`)
  for (const s of saved) console.log(`  ${s.name}.webp  ${s.w}×${s.h}`)

  console.log('→ 重建 public/img 尺寸表…')
  const assets = await buildImgManifest()
  await writeFile(`${ROOT}app/utils/img.assets.ts`, renderImgAssets(assets))
  console.log(`  ${Object.keys(assets).length} 張`)

  console.log('\n完成。public/img 與 app/utils/img.assets.ts 請一起 commit。')
}

main().catch((err: unknown) => {
  console.error(`\n✗ ${err instanceof Error ? err.message : String(err)}`)
  process.exitCode = 1
})
