# 規格文件

三份文件原本只存在 `~/Downloads`，與程式各走各的。2026-09-05 收進版控，
之後每一次修訂都可 diff、可回溯。

| 檔案 | 版本 | 管什麼 |
|---|---|---|
| `美髮沙龍形象網站_PRD.md` | v1.4 | 規格、資訊架構、功能需求、**決策記錄**。三份文件裡的最高權威 |
| `02-全站文案.md` | v2.1 | 站上所有文字的唯一來源 |
| `04-SEO.md` | v2.1 | 每頁 meta、結構化資料、技術檢查表 |

## 權威分工

**品牌事實**（店址、商圈、電話、營業時間、社群、Slogan、設計師名單與職級）
以 PRD §1.1／§1.2 為準，程式端的落點是 `shared/margin.ts` 的 `BRAND` 常數與
`STYLISTS`。要改先改 PRD，再改程式。

**版面與互動**以站上實作為準。設計與切版階段推翻 PRD 的地方，一律回填成
決策記錄（目前到 D-10），不留在程式碼裡當口耳相傳。

**尚未實作的項目**留在文件裡並標「未實作」，不寫進決策記錄——
「還沒做」和「決定不做」在交件時是兩件事，混在一起會讓 backlog 憑空消失。

## 已完成（2026-09-05）

- ~~各頁 meta 與 `HairSalon` 結構化資料~~ — `shared/seo.ts`、`app/composables/useMgSeo.ts`
- ~~設計師個人頁的顧客評價~~ — D-04 的對策到此兌現
- ~~作品單頁的「需要漂髮」與「使用色號」~~ — `WORKS[].bleach` / `.colorCode`
- ~~手機 Sticky 預約列~~（F-02，P0）— `MgStickyBook`，D-09 的風險對策到此兌現
- ~~服務單頁 ×5~~ — `shared/services.ts` ＋ `pages/services/[slug].vue`，組合見 **D-11**
- ~~FAQ 折疊~~（F-09）— `MgFaq`，原生 details／summary
- ~~`/services` 常見問題~~ — 7 題（文案 §3 的 8 題拿掉「為什麼沒有 LINE」）
- ~~`/about` 品牌故事「店名的由來」~~ — 文案 §2，286 字
- ~~設計師個人頁的個人價目與 IG~~ — 順帶補上價目表缺的「總監剪髮 1,800」

- ~~`Service`／`ImageObject`／`Person`／`FAQPage` 結構化資料~~
- ~~sitemap.xml、robots.txt~~ — `server/routes/` 的兩支 Nitro route

- ~~`/privacy`、`/careers`、404／500~~
- ~~髮型誌 `/journal` ＋ 文章單頁 ＋ `Article` schema~~
- ~~Notion CMS 串接（F-07）~~

## 目前的 backlog

原本盤點的七項都做完了。剩下的是需要外部素材或決策才能動的：

1. **實拍素材** — 全站影像仍是 Unsplash 佔位圖，頁尾有聲明。
   四張設計師頭像色調不統一（`stylist_yuki` 帶藍紫燈光、`stylist_shu` 是黑白），
   換實拍時一起處理。作品的 Before／After 也要等實拍才能補（D-11）
2. **Notion integration token** — CMS 已接好（F-07），但第一次同步前要先到
   <https://app.notion.com/developers/connections> 建一個 internal integration、把 secret 填進 `.env`，
   再把三個資料庫用 Connections 加進去。細節見 `.env.example`
3. **預約後端**（F-06 串 SimplyBook.me、F-10 通知信）與**徵才信件通知**（F-11）
   ——目前兩個表單都只有前端，頁面上有明講
4. **髮型誌 M2／M3 共 7 篇**（排程見 04-SEO §8）——七篇的標題、分類、作者、摘要
   已經建在 Notion 的「髮型誌 Journal」裡，狀態是草稿；內文寫完把狀態改成「上線」
   再跑一次同步就會上站
5. `JobPosting` schema（P2，`validThrough` 過期未更新會被移除，維護成本較高）
6. Logo 與 favicon（`public/img/README.md` 的「尚缺」段）

## 與 v1.3.1／v2.0 的差異

見 `git log docs/`。第一個 commit 是原樣匯入，第二個之後才是修訂。
