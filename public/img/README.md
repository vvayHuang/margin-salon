# public/img 佔位圖對照表

**產生日期**：2026-09-05　**來源**：Unsplash（免費商用、免標註）
**狀態**：全部為佔位圖，頁面須標註「示意圖」，上線前替換為實拍。

## 檔案規則

```
{name}.webp          主檔（目標尺寸）
{name}@640.webp      響應式 640w
{name}@1280.webp     響應式 1280w（16:9 以上才有）
{name}@2400.webp     響應式 2400w（Hero 才有）
works_XXX_thumb.webp 作品縮圖 1:1 800×800
_original/           Unsplash 原始 JPG（已加入 .gitignore）
```

Nuxt 用法：

```vue
<NuxtImg src="/img/works_001_front.webp" width="1200" height="1500"
  sizes="sm:100vw md:50vw lg:33vw" loading="lazy" alt="透明感染髮｜長髮｜Yuki" />
```

## 對照表

| 檔名 | 規格 | 用途 | 主檔大小 | 攝影師 | 原始檔 |
|---|---|---|---|---|---|
| `hero_desktop.webp` | 21:9 2400×1000 | 首頁 Hero 桌機 | 148KB | Giorgio Trovato | `giorgio-trovato-T9u-Xr30FY8.jpg` |
| `hero_desktop_alt.webp` | 21:9 2400×1000 | Hero 備選（圓鏡牆面） | 121KB | Greg Trowman | `greg-trowman-jsuWg7IXx1k.jpg` |
| `hero_mobile.webp` | 4:5 1080×1350 | 首頁 Hero 手機 | 35KB | Giorgio Trovato | `giorgio-trovato-NF_Q9RQ6qRk.jpg` |
| `about_intro.webp` | 3:2 1600×1067 | 首頁 品牌介紹 | 130KB | Greg Trowman | `greg-trowman-k7AvgINPgdg.jpg` |
| `about_hero.webp` | 16:9 1920×1080 | /about 頁首 | 78KB | Guilherme Petri | `guilherme-petri-PtOfbGkU3uI.jpg` |
| `space_lounge.webp` | 16:9 1920×1080 | /about 等候區 | 154KB | Greg Trowman | `greg-trowman-kJx_9iCByBs.jpg` |
| `space_cutting.webp` | 16:9 1920×1080 | /about 剪髮區（基準組） | 71KB | Giorgio Trovato | `giorgio-trovato-gI9rvJK61L8.jpg` |
| `space_detail.webp` | 16:9 1920×1080 | /about 空間細節 | 77KB | Giorgio Trovato | `giorgio-trovato-XBcURNhKeog.jpg` |
| `space_alt_01.webp` | 16:9 1920×1080 | 空間備選 | 91KB | Guilherme Petri | `guilherme-petri-ZkNxY2zErck.jpg` |
| `space_alt_02.webp` | 16:9 1920×1080 | 空間備選 | 125KB | Tile Merchant Ireland | `tile-merchant-ireland-pb1Ajy_QUeE.jpg` |
| `location_stairs.webp` | 16:9 1920×1080 | /location 二樓樓梯 | 119KB | Cuvii | `cuvii-KvZ1Z2Q-7uc.jpg` |
| `location_exterior.webp` | 16:9 1920×1080 | /location 外觀 | 193KB | Hector Falcon | `hector-falcon-4FhMrcTl4Kc.jpg` |
| `location_env_01.webp` | 16:9 1920×1080 | /location 環境 | 149KB | Nico Knaack | `nico-knaack-C6SUsdkBGjE.jpg` |
| `service_cut.webp` | 1:1 800×800 | 服務卡片 剪髮 | 77KB | Victor Sirbu | `victor-sirbu-Cr3CxWtuc5U.jpg` |
| `service_cut_alt.webp` | 1:1 800×800 | 剪髮備選（剪刀平拍） | 31KB | Giorgio Trovato | `giorgio-trovato-U-DinasrjvU.jpg` |
| `service_color.webp` | 1:1 800×800 | 服務卡片 染髮 | 95KB | Yovanka Loria Salon | `yovanka-loria-salon-RpFQdgJ9gQw.jpg` |
| `service_perm.webp` | 1:1 800×800 | 服務卡片 燙髮 | 44KB | Ahmad Mahjoubzad | `ahmad-mahjoubzad-nDSCY67CzXs.jpg` |
| `service_treatment.webp` | 1:1 800×800 | 服務卡片 護髮 | 44KB | Katsiaryna Endruszkiewicz | `katsiaryna-endruszkiewicz-yZviQtYoP08.jpg` |
| `service_scalp.webp` | 1:1 800×800 | 服務卡片 頭皮養護 | 157KB | Ela De Pure | `ela-de-pure-Gp3s0bquEkE.jpg` |
| `service_scalp_alt.webp` | 1:1 800×800 | 頭皮養護備選 | 13KB | Ela De Pure | `ela-de-pure-06Z_DoagMz4.jpg` |
| `stylist_shu.webp` | 1:1 600×600 | 設計師 Shu 周敘（總監） | 15KB | Tron Le | `tron-le-MEsOFGCccHg-unsplash.jpg` |
| `stylist_yuki.webp` | 1:1 600×600 | 設計師 Yuki 林宜家（資深設計師） | 20KB | Aiony Haust | `aiony-haust-3TLl_97HNJo-unsplash.jpg` |
| `stylist_ray.webp` | 1:1 600×600 | 設計師 Ray 陳柏睿（設計師） | 23KB | Imansyah Muhamad Putera | `imansyah-muhamad-putera-n4KewLKFOZw-unsplash.jpg` |
| `stylist_an.webp` | 1:1 600×600 | 設計師 An 黃安（設計師） | 33KB | Good Faces | `good-faces-yliYi-2s9qg-unsplash.jpg` |
| `works_001_front.webp` | 4:5 1200×1500 | 染髮 長髮 | 86KB | Guido Fuà | `guido-fua-dpHAcZsu4bg.jpg` |
| `works_001_back.webp` | 4:5 1200×1500 | 染髮 背面 | 153KB | Vii Nguyenn | `vii-nguyenn-Bjr4JDdl6ts.jpg` |
| `works_002_front.webp` | 4:5 1200×1500 | 染髮 中長髮 | 142KB | Minh Ngọc | `minh-ng-c-8mrH9UjbgR8.jpg` |
| `works_002_back.webp` | 4:5 1200×1500 | 染髮 背面 | 116KB | Rejaul Karim | `rejaul-karim-q8nZvIpE55Y.jpg` |
| `works_003_front.webp` | 4:5 1200×1500 | 染髮 黑長髮 | 80KB | Jarin Dominguez | `jarin-dominguez-sxUdO8Xud2k.jpg` |
| `works_004_front.webp` | 4:5 1200×1500 | 染髮 中長髮 | 132KB | Chalaphan Mathong | `chalaphan-mathong-2Ceido7Uldo.jpg` |
| `works_005_front.webp` | 4:5 1200×1500 | 染髮 自然光 | 136KB | Rameez Remy | `rameez-remy-mncdBRKF56k.jpg` |
| `works_006_front.webp` | 4:5 1200×1500 | 染髮 特殊色 | 146KB | Scott Goodwill | `scott-goodwill-r7KPlaryeqs.jpg` |
| `works_007_front.webp` | 4:5 1200×1500 | 燙髮 | 137KB | Ahmad Mahjoubzad | `ahmad-mahjoubzad-nDSCY67CzXs.jpg` |
| `works_008_front.webp` | 4:5 1200×1500 | 燙髮 黑白 | 145KB | Alexander Krivitskiy | `alexander-krivitskiy-e7-0U1EAqz4.jpg` |
| `works_009_front.webp` | 4:5 1200×1500 | 燙髮 | 98KB | Janko Ferlič | `janko-ferlic-LGlBwZGjiwM.jpg` |
| `works_010_front.webp` | 4:5 1200×1500 | 燙髮 逆光 | 130KB | Alef Morais | `alef-morais-HWdTfhFX-OY.jpg` |
| `works_011_front.webp` | 4:5 1200×1500 | 剪髮 短髮 | 128KB | Alex Perez | `alex-perez-vXQza9AUe40.jpg` |
| `works_012_front.webp` | 4:5 1200×1500 | 剪髮 短髮黑白 | 92KB | Lawrence Chismorie | `lawrence-chismorie--3CCUXDrS8A.jpg` |
| `works_013_front.webp` | 4:5 1200×1500 | 剪髮 短髮 | 129KB | Alex Perez | `alex-perez-VLPLo-GtrIE.jpg` |
| `works_014_front.webp` | 4:5 1200×1500 | 剪髮 短髮 | 53KB | Sergey Sokolov | `sergey-sokolov-6q2PwZsM-UY.jpg` |
| `works_015_front.webp` | 4:5 1200×1500 | 剪髮 施作中 | 58KB | Nate Johnston | `nate-johnston-tgPrIYnW3g4.jpg` |
| `works_015_back.webp` | 4:5 1200×1500 | 男士短髮 背面 | 46KB | Matthew Jackson | `matthew-jackson-fmbnp_Oy1-I.jpg` |
| `works_016_front.webp` | 4:5 1200×1500 | 男士短髮 | 125KB | Ahmad Ebadi | `ahmad-ebadi-zAsMbiVW5-M.jpg` |
| `works_017_front.webp` | 4:5 1200×1500 | 男士 沙龍情境 | 124KB | Mr Shave | `mr-shave-4k60yfGy7fU.jpg` |
| `og_default.jpg` | 1200×630 | OG 預設圖 | 82KB | Giorgio Trovato | `giorgio-trovato-T9u-Xr30FY8.jpg` |

