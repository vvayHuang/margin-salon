# SEO 規劃｜留白髮所 MARGIN

**依據**：PRD **v1.4** §2.2（KPI）、§9（非功能需求 SEO 段）
**網域**：`https://marginhair.com.tw`｜語系 `zh-Hant-TW`｜地區：高雄市苓雅區・三多商圈
**版本**：v2.1（2026-09-05；v2.0：2026-09-01）

> **v2.1 修訂**：`/store` 更名為 `/store`、麵包屑與 `BreadcrumbList` 移除（PRD D-09／D-10）。
>
> ⚠️ **本文件的內容目前幾乎都還沒實作**：站上只有各頁 `title`，沒有 description、
> canonical、OG／Twitter、任何一段結構化資料、sitemap.xml 或 robots.txt。
> 服務單頁 ×5 與髮型誌 12 篇也還不存在，因此 §1 的服務字與長尾字**沒有落點頁**。
> 這些是 backlog，不是被推翻的決策。

---

## 1. 關鍵字分群

### 核心字（Head，競爭高）
`高雄 髮廊`／`高雄 美髮沙龍`／`高雄 剪髮`
→ 短期打不贏連鎖店，只放在首頁 H1 附近，**不作為主要目標**。

### 在地字（主戰場）⭐

| 關鍵字 | 意圖 | 對應頁面 |
|---|---|---|
| 苓雅 髮廊 | 導航 | `/` |
| 三多商圈 美髮沙龍 | 導航 | `/`、`/store` |
| 文橫二路 髮廊 | 導航 | `/store` |
| 三多商圈 剪髮 | 導航 | `/`、`/services` |
| 高雄 預約制 髮廊 | 比較 | `/about` |
| 高雄 不推銷 髮廊 | 比較 | `/about` |

### 服務字（轉換意圖高）⭐ 對應 5 個服務單頁

| 關鍵字 | 對應頁面 |
|---|---|
| 高雄 韓系燙 推薦 | `/services/perm` |
| 高雄 層次燙 價格 | `/services/perm` |
| 高雄 透明感染髮 | `/services/color` |
| 高雄 染髮 價格 | `/services/color` |
| 高雄 頭皮養護 推薦 | `/services/scalp` |
| 高雄 護髮 價錢 | `/services/treatment` |
| 高雄 接髮 | `/services/extension` |
| 高雄 男生 剪髮 | `/services`、`/stylists/ray` |

> 服務單頁是本站 SEO 的主力。PRD 讓每個服務有獨立頁面（§6.3），這剛好對上「地區＋服務＋意圖」的搜尋結構 — 一般沙龍把所有服務塞在一頁，拿不到這些字。

### 內容長尾字（髮型誌，成本最低）

| 關鍵字 | 對應文章 |
|---|---|
| 2026 韓系燙 趨勢 | #1 |
| 透明感染髮 要漂嗎 | #2 |
| 灰霧色 褪色 | #3 |
| 細軟髮 打薄 | #4 |
| 男生 剪髮 溝通 | #5 |
| 安全帽 瀏海 | #6 ⭐ 高雄在地長尾，競爭極低 |
| 頭皮出油 有味道 | #7 |
| 護髮 需要嗎 | #8 |
| 漂髮 傷害 | #9 |

### 品牌字
`留白髮所`／`MARGIN Hair Studio`／`margin 髮廊`
→ 對應 PRD KPI「品牌關鍵字自然流量 3 個月內成長 50%」。

### 策略順序
```
M1–M2　髮型誌長尾字累積索引與站權重
M2–M3　服務單頁的「地區＋服務」字開始有排名
M3+　　在地字（苓雅／三多商圈）進前 10
全程　　Google 商家檔案同步經營（權重占比高於官網）
```

---

## 2. 各頁 Meta（PRD §9：每頁獨立 title / description）

> 規範：Title ≤ 30 全形字；Description 80–110 全形字。
> 標題公式：`行政區/商圈 + 品類 + 差異點｜品牌名`

