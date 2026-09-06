# 留白髮所 MARGIN — Nuxt 4 + Tailwind CSS 4

`Works Page Hi-Fi.dc.html` 的實作。那份高擬真稿其實不只作品集列表，
而是整個站：首頁、關於、服務價目、店家資訊，加上
「作品集 → 作品單頁 → 設計師單頁 → 五步驟預約 → 預約完成」這條動線，
這個專案把它整個做出來。

```bash
npm install     # 需要 .npmrc 裡的 legacy-peer-deps，原因見該檔註解
npm run dev     # http://127.0.0.1:3000
npm run build
npx nuxt typecheck
```

## 來源

從 claude.ai/design 專案 `570447c2-d539-4025-a046-4f8a85b206b1` 匯入：

| 專案檔 | 用途 |
|---|---|
| `Works Page Hi-Fi.dc.html` | 版面、狀態、文案、資料、流程邏輯 |
| `_ds/margin-design-system-…/tokens/*.css` | 設計 token，逐字複製到 `app/assets/css/tokens/` |
| `_ds/margin-design-system-…/_ds_bundle.js` | 16 個元件的實作規格（尺寸、狀態、hover 行為） |

`app/assets/css/tokens/` 是從設計系統抄過來的，**要改請重新同步，不要手改**。
`main.css` 用 `@theme inline` 把這些 token 接到 Tailwind，utility 與元件因此指向同一批變數。

高擬真稿自己定義的頁面骨架（`mg-gut` / `mg-grid3` / `mg-head` / `mg-book` …）
也照抄進 `main.css`。它的斷點是 **1200 與 900**，不是 Tailwind 的預設值，
所以維持成獨立的一層，沒有改寫成 `lg:` 前綴。

## 路由

| 路由 | 內容 |
|---|---|
| `/` | 首頁：滿版開場、開場白、三件作品、四位設計師、價目導引 |
| `/about` | 關於我們：右對齊標題、三條原則、空間照 |
| `/services` | 服務與價目：五個類別的完整價目，加上加價／遲到／取消／付款 |
| `/store` | 店家資訊：地址時間、交通提示、周邊地圖 |
| `/works` | 作品集列表：下拉篩選、空狀態、LOAD MORE |
| `/works/[code]` | 作品單頁：規格列、標籤、相關作品 |
| `/stylists` | 設計師索引（**高擬真稿沒有這頁**，見下方「與稿子的差異」） |
| `/stylists/[slug]` | 設計師單頁：132px 大名字、自述、近期空檔 |
| `/booking` | 五步驟預約，含三種邊界狀態 |
| `/booking/done` | 預約完成：編號、加入行事曆、交通提醒、取消／改期 |

## 後端 API

| 端點 | 用途 |
|---|---|
| `GET /api/works` | 作品集列表（篩選、排序、分頁） |
| `GET /api/booking/availability` | 月曆的日期狀態 |
| `GET /api/booking/slots` | 某一天的時段，全滿時附替代時間 |
| `POST /api/booking` | 送出預約 ＋ 寄確認信與店內通知信 |
| `POST /api/careers` | 應徵表單 ＋ 寄店內通知信 |
| `GET /api/booking/check` | **僅開發模式**，檢查四本日曆接上了沒、讀不到要去哪裡修 |

## 元件

`app/components/Mg*.vue`，一支對一支對應設計系統：

```
core/        MgButton（primary/secondary/link/label ＋ sm）、MgChip、MgBreadcrumb
forms/       MgDropdown（未選／已選／展開三態）、MgInput（含錯誤態）
content/     MgWorkCard、MgStylistCard、MgPriceRow、MgImage
booking/     MgStepBar、MgDatePicker、MgTimeSlot、MgBookingSummary
feedback/    MgModal、MgToast
navigation/  MgNav（site／booking／compact）、MgFooter
```

`MgCtaBand` 不在設計系統裡：高擬真稿在首頁、關於、服務、店家、作品集結尾各放了一次
同一塊 21:9 收尾帶，只有影像註記與兩行大標不同，所以收成一支元件。

`MgPriceRow` 有 `selectable`。設計系統的 PriceRow 只在接到 `onToggle` 時畫勾選方塊，
Vue 這邊看不到父層有沒有綁 `@toggle`（宣告過的 emit 不會留在 attrs 裡），
所以拉成一個明講的 prop：`/services` 是純列表，預約第二步才可勾選。

## 已實作的狀態

- **作品集**：篩選狀態放在網址上（`?service=&stylist=&sort=&limit=`），複製連結就能分享同一組條件。
  空狀態保留篩選，給「只看這位設計師」與「看全部作品」兩個出口。首次載入用骨架屏。
