/**
 * SEO 設定 — 依 docs/04-SEO.md v2.1。
 *
 * 文件裡的 title／description 是照「文件版網站」寫的，有幾處與站上實際不符，
 * 這裡以**站上實際有的內容**為準，差異都寫在各段註解裡。
 * description 承諾了頁面上沒有的東西，比沒有 description 更傷。
 */
import { BRAND, MENU, money, type CategoryId } from './margin'

export const SITE_URL = 'https://marginhair.com.tw'

/** 04-SEO 寫的是 /og/og_default.jpg，實際檔案在 /img/ 底下 */
export const OG_IMAGE = `${SITE_URL}/img/og_default.jpg`
export const OG_IMAGE_ALT = '留白髮所 MARGIN 的店內空間'

export interface PageSeo {
  title: string
  description: string
  noindex?: boolean
}

/** 類別最低價，給 description 與 schema 用；0 元的瀏海修剪不計入 */
export function categoryFrom(cat: CategoryId) {
  const prices = MENU.filter(m => m.cat === cat && m.price > 0).map(m => m.price)
  return Math.min(...prices)
}

const ALL_PRICES = MENU.filter(m => m.price > 0).map(m => m.price)
export const PRICE_MIN = Math.min(...ALL_PRICES)
export const PRICE_MAX = Math.max(...ALL_PRICES)

/**
 * 靜態頁的 meta。動態頁（作品單頁、設計師個人頁）在各自的 .vue 裡組。
 * Title ≤ 30 全形字、Description 80–110 全形字，規範見 04-SEO §2。
 */
export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: '苓雅美髮沙龍｜留白髮所 MARGIN・三多商圈預約制',
    description:
      '高雄三多商圈的預約制美髮沙龍，一位設計師同時段只服務一位客人。價格全公開、不推銷、不辦卡。捷運三多商圈站步行 5 分鐘，線上預約 30 秒完成。',
  },
  // 品牌故事「店名的由來」2026-09-06 已上站，description 改回 04-SEO 原本的版本。
  '/about': {
    title: '關於留白髮所｜高雄苓雅預約制沙龍・不推銷不辦卡',
    description:
      '排版裡的 margin 是留白，看起來什麼都沒有，卻決定主體好不好看。我們同時段只服務一位客人，沒有會員卡、沒有儲值、設計師無銷售抽成。',
  },
  // 04-SEO 的價格（染 3000／燙 3500／護 1200／頭皮 1500）是文件版價目表的數字，
  // 與站上的 MENU 對不上。改成從 MENU 算，之後改價目不會再漏改這裡。
  '/services': {
    title: '服務與價目｜高雄剪髮 1200 起・染燙價格全公開｜MARGIN',
    description:
      `剪髮 ${money(categoryFrom('cut'))} 起、染髮 ${money(categoryFrom('color'))} 起、`
      + `燙髮 ${money(categoryFrom('perm'))} 起、護髮 ${money(categoryFrom('care'))} 起、`
      + `頭皮養護 ${money(categoryFrom('scalp'))} 起。長髮加價、遲到、取消與付款規則全部寫明，不會做完才說。`,
  },
  // 站上只有服務項目與設計師兩個篩選軸，沒有髮長與髮色系，也還沒有色號欄位，
  // 所以不寫「標註使用色號」。
  '/works': {
    title: '作品集｜韓系燙・透明感染髮案例｜留白髮所 MARGIN',
    description:
      '每一張都是實際施作的紀錄，沒有修過髮色，你看到的就是離店那天的樣子。可依服務項目與設計師篩選，每件作品都寫清楚做了什麼。',
  },
  '/stylists': {
    title: '設計師｜找到適合你的那一位｜留白髮所 MARGIN',
    description:
      '總監 1 位、資深設計師 1 位、設計師 2 位。每個人擅長的方向不一樣，選人比選店重要。四個人的作品與最近的空檔都看得到，可直接指名預約。',
  },
  '/store': {
    title: '門市資訊｜高雄苓雅文橫二路・三多商圈站 5 分鐘｜MARGIN',
    description:
      '高雄市苓雅區文橫二路 88 號 2 樓，一樓是咖啡店。捷運三多商圈站 2 號出口步行 5 分鐘，附停車與機車停放說明。週二至週日 11:00–20:00。',
  },
  // D-01 是不放 LINE，不是反覆聲明沒放，所以 description 不提。
  '/booking': {
    title: '線上預約｜留白髮所 MARGIN・高雄三多商圈',
    description:
      '五個步驟約 30 秒完成：選設計師、選服務、選時段、填資料、確認。同時段只服務一位客人，時段確認後就是你的，不會被併客。',
  },
  '/booking/done': {
    title: '預約完成｜留白髮所 MARGIN',
    description: '預約已送出，我們會在營業時間內以簡訊回覆確認。',
    noindex: true,
  },
}

/**
 * HairSalon 結構化資料（04-SEO §4.1）。只放在首頁。
 *
 * 與文件的兩處差異：
 * 1. `logo` 拿掉 — 站上還沒有 logo 檔，指向 404 比不放更糟。
 * 2. 週一公休不用 `specialOpeningHoursSpecification`（文件寫 opens/closes 都 00:00）。
 *    Google 判讀公休的方式是「不出現在 openingHoursSpecification 裡」，多寫反而有歧義。
 */
export function hairSalonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${SITE_URL}/#salon`,
    'name': `${BRAND.nameZh} ${BRAND.nameEn}`,
    'alternateName': BRAND.nameEn,
    'url': `${SITE_URL}/`,
    'image': OG_IMAGE,
    'description':
      '高雄三多商圈的預約制美髮沙龍，一位設計師同時段只服務一位客人。價格全公開，不推銷、不辦卡。',
    'slogan': BRAND.slogan.join('，'),
    'telephone': '+886-7-338-0088',
    'priceRange': `NT$${PRICE_MIN.toLocaleString('en-US')}-${PRICE_MAX.toLocaleString('en-US')}`,
    'currenciesAccepted': 'TWD',
    // 與 /services 的付款規則和 FAQ 一致：沒有信用卡
    'paymentAccepted': 'Cash, Bank Transfer, Mobile Payment',
    'publicAccess': false,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '文橫二路 88 號 2 樓',
      'addressLocality': BRAND.district,
      'addressRegion': '高雄市',
      'postalCode': '802',
      'addressCountry': 'TW',
    },
    'geo': { '@type': 'GeoCoordinates', 'latitude': 22.6118, 'longitude': 120.305 },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '11:00',
        'closes': '20:00',
      },
    ],
    'potentialAction': {
      '@type': 'ReserveAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_URL}/booking`,
        'actionPlatform': [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      'result': { '@type': 'Reservation', 'name': '美髮預約' },
    },
    'sameAs': [BRAND.igHref],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': '服務項目',
      'itemListElement': (
        [
          ['剪髮', 'cut'],
          ['染髮', 'color'],
          ['燙髮', 'perm'],
          ['護髮', 'care'],
          ['頭皮養護', 'scalp'],
        ] as [string, CategoryId][]
      ).map(([name, cat]) => ({
        '@type': 'Offer',
        'itemOffered': { '@type': 'Service', 'name': name },
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'minPrice': categoryFrom(cat),
          'priceCurrency': 'TWD',
        },
      })),
    },
  }
}