### 首頁 `/`
```
Title:       苓雅美髮沙龍｜留白髮所 MARGIN・三多商圈預約制
Description: 高雄三多商圈的預約制美髮沙龍，一位設計師同時段只服務一位客人。價格全公開、不推銷、不辦卡。捷運三多商圈站步行 5 分鐘，線上預約 30 秒完成。
Canonical:   https://marginhair.com.tw/
OG Image:    /og/og_default.jpg
```

### 關於我們 `/about`
```
Title:       關於留白髮所｜高雄苓雅預約制沙龍・不推銷不辦卡
Description: 排版裡的 margin 是留白，看起來什麼都沒有，卻決定主體好不好看。我們同時段只服務一位客人，沒有會員卡、沒有儲值、設計師無銷售抽成。
```

### 服務與價目 `/services`
```
Title:       服務與價目｜高雄剪髮 1200 起・染燙價格全公開｜MARGIN
Description: 剪髮 1,200 起、染髮 3,000 起、燙髮 3,500 起、護髮 1,200 起、頭皮養護 1,500 起。長髮加價與職級價差全部寫明，官網看到的就是結帳金額。
```

### 服務單頁 ×5
```
/services/perm
Title:       韓系層次燙｜高雄苓雅燙髮 3500 起｜留白髮所 MARGIN
Description: 韓系層次燙讓髮尾有方向而不是有形狀。依髮質調整軟化時間，含吹整教學。3,500 起，約需 3 小時。高雄三多商圈，線上預約。

/services/color
Title:       透明感染髮｜高雄染髮 3000 起・褪色也好看｜MARGIN
Description: 低彩度染髮，配色時把褪色後的樣子一起算進去。需漂髮者諮詢報價後才開始施作。3,000 起，高雄苓雅三多商圈預約制沙龍。

/services/scalp
Title:       頭皮養護｜高雄頭皮深層清潔 1500 起｜留白髮所 MARGIN
Description: 出油、癢、異味與掉髮，先用放大鏡看毛孔再決定做什麼。無矽靈無 SLS，敏感頭皮與孕期可做。1,500 起，高雄三多商圈。

/services/treatment
Title:       護髮｜高雄結構式護髮・先判斷你需不需要｜MARGIN
Description: 只是乾的話基礎護髮就夠了。我們摸過再決定，不會預設你需要最貴的那個。基礎 1,200／結構式 2,200／髮質重建 3,500。

/services/extension
Title:       接髮｜高雄苓雅接髮諮詢｜留白髮所 MARGIN
Description: 補長度也要補得看不出接點。依髮量與想要的長度報價，諮詢後才確認金額。高雄三多商圈，全預約制。
```

### 作品集 `/works`
```
Title:       作品集｜韓系燙・透明感染髮案例｜留白髮所 MARGIN
Description: 依服務類型、髮長、設計師與髮色系篩選。每件作品都標註使用色號、是否需要漂髮與施作時長，讓你判斷做不做得起來。
```

### 作品單頁 `/works/{slug}`
```
Title:       {作品標題}｜{設計師} 作品｜留白髮所 MARGIN
Description: {服務類型}・{髮長}・{髮色系}。{設計師的話前 60 字}
OG Type:     article
```

### 設計師列表 `/stylists`
```
Title:       設計師｜找到適合你的那一位｜留白髮所 MARGIN
Description: 總監 1 位、資深設計師 1 位、設計師 2 位。每個人的擅長項目都寫明白，選人比選店重要。可直接指名預約。
```

