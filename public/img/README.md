# public/img 佔位圖對照表

**產生日期**：2026-09-05（Unsplash）／2026-09-07 起陸續換 AI 圖
**狀態**：全部為佔位圖，頁面須標註「示意圖」，上線前替換為實拍。

## 一個版位一張圖，不分資料夾

Unsplash 圖與 AI 圖**一律放同一個 `public/img/`，同名覆蓋**，不開第二個資料夾。
理由是引用端只認版位名稱——`MgImage` 的 `src`、`shared/margin.ts` 的 `img`、
`app/utils/img.ts` 的 `imgSrc()` 都是 `{name}` → `/img/{name}.webp`，
多一個資料夾就要在 manifest、元件、產生器三個地方都塞一個「這張在哪」的欄位，
換來的只是同一個版位擺兩張圖、最後還是得有人決定哪張上站。

換了什麼、要不要換回去，看 git：`git diff` 會顯示檔案異動，
`git checkout <commit> -- public/img/about_hero.webp` 就回到上一版。
每張圖的實際出處記在 `圖片授權表.csv` 的「攝影師」欄（AI 圖填「Gemini（AI 生成）」）。

## 檔案規則

```
{name}.webp          主檔（目標尺寸）
{name}@640.webp      響應式 640w
{name}@1280.webp     響應式 1280w（主檔 >1280 才有）
{name}@2400.webp     響應式 2400w（Hero 才有）
works_XXX_thumb.webp 作品縮圖 1:1 800×800
_original/           Unsplash 原始 JPG（已加入 .gitignore，隨時可以重抓）
```

來源檔（Gemini 輸出的 jpeg）**不進 repo**。放 `~/Downloads` 之類的地方就好，
轉完 `public/img/{name}.webp` 就是母片。

實測過才這樣定的：從 q82 的 webp 重出 `@640`，跟從原始 jpeg 出差 RMSE 2.2（0.85%），
縮圖本身就把壓縮痕跡平均掉了；想把主檔拉到 q92 重壓的話差 1.8。留一份 jpeg 母片
幾乎買不到畫質，卻要多一個會跟 `public/img` 走鐘的資料夾。真要回頭找原圖就翻 git
history（`git show <commit>:<path>`）。

## 匯入 AI 圖

**檔名先改成版位名稱**（`about_hero.jpeg`），然後指著那個資料夾跑：

```bash
npm run img:import -- ~/Downloads/gemini
```

它會轉成 `public/img/{name}.webp` ＋ `@640`／`@1280`（quality 82，與 Notion 那條線同一支
`saveImage`），清掉同名的舊響應式檔，最後重建 `app/utils/img.assets.ts`。

⚠ 轉檔不裁切。版位比例（16:9、3:2…）請在生圖時就出對，出錯的話 `object-cover` 會幫你裁，
但裁掉的就是解析度——見下面那段。

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
| ~~/store Hero（原「店門口」）~~ | ~~`location_stairs`~~ | 2026-09-08 解除：`location_street` 就是街屋店面，頁首改用它，樓梯移到環境三連拍 |
| /about 空間三連拍「洗髮區」 | `space_detail` | 沒有洗髮區素材 |
| 設計師個人頁 Hero | 各人的 `stylist_*`（與列表卡片同一張） | 改用本人照片；1:1 裁進 21:9 只剩臉的一條，`object-position: center 45%` 讓五官落在中線。素材只有 600×600／@640，滿版 Hero 會偏軟，換實拍時請出到 ≥1920 寬並補 @640／@1280 變體 |

/store 的環境照已於 2026-09-08 補上（`STORE_ENV` 三連拍）；地圖本身沒有靜態素材，仍是嵌 Google Maps（`STORE_MAP_SRC`，`output=embed` 不用 API key）。
查詢字串是 PRD 的地址 `高雄市苓雅區文橫二路88號`；換成自製靜態圖時，把 store.vue 的
iframe 換回 `MgImage` 即可。全站已無灰底佔位。

未使用：`service_cut_alt`、`service_scalp_alt`、
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

## AI 圖替換進度（2026-09-08：首頁 Hero ＋ /store 全頁）

| 檔名 | 尺寸 | 用途 | 備註 |
|---|---|---|---|
| `hero_desktop.webp` | 1584×672 | 首頁 Hero 桌機 21:9 | 比例對上版位，不用裁。但 1584 寬撐 1440 版面只有 1.1×，見下面那段 |
| `hero_mobile.webp` | 928×1152 | 首頁 Hero 手機 4:5 | 這個版位第一次真的用上（PRD §13.4 本來就寫 21:9／4:5 兩張） |
| `location_street.webp` | 1376×768 | /store 頁首 21:9 | **新版位**。街屋店面（機車、暖簾）。**這張是後續生圖的基準**：陰天平光、中間調、低飽和、正面平拍、細顆粒、無人、招牌留白 |
| `location_corner.webp` | 1376×768 | /store 環境三連拍 | **新版位**。街角路口 |
| `location_exterior.webp` | 1376×768 | /store 環境三連拍 | 街屋木門入口（第二版）。取代原本那張現代水泥透天入口——那張與基準不同調 |
| `location_stairs.webp` | 1376×768 | /store 環境三連拍 | 室內木樓梯。原本是頁首，這輪讓給 `location_street` |
| `location_env_01.webp` | 1376×768 | /store 頁尾收尾帶 21:9 | 二樓窗外街景。從 2026-09-05 起就沒有版位在用，這次才真的上站 |

