/**
 * 把本機資料夾裡的圖轉進 public/img（PRD §13.5 的落地規則，只是來源換成本機）。
 *
 * 跑法：`npm run img:import [來源資料夾]`，預設 `img-src/ai`。
 * 檔名（不含副檔名）就是版位名稱，例如 `about_hero.jpeg` → `public/img/about_hero.webp`
 * ＋ `about_hero@640.webp`、`@1280.webp`，同名一律覆蓋。
 *
 * 為什麼是覆蓋而不是另開一個資料夾：站上的引用（MgImage 的 src、shared/margin.ts）
 * 只認版位名稱，一個版位就是一張圖。要看換了什麼、要換回去，都靠 git。
 *
 * 收尾會重建 app/utils/img.assets.ts，跟 sync:notion 走同一支 buildImgManifest。
 */
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import { renderImgAssets } from './lib/codegen.ts'
import { buildImgManifest, importDir } from './lib/images.ts'

const ROOT = new URL('../', import.meta.url).pathname

async function main() {
  const dir = `${ROOT}${process.argv[2] ?? 'img-src/ai'}`

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
