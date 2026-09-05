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
| `/booking/done` | 預約完成 |

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
- **資料**在 `shared/margin.ts`，逐字取自高擬真稿（14 件作品、4 位設計師、9 個服務項目）。
- **圖示**沿用稿子的 unicode（▼ ▲ ● ✕ ‹ › ＋）。設計系統交接規格提到圖示系統還沒定案。
- **月曆**固定顯示 2026 年 9 月，切換上下月的箭頭還沒接。
- **地圖**（`/store`）是 21:9 灰底佔位，還沒接圖資。

## 系統規則（改動前請先讀）

- 只有黑白＋單一強調色 `#C8351C`，**不得新增第二個彩色**。
- 無漸層、無陰影，`radius` 一律 0（`@theme` 裡已把 Tailwind 的 `--radius-*` 清掉）。
- 按鈕文字用 Noto Sans TC，不是 Archivo；Archivo 只出現在英文標籤、數字、日期。
- hover 一律降不透明度，不換色。
- 對客人用「你」不用「您」，不使用 emoji。
- **全站不放電話號碼**，只有送出失敗的 banner 保留來電作為救援出口。
- 頁尾只有 IG／FB／KAOHSIUNG 三個，跟設計系統 Footer 的預設一致。

## 環境提醒

`nuxt.config.ts` 把 dev server 釘在 `127.0.0.1:3000`。不釘的話 Nuxt 有時會把 app 綁在 IPv6、
HMR websocket 綁在 wildcard，於是 `http://localhost:3000` 會打到 websocket 並回
`426 Upgrade Required`。