- **預約流程**：每一步的右側摘要會把當步剛決定的值提升成 20px 宋體或 Archivo 金額，
  未完成的欄位顯示「尚未選擇」，停用原因寫在按鈕下方。
- **三種邊界狀態**（高擬真稿把它做成一個 prop，這裡保留成網址參數）：
  - 當日接不下來 — 選 9/12，日期格轉 accent 填色，右側出現 NO ROOM THAT DAY 與三個替代時段
  - 時段被搶走 — `/booking` 預設，送出時跳 SLOT TAKEN 對話框
  - 送出失敗 — `/booking?edge=fail`，nav 下方出現黑底 banner，資料保留可重送
  - 不要邊界狀態：`/booking?edge=none`

  `?edge=` **只在示範模式下有效**。接上 Google 日曆之後這兩種狀態是真的會發生的
  （送出前後之間時段被搶走、預約系統回錯、流量限制），走的是同一組 UI，
  訊息換成後端回的那一句。所以這幾個狀態不是擺著好看的，是真的接線的。

## 與稿子的差異（都是刻意的）

1. **欄位級錯誤改成離開欄位時檢查。** 稿子把 `touched` 設在 `next()` 裡，但那一步的
   「下一步」在填完之前本來就是停用的，所以設計好的錯誤態（2px `#C8351C` ＋ Archivo「!」）
   在原型裡其實走不到。改成 blur 檢查之後才真的會出現。
2. **送出成功後留下收據、清掉流程狀態。** 否則從完成頁再進 `/booking` 會停在別人上一次的
   第五步。`/booking/done` 直接開會導回流程開頭。
3. **多做了 `/stylists` 索引頁。** 稿子的 STYLISTS 導覽是直接跳到某一位的個人頁，沒有索引；
   這裡用既有的 `MgStylistCard` 補一頁，讓導覽不會是死連結。
4. **首頁的作品區沒有「看全部」出口。** 稿子的 render values 有 `homeAllWorks`
   （"ALL 14 WORKS"）與 `goWorks`，但版面上沒有任何地方用到它們，作品格上方也沒有標題。
   這裡照著畫出來的樣子做，沒有自己補一個標題列 —— 導覽列的 WORKS 仍然到得了，
   所以不是死路。要補的話位置在 `app/pages/index.vue` 的作品區。

## 這次同步順手修掉的兩個 bug

兩個都不是新頁面帶進來的，是原本就在、只是沒有頁面踩到：

1. **壓在影像上的白色大標其實是黑的。** `main.css` 的 `h1,h2,h3,h4 { color: var(--text-heading) }`
   寫在最外層沒進 layer，而 Tailwind 的 utility 在 `@layer utilities` 裡；
   沒分層的規則贏過任何分層規則，所以 `text-surface-0` 完全沒作用。
   設計師個人頁 132px 的名字一直是 #111 疊在灰底上。改成 `@layer base` 就好了。
2. **`MgButton` 帶 `to` 時渲染出一顆點不動的按鈕。** 原本在 template 的 `:is` 運算式裡
   `resolveComponent('NuxtLink')`，解析失敗會退回字串，DOM 裡長出 `<nuxtlink to="...">`
   這種沒有 href 的自訂元素。八處連結按鈕（作品單頁、預約完成頁、設計師頁…）全都中。
   改成 `import { NuxtLink } from '#components'`。

## 還是暫代的部分

- **影像**全是 `#5E5E5E` 佔位塊，右上角標著裁切規格。設計系統 readme 說明目前沒有實拍素材，
  接上時只要打開 `MgImage` 裡的 `<img>`，21:9 / 4:5 / 1:1 三種比例規範不動。
- **資料**：作品集與髮型誌來自 Notion（見下方「內容從哪裡來」）；設計師、服務項目、
  價目仍寫在 `shared/margin.ts`。版面與語氣沿用高擬真稿，但品牌事實已對回 PRD，
  見下方「品牌事實的權威來源」。
- **圖示**沿用稿子的 unicode（▼ ▲ ● ✕ ‹ › ＋）。設計系統交接規格提到圖示系統還沒定案。
- **月曆**固定顯示 2026 年 9 月，切換上下月的箭頭還沒接（`BOOKING_MONTH` 這一個常數決定）。
- **預約通知只有 Email，沒有簡訊。** PRD F-10 寫的是「完成信／簡訊」，簡訊要另接台灣的簡訊商。
- **地圖**（`/store`）是 21:9 灰底佔位，還沒接圖資。

## 內容從哪裡來

作品集與髮型誌走 Notion（PRD D-05、F-07）；其餘內容硬寫在 `shared/`。