### 設計師個人頁 ×4
```
/stylists/shu
Title:       周敘 Shu｜總監・韓系層次燙｜留白髮所 MARGIN
Description: 年資 15 年，擅長韓系層次燙、剪髮結構與髮質重建。剪之前一定會問你早上有多少時間、會不會吹頭髮。高雄苓雅，可線上指名預約。

/stylists/yuki
Title:       林宜家 Yuki｜資深設計師・透明感染髮｜MARGIN
Description: 年資 9 年，專做低彩度顏色。配色時把褪色後的樣子一起算進去，所以作品偏灰。高雄苓雅三多商圈，可線上指名預約。

/stylists/ray
Title:       陳柏睿 Ray｜設計師・短髮與男士剪髮｜MARGIN
Description: 年資 6 年，擅長短髮修剪、男士造型與瀏海設計。會先看髮旋、後腦勺與耳朵位置，戴安全帽的人請務必告知。

/stylists/an
Title:       黃安 An｜設計師・頭皮養護與護髮｜MARGIN
Description: 年資 5 年，主做頭皮與護髮。用放大鏡看毛孔並把螢幕轉給你一起看，不會因為你坐下就開始加項目。
```

### 門市資訊 `/store`（原 `/location`，更名見 PRD D-10）
```
Title:       門市資訊｜高雄苓雅文橫二路・三多商圈站 5 分鐘｜MARGIN
Description: 高雄市苓雅區文橫二路 88 號 2 樓，一樓是咖啡店。捷運三多商圈站 2 號出口步行 5 分鐘，附停車與機車停放說明。週二至週日 11:00–20:00。
```

### 髮型誌 `/journal`
```
Title:       髮型誌｜髮色圖鑑與保養知識｜留白髮所 MARGIN
Description: 透明感染髮要不要漂、灰霧色褪色會變什麼顏色、戴安全帽的瀏海怎麼剪。四位設計師寫的實務筆記，分趨勢、保養、髮色圖鑑三類。
```

### 文章單頁 `/journal/{slug}`
```
Title:       {文章標題}｜留白髮所 MARGIN
Description: {Notion 摘要欄位 60 字，列表與 meta 共用 — §13.4}
OG Type:     article
```

### 加入我們 `/careers`
```
Title:       加入我們｜高雄美髮設計師與助理職缺｜MARGIN
Description: 沒有業績抽成，所以不用推銷。教育訓練排在上班時間、不佔休假也不收學費。設計師底薪 35,000 起、助理 30,000 起，週休二日。
```

### 線上預約 `/booking`
```
Title:       線上預約｜留白髮所 MARGIN・高雄三多商圈
Description: 五個步驟 30 秒完成：選設計師、選服務、選時段、填資料、確認。我們沒有 LINE，因為設計師在服務你的時候不應該低頭回訊息。
Robots:      index, follow   ←（此頁是轉換頁也是內容頁，要被索引）
```

### 預約完成 `/booking/done`
```
Robots:      noindex, nofollow
```

### 隱私權政策 `/privacy`
```
Title:       隱私權政策｜留白髮所 MARGIN
Robots:      index, follow
```

---

## 3. Open Graph / Twitter Card

```html
<meta property="og:type"         content="website">
<meta property="og:site_name"    content="留白髮所 MARGIN Hair Studio">
<meta property="og:locale"       content="zh_TW">
<meta property="og:title"        content="{頁面 Title}">
<meta property="og:description"  content="{頁面 Description}">
<meta property="og:url"          content="https://marginhair.com.tw/{path}">
<meta property="og:image"        content="https://marginhair.com.tw/og/og_default.jpg">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt"    content="留白髮所 MARGIN 的店內空間">

<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="{頁面 Title}">
<meta name="twitter:description" content="{頁面 Description}">
<meta name="twitter:image"       content="https://marginhair.com.tw/og/og_default.jpg">
```

### Nuxt 4 寫法
```ts
useSeoMeta({
  title: '苓雅美髮沙龍｜留白髮所 MARGIN・三多商圈預約制',
  description: '高雄三多商圈的預約制美髮沙龍，一位設計師同時段只服務一位客人…',
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogImage: 'https://marginhair.com.tw/og/og_default.jpg',
  ogUrl: 'https://marginhair.com.tw/',
  twitterCard: 'summary_large_image',
})
```