## 尚缺（Unsplash 補不到）

| 項目 | 檔名 | 替代方案 |
|---|---|---|
| 洗髮區 | `space_shampoo.webp` | photoAC 搜「シャンプー台 美容室」 |
| 頭皮養護施作照 | `service_scalp` 實拍 | photoAC 搜「ヘッドスパ 頭皮」 |
| Logo ×3、Favicon ×2 | `logo_*.svg` `favicon.ico` | 需自行設計 |
| 作品 018–020 | `works_018~020_front.webp` | 目前 17 件，補足 20 件 |

## 實際上站狀況（2026-09-05 接上）

影像對應寫在程式裡，不在這份表：作品看 `shared/margin.ts` 的 `WORKS[].img`、
設計師頭像與個人頁 Hero 都看 `STYLISTS[].photo`（同一張）、服務卡片看 `CATEGORY_IMG`，
其餘固定位置直接寫在各頁 `.vue`。檔名 → srcset 的對照表在 `app/utils/img.ts`（由本目錄產生）。

與上表原始規劃不同的幾處替代：

| 位置 | 用了 | 原因 |
|---|---|---|
| 首頁收尾帶（原「洗髮區」） | `space_alt_02` | 沒有洗髮區素材；`space_lounge` 的孔雀綠沙發與全站無彩色調衝突 |
| /services 收尾帶（原「藥劑檯」） | `space_alt_01` | 沒有藥劑檯素材，這張的檯面與瓶罐最接近 |
| /store Hero（原「店門口」） | `location_stairs` | 三張 location 裡只有這張有門口感 |
| /about 空間三連拍「洗髮區」 | `space_detail` | 沒有洗髮區素材 |
| 設計師個人頁 Hero | 各人的 `stylist_*`（與列表卡片同一張） | 改用本人照片；1:1 裁進 21:9 只剩臉的一條，`object-position: center 45%` 讓五官落在中線。素材只有 600×600／@640，滿版 Hero 會偏軟，換實拍時請出到 ≥1920 寬並補 @640／@1280 變體 |