```
Notion（三個資料庫）
  └─ npm run sync:notion
       ├─ shared/journal.data.ts     髮型誌
       ├─ shared/works.data.ts       作品集
       ├─ app/utils/img.assets.ts    public/img 尺寸表
       └─ public/img/*.webp          從 Notion 下載的圖（含 @640 / @1280）
```

**這四個產出物要進版控。** `nuxt build` 只讀檔案，完全不碰 Notion，
所以部署環境不需要 `NOTION_TOKEN`，Notion 掛掉也發得了版；內容改了什麼也會出現在 git diff 裡。

### 改內容的流程

1. 在 Notion 改（資料庫在「留白髮所 MARGIN — 網站 CMS」底下）
2. `npm run sync:notion`
3. 看一下 git diff，沒問題就 commit

**寫文章的人看這份：[髮型誌發文手冊](https://claude.ai/code/artifact/47fb7a10-dbd5-4640-8b6a-eda5794b2fb4)**
——欄位怎麼填、內文格式、常見狀況。這裡只寫技術面的取捨，操作步驟不重複寫一份。

**只有「狀態＝上線」的會被抓下來**（PRD §13.5）。草稿留在 Notion，不會進到 bundle 裡——
所以未發布的標題不會被人從網頁原始碼翻出來。

### 第一次要先做的事

`.env` 不在版控裡，所以新環境要自己準備一次。完整步驟寫在 `.env.example` 的註解裡，這裡講重點。

**integration 不是 Notion 裡的一頁**，是一把讓程式讀資料庫的鑰匙，建在帳號的開發者設定，
跟工作區的頁面無關 —— 不用在「留白髮所」底下新增任何東西。

1. 到 <https://app.notion.com/developers/connections> 建一個 internal integration，
   複製密鑰（`ntn_` 或 `secret_` 開頭）填進 `.env` 的 `NOTION_TOKEN`
2. 到 Notion 的「留白髮所 MARGIN — 網站 CMS」那一頁，右上角 ⋯ → 連結，
   把剛剛那個 integration 加進去（子頁面會繼承，三個資料庫一次搞定）

**第 2 步漏掉的話 API 會回 404**，因為 integration 預設看不到你的任何頁面 ——
這是 Notion 的權限設計，不是設定錯了。

### 圖片

Notion 的檔案網址約 1 小時後失效，所以不能直接引用（§13.5）。
同步時會把圖抓下來轉成 webp、順便產生 `@640` 與 `@1280`，存進 `public/img`。

封面圖留空的話，會退回用「圖片檔名」欄位指向 `public/img` 既有素材——
現在站上都是佔位圖，沒必要把它們丟進 Notion。換實拍時在 Notion 上傳、這個欄位留空就好。

## 預約與寄信怎麼接（F-06／F-10／F-11）

```
/booking 五步驟 UI
  ├─ GET  /api/booking/availability ─┐
  ├─ GET  /api/booking/slots        ─┼─ server/utils/booking.ts   ← 排程規則在這裡
  └─ POST /api/booking              ─┘      ├─ 有金鑰 → Google 日曆（freeBusy／events.insert）
                                            └─ 沒金鑰 → 站上的示範空檔
                                    └─ server/utils/mail.ts → Resend
/careers 應徵表單
  └─ POST /api/careers ──────────────────── server/utils/mail.ts → Resend
```

**設計師本來就在用日曆，所以不另外養一套預約後台**（PRD D-12）：
空檔就是日曆上沒事的時段，預約就是日曆上多一個活動。店家要看今天有誰要來，
打開自己的 Google 日曆就好。

**「有沒有空」的規則全部在 `server/utils/booking.ts`，不在 Google 那邊**：

| 規則 | 來源 |
|---|---|
| 開始時間 11:00–18:00 | `SLOT_TIMES` |
| 20:00 打烊，做不完就不開放 | `CLOSE_TIME` |
| 週一公休 | `CLOSED_DAYS` |
| 需提前一小時 | `LEAD_MINUTES`（PRD §6.9） |
| 這次要做多久 | `MENU` 的時長總和 |

Google 只回答一件事：**這位設計師哪幾段時間已經有事了。**
所以價格、時長、營業時間仍然只有 `shared/margin.ts` 一個來源，不會兩邊各寫一份。

**沒有金鑰也要跑得起來**，這是這一層唯一的硬規則。`.env` 空著時：

- `/booking` 的空檔來自 `server/utils/booking.ts` 的示範資料（9/1–9/4 已過、週一公休、
  12:00 與 15:00 已滿、9/12 當天排不下），三種邊界狀態照樣演得出來
- 預約與應徵仍然送得出去，只是不寄信，畫面上會照實說「確認信這次沒有寄出去」——不假裝

判斷「示範還是真的」寫在後端，前端只有一條路徑。所以接上金鑰的那一天，
`app/pages/booking/index.vue` 一行都不用改。

### 第一次設定

照 `.env.example` 走（那裡有逐步說明），大意是：

1. Google Cloud 建專案 → 啟用 Calendar API → 建 service account → 下載 JSON 金鑰
2. JSON 裡的 `client_email` 與 `private_key` 填進 `NUXT_GOOGLE_SA_EMAIL`／`NUXT_GOOGLE_SA_KEY`
3. **每位設計師的日曆 → 設定與共用 → 加入那個 `client_email`，權限給「變更活動」**，
   再把「日曆 ID」填進 `NUXT_GCAL_SHU` 等四個變數
4. `npm run dev`，打開 <http://127.0.0.1:3000/api/booking/check> 確認誰接上了
5. 填 `NUXT_RESEND_API_KEY`、`NUXT_MAIL_FROM`、`NUXT_MAIL_INBOX`

第 3 步**漏掉分享那個動作 API 不會報錯**，那位設計師會安靜地退回示範空檔。
`/api/booking/check` 就是為了讓這件事看得見才做的。沒接上的設計師是**單獨**退回，
不會整站失效。

### 這一層刻意沒做的事

- **不裝 SDK。** Google 只用到三個端點，service account 的 JWT 用 node 內建的
  `crypto` 就簽得出來；Resend 是一個 POST。跟 `scripts/lib/notion.ts` 同一個判斷。
- **金鑰不進 `runtimeConfig.public`。** 全部只有伺服器讀得到。
- **日曆 id 走環境變數，不進版控。** 它是一組信箱，屬於部署身分不是專案設定。
- **不加 attendees。** service account 沒有 domain-wide delegation 時不能寄日曆邀請，
  加了整個請求會被拒。顧客那封信由 Resend 寄，本來就不靠日曆邀請。
- **信寄不出去不算預約失敗。** 順序是「先寫日曆，再寄信」，第二步失敗只換文案。

### 已知的取捨（都在 PRD D-12 裡）

- **沒有原子性的訂位。** 活動 id 擋得住起始時間相同的兩筆，擋不住時間重疊的兩筆，
  所以送出前會再查一次 freeBusy。中間那幾百毫秒就是「時段被搶走」存在的原因。
- **改期與取消是單向的。** 設計師在日曆上改，網站不會知道，也不會通知顧客。
  所以完成頁給的是電話，不是線上取消連結。

## 系統規則（改動前請先讀）

- 只有黑白＋單一強調色 `#C8351C`，**不得新增第二個彩色**。
- 無漸層、無陰影，`radius` 一律 0（`@theme` 裡已把 Tailwind 的 `--radius-*` 清掉）。
- 按鈕文字用 Noto Sans TC，不是 Archivo；Archivo 只出現在英文標籤、數字、日期。
- hover 一律降不透明度，不換色。
- 對客人用「你」不用「您」，不使用 emoji。
- 電話 07-338-0088 是 PRD 指定的次要聯絡方式，可以出現；**不得出現 LINE**（D-01）。
- 頁尾只有 IG／KAOHSIUNG，社群只有 IG（PRD §1.2，沒有 FB）。

## 品牌事實的權威來源

`shared/margin.ts` 的 `BRAND` 常數是店址、商圈、電話、社群、Slogan 的唯一來源，
對應 **PRD v1.3.1 §1.1／§1.2**。設計師的姓名、職級、年資、擅長項目對應 PRD §1.2 與全站文案 §8。

高擬真稿自己換過一套設定（鹽埕區五福四路、Amber／Ken／Leo、無電話有 FB），
那一套已經全部移除。要改這些值，先改 PRD，再改 `BRAND`，不要在頁面裡各寫一份。

| 事實 | 值 |
|---|---|
| Slogan | 剪去多餘，留下你 |
| 店址 | 高雄市苓雅區文橫二路 88 號 2 樓（三多商圈） |
| 電話 | 07-338-0088 |
| 營業時間 | 週二–週日 11:00–20:00（最後預約 18:00），週一公休 |
| 社群 | IG ＠margin.hair（沒有 FB、沒有 LINE） |
| 設計師 | 周敘 Shu 總監 15 年／林宜家 Yuki 資深 9 年／陳柏睿 Ray 設計師 6 年／黃安 An 設計師 5 年 |

尚未對齊的部分（版面層與缺件層）記在對照清單裡，不在這一輪的範圍。

## 環境提醒

`nuxt.config.ts` 把 dev server 釘在 `127.0.0.1:3000`。不釘的話 Nuxt 有時會把 app 綁在 IPv6、
HMR websocket 綁在 wildcard，於是 `http://localhost:3000` 會打到 websocket 並回
`426 Upgrade Required`。