---

## 4. 結構化資料（PRD §9 指定 `HairSalon` ＋ `ImageObject`）

### 4.1 HairSalon（首頁）⭐

```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": "https://marginhair.com.tw/#salon",
  "name": "留白髮所 MARGIN Hair Studio",
  "alternateName": "MARGIN Hair Studio",
  "url": "https://marginhair.com.tw/",
  "image": "https://marginhair.com.tw/og/og_default.jpg",
  "logo": "https://marginhair.com.tw/logo_light.svg",
  "description": "高雄三多商圈的預約制美髮沙龍，一位設計師同時段只服務一位客人。價格全公開，不推銷、不辦卡。",
  "slogan": "剪去多餘，留下你",
  "telephone": "+886-7-338-0088",
  "priceRange": "NT$1,200-4,500",
  "currenciesAccepted": "TWD",
  "paymentAccepted": "Cash, Credit Card, Mobile Payment",
  "publicAccess": false,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "文橫二路 88 號 2 樓",
    "addressLocality": "苓雅區",
    "addressRegion": "高雄市",
    "postalCode": "802",
    "addressCountry": "TW"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.6118,
    "longitude": 120.3050
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "11:00",
    "closes": "20:00"
  }],
  "specialOpeningHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Monday",
    "opens": "00:00",
    "closes": "00:00"
  }],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://marginhair.com.tw/booking",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    "result": { "@type": "Reservation", "name": "美髮預約" }
  },
  "sameAs": ["https://www.instagram.com/margin.hair/"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "服務項目",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "剪髮" },
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 1200, "priceCurrency": "TWD" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "染髮" },
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 3000, "priceCurrency": "TWD" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "燙髮" },
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 3500, "priceCurrency": "TWD" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "護髮" },
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 1200, "priceCurrency": "TWD" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "頭皮養護" },
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 1500, "priceCurrency": "TWD" } }
    ]
  }
}
```

> ⚠️ `openingHours` 與 Google 商家檔案必須完全一致，不一致會降低在地信任分數。

### 4.2 ImageObject（作品單頁，PRD §9 指定）

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://marginhair.com.tw/works/works_001_front.webp",
  "thumbnailUrl": "https://marginhair.com.tw/works/works_001_thumb.webp",
  "name": "羊毛捲＋奶茶棕",
  "description": "燙髮＋染髮，需單次漂髮，色號 10/81。中長髮，施作約 4 小時。",
  "caption": "透明感染髮｜中長髮｜Yuki",
  "width": 1200,
  "height": 1500,
  "creator": { "@type": "Person", "name": "林宜家 Yuki" },
  "copyrightHolder": { "@id": "https://marginhair.com.tw/#salon" },
  "acquireLicensePage": "https://marginhair.com.tw/privacy",
  "representativeOfPage": true
}
```
（註）`caption` 直接用 §13.1 的衍生欄位 `alt`，兩者共用同一份資料。

### 4.3 Service（服務單頁 ×5）

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "頭皮養護",
  "serviceType": "頭皮深層清潔與舒緩養護",
  "provider": { "@id": "https://marginhair.com.tw/#salon" },
  "areaServed": { "@type": "City", "name": "高雄市" },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": 1500,
    "highPrice": 2500,
    "priceCurrency": "TWD"
  }
}
```

### 4.4 Person（設計師個人頁 ×4）

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "林宜家 Yuki",
  "jobTitle": "資深設計師",
  "worksFor": { "@id": "https://marginhair.com.tw/#salon" },
  "knowsAbout": ["透明感染髮", "灰霧色系", "褪色設計"],
  "image": "https://marginhair.com.tw/stylist_yuki.webp",
  "sameAs": ["https://www.instagram.com/margin.hair/"]
}
```

### 4.5 FAQPage（`/services` 的常見問題區塊）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "為什麼沒有 LINE？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LINE 預約會讓設計師在服務中不斷回訊息，違反我們同時段只服務一位客人的原則。線上預約 30 秒可以完成。"
      }
    }
  ]
}
```
（其餘 7 題比照補齊。答案文字須與頁面上顯示的完全一致。）