/store 因此多了一段「環境周圍」三連拍（`STORE_ENV`，接在地址表下面），順序照抵達的動線排：
街角 → 木門 → 樓梯。版位開 16:9，與素材同比例，不用裁。
五張 location 對五個版位（頁首／三連拍／收尾帶），一張圖一個位置，沒有重複。

Hero 那兩張是同一間空景的橫式與直式，構圖一致（左牆圓鏡＋椅、右側留白給標題）。
首頁 Hero 因此從單張 `<img>` 改成 `<picture>`：`(max-width: 900px)` 走 `hero_mobile`，
框的比例由 `.mg-hero-media` 一起切（21:9 → 4:5），900px 是 main.css 裡其他版面用的同一個斷點。
`hero_desktop@2400.webp` 已隨新圖清掉——舊主檔 2400 寬，新的只有 1584。

⚠ **白牆會吃掉標題**：新的兩張 Hero 下緣是淺木地板與白牆，套共用的 `.mg-scrim` 之後，
標題最上面那行對背景只剩 2.9:1（量法：把圖依版位比例裁好、疊上漸層算合成亮度），
低於大字的 AA 門檻 3:1。首頁 Hero 因此單獨把同一條漸層加深一階（0.72→0.86／0.28→0.50），
量到 3.9:1。/store 頁首的樓梯圖左下本來就偏暗（5.3:1），不需要處理。

順帶量到、也一起修掉的：收尾帶 `MgCtaBand` 的白字本來就壓不住底圖——`space_alt_01`
（/services）1.71:1、`about_intro`（/about）2.47:1、`location_exterior`（/store）1.98:1，
全部低於 3:1。它的兩行大標比 Hero 的標題高（落在影像 23%–47%），共用的那條漸層到那個高度
幾乎已經透明。多加一個 `.mg-scrim-cta`（0.86／0.62＠50%／0＠100%，整片拉到頂），
五張底圖量下來最低 3.4:1。這一層只掛在 `MgCtaBand`，Hero 與其他地方的 `.mg-scrim` 不動。

⚠ **解析度往下掉了**：桌機 Hero 是全站最大的版位，2400×1000 換成 1584×672，
量到的實效密度是 1.1×（1440 CSS px 的框、2× 螢幕要 2880 才滿）。這是上一個 commit
就記著的那條「往下繼續換之前要先解決解析度」，這批仍然沒解決，只是比例對了所以沒有再被裁掉一次。
真的要上站，這張得換支援 2K 以上輸出的模型重生，或轉檔前先放大。

## AI 圖替換進度（2026-09-07：/about）

/about 這一頁先換，其餘沿用 Unsplash。已替換：

| 檔名 | 尺寸 | 用途 | 備註 |
|---|---|---|---|
| `about_hero.webp` | 1376×768 | /about 頁首 | 版位是 3:4 直式，這張是 16:9，`object-cover` 只會留中間一條 |
| `about_intro.webp` | 1264×848 | 首頁／about 收尾帶 | 版位 21:9，裁完剩 1264×542 |
| `space_lounge.webp` | 1376×768 | /about 等候區 | |
| `space_detail.webp` | 1376×768 | 空間細節 | 不再當洗髮區用 |
| `space_cutting.webp` | 1376×768 | /about 剪髮區 | |
| `space_shampoo.webp` | 1376×768 | /about 洗髮區 | **新增**，補掉上面「尚缺」表的第一列；`ABOUT_SPACE` 的洗髮區已從 `space_detail` 改指這張 |

## ⚠ Gemini 的輸出是固定 1MP，prompt 寫「1920」沒有用

實際量過手上每一張：

| 比例 | 尺寸 | 像素數 |
|---|---|---|
| 16:9 | 1376×768 | 1.06 MP |
| 3:2 | 1264×848 | 1.07 MP |
| 21:9 | 1584×672 | 1.06 MP |
| 4:5 | 928×1152 | 1.07 MP |

比例不同、像素數一樣——模型是在一塊固定約 1MP 的畫布上畫，只換長寬比。
輸出解析度不是 prompt 參數，所以要求「1920」不會有反應，換付費方案也不會變。
要更大只有兩條路：換支援 2K/4K 輸出的模型，或轉檔前先放大。

**在那之前，先別浪費已經有的像素。** 目前最大的損耗是比例出錯：

| 版位 | 生圖比例 | 裁完剩 | 2× 螢幕需要 |
|---|---|---|---|
| `/about` 頁首 3:4 | 出 16:9 ❌ | 576×768 | 1400×1866 |
| `/about` 頁首 3:4 | 出 3:4 ✅ | ~890×1180 | 1400×1866 |
| 收尾帶 21:9 | 出 3:2 ❌ | 1264×542 | 2880×1234 |

同樣 1MP，出 3:4 給 3:4 的版位，可用像素多一倍。版位比例寫在各頁 `.vue` 的
`MgImage ratio`，生圖前先對一下。