/store 的周邊圖沒有靜態素材，改成嵌 Google Maps（`STORE_MAP_SRC`，`output=embed` 不用 API key）。
查詢字串是 PRD 的地址 `高雄市苓雅區文橫二路88號`；換成自製靜態圖時，把 store.vue 的
iframe 換回 `MgImage` 即可。全站已無灰底佔位。

未使用：`hero_mobile`（Hero 版位是 21:9，直式素材裁進去只剩一條）、
`location_env_01`、`service_cut_alt`、`service_scalp_alt`、
`works_012`／`works_016`（作品只有 14 件，素材有 17 組）、各 `works_*_back`／`works_*_thumb`（版面沒有這兩個用途）。

設計師頭像已於 2026-09-05 換成四張各自獨立的亞洲面孔（裁切以臉為中心、頭部約佔畫面 45%，
主檔 600、`@640` 供 retina，全部 ≤40KB）。`stylist_yuki` 帶藍紫色燈光、`stylist_shu` 是黑白，
四張的色調不統一，換實拍時一起處理。

⚠ `圖片授權表.csv` 原本把這四張記成「候補・尚未處理」，同時在 `stylist_*` 列掛了另外四位
攝影師（Janko Ferlič／jim hatch／Craig Tidball ×2）——那是換圖前的舊記錄，四張都掛錯人。
已於 2026-09-05 依本表更正，未採用的四張原始檔仍留在 `_original/`。
**本表是頭像來源的權威記錄，授權表以本表為準。**

檔名沿用高擬真稿時期的四位設計師代號，已對回 PRD 的姓名：
`stylist_shu`＝周敘 Shu、`stylist_yuki`＝林宜家 Yuki、`stylist_ray`＝陳柏睿 Ray、
`stylist_an`＝黃安 An。檔名與 `STYLISTS[].photo` 一致，不需要改檔名。

## 備註

- 人像類裁切採「重心偏上 18%」，避免頭頂被切；空間類置中裁切。
- 每張自動壓縮至符合上限（Hero ≤300KB／作品 ≤150KB／縮圖 ≤60KB／頭像 ≤40KB）；
  `works_001_back` 153KB、`location_exterior` 193KB 為細節較多的例外。
- `stylist_*@640.webp` 尺寸大於主檔 600×600，可當 retina @2x 使用。
- 重新產生：原始檔在 `_original/`，處理腳本邏輯見專案文件《03b-Unsplash佔位圖連結清單》。