### 4.6 ~~BreadcrumbList~~（**不做**，PRD D-09）

麵包屑已於設計階段移除。Google 的結構化資料規範要求 `BreadcrumbList`
反映頁面上實際存在的導覽軌跡，沒有畫面元素就不該只留 schema，因此一併取消。

若日後 D-09 被推翻、麵包屑補回，這段 schema 也要跟著補回：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "首頁", "item": "https://marginhair.com.tw/" },
    { "@type": "ListItem", "position": 2, "name": "服務價目", "item": "https://marginhair.com.tw/services" },
    { "@type": "ListItem", "position": 3, "name": "頭皮養護", "item": "https://marginhair.com.tw/services/scalp" }
  ]
}
```

### 4.7 Article（髮型誌文章頁）

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{文章標題}",
  "description": "{Notion 摘要欄位}",
  "datePublished": "{發布日期}",
  "dateModified": "{最後更新}",
  "author": { "@type": "Person", "name": "{作者，關聯自 Stylists}" },
  "publisher": { "@id": "https://marginhair.com.tw/#salon" },
  "image": "https://marginhair.com.tw/journal/journal_001.webp",
  "articleSection": "{分類：趨勢／保養知識／髮色圖鑑／店內公告}"
}
```

### 4.8 JobPosting（`/careers`，P2）

職缺頁可上 `JobPosting` schema 進入 Google 徵才搜尋。需填 `validThrough`、`baseSalary`、`employmentType`，過期未更新會被移除，維護成本較高，列為 P2。

---

## 5. 技術 SEO 檢查表

```
□ 每頁只有一個 <h1>，且含目標關鍵字
□ H2/H3 階層不跳級
□ 所有圖片有 alt；作品圖 alt 由程式從 Notion 欄位產生
□ 網址全小寫、用連字號、不含中文
□ 每頁 canonical 正確；作品篩選 URL（?service=color）指向 /works 主頁
□ 篩選 URL 可分享、可回上一頁（§13.2），但加 noindex 避免重複內容
□ sitemap.xml 自動產生（@nuxtjs/sitemap），排除 /booking/done
□ robots.txt 允許爬取，/booking/done 設 noindex
□ <html lang="zh-Hant-TW">
□ ~~麵包屑除首頁外全站顯示，並上 BreadcrumbList schema~~ — **不做，見 PRD D-09**
□ 手機可用性：字級 ≥ 16px、點擊區 ≥ 44×44px（含 Sticky 預約列，尚未實作）
□ `/location` 若曾對外露出，需 301 導向 `/store`（PRD D-10）
□ Core Web Vitals：LCP ≤ 2.5s（PRD §9）、INP < 200ms、CLS < 0.1
□ 電話用 <a href="tel:+886733800088">，地址用 <address>
□ 內部連結：每篇文章至少連 1 次 /services 或 /booking
□ 作品單頁必連設計師頁，設計師頁必連 /booking?stylist={slug}
□ ⚠️ D-09 取消了 Footer 的「最新 3 篇文章」精簡列（原為 D-04 保留的 SEO 內鏈）。
   髮型誌上線時需另補內鏈，否則文章頁會變成只能從 /journal 進入的孤島
□ 404 頁有導引連結
□ HTTPS + HSTS
□ Notion CMS 建置時抓資料，非執行時（§13.5）
```

---

## 6. 在地 SEO（Google 商家檔案）

Google 在地排名由**關聯性、距離、知名度**三者決定。官網只影響一部分，商家檔案權重同等甚至更高。

