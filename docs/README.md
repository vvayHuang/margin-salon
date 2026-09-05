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

## 目前的 backlog（依投報率排序）

1. `Service`（服務單頁）、`ImageObject`（作品單頁）、`Person`（設計師頁）、
   `FAQPage`（`/services`）結構化資料 — 內容都上站了，各約十行
2. sitemap.xml、robots.txt
3. 髮型誌 `/journal`、`/careers`、`/privacy`、404／500

## 與 v1.3.1／v2.0 的差異

見 `git log docs/`。第一個 commit 是原樣匯入，第二個之後才是修訂。