```
□ 商家名稱與官網完全一致：「留白髮所 MARGIN Hair Studio」
   ⚠️ 不要塞關鍵字（「留白髮所-高雄苓雅美髮沙龍推薦」會被檢舉降權）
□ 主要類別「美髮沙龍」，次要類別加「美容院」「理髮店」
□ 營業時間含週一公休、國定假日特殊時間
□ 屬性勾選：需預約、無障礙、行動支付
□ 服務項目與價格逐項填入，與官網 /services 一致
□ 商家簡介 750 字內，自然帶入「三多商圈」「苓雅」「預約制」
□ 相片：外觀 3、內部 5、作品 10、團隊 4，每月新增
□ 網站欄位指向 https://marginhair.com.tw/（加 UTM）
□ 預約連結指向 /booking  ← D-01 沒有 LINE，這個欄位更重要
□ 貼文：每兩週一則（新作品、公休公告、髮型誌新文）
□ 問與答：自問自答補上 /services 的 8 題 FAQ
□ 評論：結帳時口頭邀請，每則都回覆（負評也回，語氣同官網）
□ NAP 一致性：名稱／地址／電話在官網、GBP、IG 三處完全相同
```

> ⚠️ 因為不做 LINE（D-01），**Google 商家的「預約」按鈕是官網之外唯一的預約入口**，優先權比一般沙龍高。

---

## 7. 追蹤與 KPI 對照（PRD §2.2）

| PRD KPI | 目標值 | GA4 設定 |
|---|---|---|
| 預約 CTA 點擊率 ≥ 8% | 工作階段 | 事件 `cta_booking_click`，含 `location` 參數。D-09 之後入口只剩 `cta_band`（頁底收尾帶）與 `sticky`（尚未實作）；若 8% 撐不起來，這份分佈就是加回 Header 按鈕的依據 |
| 完成預約數 +30%/月 | 後台 | 事件 `booking_complete`，設為轉換 |
| 平均工作階段時間 ≥ 90 秒 | GA4 | 內建 |
| 品牌關鍵字流量 +50%／3 個月 | GSC | 篩「留白髮所」「margin hair」 |
| 手機跳出率 ≤ 55% | GA4 | 裝置維度區分 |

### 額外建議事件

| 事件 | 用途 |
|---|---|
| `booking_step_view`（step 1–5） | 找出預約流程哪一步流失最多 ← 作品集可放這張漏斗圖 |
| `booking_abandon` | 中途離開的步驟 |
| `works_filter_use` | 哪個篩選軸最常用，決定 P1 的髮色系要不要做 |
| `stylist_view` | 哪位設計師頁最多人看 |
| `tel_click` / `map_click` | Persona C 的行為 |
| `no_slot_view` | 「該日無空位」出現頻率 → 反映排班問題 |

---

## 8. 內容排程（前三個月，對應 PRD §10 里程碑之後）

| 月份 | 產出 | 目標 |
|---|---|---|
| M1 | 髮型誌 #1 #2 #5 #7＋GBP 完整設定＋提交 sitemap | 讓站有內容可被索引 |
| M2 | 髮型誌 #3 #4 #6 #8＋作品集補到 40 件 | 長尾字開始有曝光 |
| M3 | 髮型誌 #9–#12＋看 GSC 調整＋補 5 個服務單頁的 FAQ | 服務字進前 20 |

---

## 9. 引用來源

- [Google 商家檔案說明｜改善商家在 Google 本地排名的訣竅](https://support.google.com/business/answer/7091?hl=zh-Hant)
- [SHOPLINE｜優化 Google 在地商家搜尋排名的 SEO 技巧](https://stories.shopline.tw/local-seo-strategy-how-to/)
- [藍眼科技｜美髮產業的搜尋排名優化行銷策略](https://seo.ojos.cc/strategy_hair_salon.php)
- [電子豹｜Google 商家 7 步設定與 SEO 優化](https://blog.newsleopard.com/google-business-profile/)
- [NSS｜美髮沙龍網路行銷 2026 Google 商家與社群經營攻略](https://www.nss.com.tw/hair-salon-online-marketing)
