/**
 * 留白髮所 MARGIN — 內容與領域邏輯。
 * 資料與文案逐字取自 Claude Design 專案的 `Works Page Hi-Fi.dc.html`，
 * 沒有自己改寫。影像仍是灰底佔位（設計系統 readme：暫代素材）。
 */

export type ServiceId = 'color' | 'cut' | 'perm' | 'care'
export type CategoryId = 'cut' | 'color' | 'perm' | 'care' | 'scalp'
export type StylistId = 'yuki' | 'amber' | 'ken' | 'leo'
export type SortId = 'new' | 'old'

export interface Option<T extends string> {
  value: T
  label: string
}

export const SERVICES: Option<ServiceId>[] = [
  { value: 'color', label: '染髮' },
  { value: 'cut', label: '剪髮' },
  { value: 'perm', label: '燙髮' },
  { value: 'care', label: '護髮' },
]

export const SORTS: Option<SortId>[] = [
  { value: 'new', label: '最新上架' },
  { value: 'old', label: '最早上架' },
]

export interface Stylist {
  value: StylistId
  label: string
  role: string
  short: string
  days: string
  pick: string
  tags: string[]
  t1: string
  t2: string
  bio1: string
  bio2: string
  hours: string
  /** public/img 檔名（不含副檔名）。列表卡片與個人頁 Hero 共用同一張個人照。 */
  photo: string
  /** [日, 星期, 該日開放時段] */
  avail: [number, string, string[]][]
}

export const STYLISTS: Stylist[] = [
  {
    value: 'yuki',
    label: '林宜家 Yuki',
    role: 'SENIOR STYLIST ・ 12 YEARS',
    short: 'SENIOR',
    days: 'TUE–SUN',
    pick: '韓系燙髮 ・ 霧感染髮',
    tags: ['韓系燙髮', '霧感染髮', '短髮設計'],
    t1: '剪短一點',
    t2: '也要好整理',
    bio1: '諮詢時我會先問你早上有幾分鐘，再決定要剪掉多少。髮型撐不起來，通常不是你的問題。',
    bio2: '擅長韓系燙髮與霧感染髮，也接受大幅度改變的討論——但我會先說清楚要分幾次做。',
    hours: '週一公休，最後一個時段 18:00。同時段只服務一位客人。',
    photo: 'stylist_yuki',
    avail: [
      [10, 'THU', ['11:00', '14:00', '18:00']],
      [11, 'FRI', ['13:00', '16:00']],
      [12, 'SAT', []],
      [13, 'SUN', ['11:00', '15:00', '17:00']],
    ],
  },
  {
    value: 'amber',
    label: '陳彥安 Amber',
    role: 'SENIOR STYLIST ・ 8 YEARS',
    short: 'SENIOR',
    days: 'WED–MON',
    pick: '漂髮 ・ 特殊色',
    tags: ['長髮層次', '冷色調染髮', '結構護髮'],
    t1: '不剪短',
    t2: '也能換一個人',
    bio1: '我做染髮比較多。長髮的人最常問的是「不剪短可以嗎」，多數時候可以。',
    bio2: '補染我只動長出來的那一段，髮尾不重複上藥劑；顏色會慢一點到位，但髮況留得住。',
    hours: '週二公休，漂髮類最後受理 15:00，因為要留足夠時間。',
    photo: 'stylist_an',
    avail: [
      [10, 'THU', ['12:00', '15:30']],
      [11, 'FRI', []],
      [12, 'SAT', ['11:00', '14:00', '17:00']],
      [13, 'SUN', ['13:00']],
    ],
  },
  {
    value: 'ken',
    label: '王柏睿 Ken',
    role: 'STYLIST ・ 6 YEARS',
    short: 'STYLIST',
    days: 'TUE–SAT',
    pick: '男士剪髮 ・ 頭皮養護',
    tags: ['男士剪髮', '短髮設計', '頭皮護理'],
    t1: '短髮差一公分',
    t2: '就是另一個人',
    bio1: '短髮差一公分就是另一個人，所以我剪得慢，會停下來給你看。',
    bio2: '髮量多、髮流亂的頭我接得最多。三週後想修一下，回來免費調整。',
    hours: '週日、週一公休。剪髮不預約也可以，但要等現場的空檔。',
    photo: 'stylist_ray',
    avail: [
      [10, 'THU', ['11:00', '13:00', '16:00']],
      [11, 'FRI', ['11:30']],
      [12, 'SAT', ['14:00', '18:00']],
      [13, 'SUN', []],
    ],
  },
  {
    value: 'leo',
    label: '李思妤 Leo',
    role: 'JUNIOR STYLIST ・ 3 YEARS',
    short: 'STYLIST',
    days: 'THU–MON',
    pick: '日系剪髮 ・ 髮質重建',
    tags: ['結構護髮', '頭皮調理', '基礎剪髮'],
    t1: '先做小片測試',
    t2: '再決定要不要',
    bio1: '我還在累積作品，價格也比較低。你想試的顏色我會先做小片測試。',
    bio2: '依受損程度調配，不做無效療程；判斷不了的時候我會請資深設計師一起看。',
    hours: '週二、週三公休。護髮類我可以排在晚班，下班後也來得及。',
    photo: 'stylist_shu',
    avail: [
      [10, 'THU', ['11:00', '12:00', '19:00']],
      [11, 'FRI', ['16:00', '19:00']],
      [12, 'SAT', ['11:00']],
      [13, 'SUN', ['13:00', '17:00']],
    ],
  },
]

export interface Work {
  code: string
  title: string
  service: ServiceId
  stylist: StylistId
  length: string
  note: string
  /** public/img 的作品檔名前綴，`_front` / `_back` / `_thumb` 由頁面自己接 */
  img: string
}

export const WORKS: Work[] = [
  { code: 'W-128', title: '霧感灰棕', service: 'color', stylist: 'yuki', length: '中長髮', note: '退到 9 度再上灰棕，透明感為主，不追求一次到位。', img: 'works_002' },
  { code: 'W-127', title: '霧灰亞麻', service: 'color', stylist: 'amber', length: '長髮', note: '第二次補染，只調整根部三公分，髮尾不再上藥劑。', img: 'works_001' },
  { code: 'W-126', title: '淺棕漸層', service: 'color', stylist: 'yuki', length: '長髮', note: '從中段開始退，根部留原色，長出來時比較好接。', img: 'works_005' },
  { code: 'W-125', title: '深棕加深', service: 'color', stylist: 'leo', length: '中長髮', note: '客人要能上班的顏色，室內看是深棕，陽光下才看得出紅。', img: 'works_003' },
  { code: 'W-124', title: '冷茶棕', service: 'color', stylist: 'amber', length: '中長髮', note: '染後兩週回店做結構護髮，顏色掉得比較慢。', img: 'works_004' },
  { code: 'W-123', title: '灰藍打底', service: 'color', stylist: 'yuki', length: '短髮', note: '打底做兩次，中間隔一週，頭皮沒有不適才繼續。', img: 'works_006' },
  { code: 'W-122', title: '剪短一點', service: 'cut', stylist: 'yuki', length: '短髮', note: '髮流偏右，左側留長 1.5 公分平衡，吹整只要抓兩下。', img: 'works_011' },
  { code: 'W-121', title: '耳下三公分', service: 'cut', stylist: 'ken', length: '短髮', note: '髮量多，內層打薄兩層，外層保留重量線。', img: 'works_014' },
  { code: 'W-120', title: '層次長髮', service: 'cut', stylist: 'amber', length: '長髮', note: '長度一公分都不減，只重整層次與臉側線條。', img: 'works_015' },
  { code: 'W-119', title: '水波紋燙', service: 'perm', stylist: 'amber', length: '長髮', note: '髮況只撐得住中卷，捲度做小一號，三個月後再加強。', img: 'works_010' },
  { code: 'W-118', title: '空氣感微捲', service: 'perm', stylist: 'yuki', length: '中長髮', note: '只燙外圈，內層不動，隔天洗完頭也還在。', img: 'works_007' },
  { code: 'W-117', title: '結構護髮', service: 'care', stylist: 'ken', length: '長髮', note: '依受損程度調配，不做無效療程；這次只做中段到髮尾。', img: 'works_008' },
  { code: 'W-116', title: '頭皮調理', service: 'care', stylist: 'leo', length: '中長髮', note: '夏天出油，先處理頭皮再談髮尾；一個月一次就夠。', img: 'works_017' },
  { code: 'W-115', title: '韓系燙髮', service: 'perm', stylist: 'ken', length: '中長髮', note: '捲度只做臉側兩段，其餘留直，長出來不會斷層。', img: 'works_009' },
]

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'cut', label: '剪髮' },
  { id: 'color', label: '染髮' },
  { id: 'perm', label: '燙髮' },
  { id: 'care', label: '護髮' },
  { id: 'scalp', label: '頭皮養護' },
]

/** 服務類別對應的方形素材（服務卡片、首頁價目導引共用） */
export const CATEGORY_IMG: Record<CategoryId, string> = {
  cut: 'service_cut',
  color: 'service_color',
  perm: 'service_perm',
  care: 'service_treatment',
  scalp: 'service_scalp',
}

export interface MenuItem {
  id: string
  cat: CategoryId
  name: string
  note: string
  minutes: number
  price: number
}

export const MENU: MenuItem[] = [
  { id: 'cut1', cat: 'cut', name: '設計師剪髮', note: '含諮詢、洗髮、剪、吹整', minutes: 60, price: 1200 },
  { id: 'cut2', cat: 'cut', name: '資深設計師剪髮', note: '含諮詢、洗髮、剪、吹整', minutes: 60, price: 1500 },
  { id: 'cut3', cat: 'cut', name: '瀏海修剪', note: '本店客人免費', minutes: 10, price: 0 },
  { id: 'color1', cat: 'color', name: '透明感染髮', note: '單色補染，長髮加價到店確認', minutes: 150, price: 3800 },
  { id: 'color2', cat: 'color', name: '漂髮＋特殊色', note: '需先評估受損程度，可能分兩次進行', minutes: 240, price: 4200 },
  { id: 'perm1', cat: 'perm', name: '韓系燙髮', note: '捲度依髮況調整，撐不住就先不做', minutes: 180, price: 3200 },
  { id: 'perm2', cat: 'perm', name: '水波紋燙', note: '含燙後護髮一次', minutes: 180, price: 3600 },
  { id: 'care1', cat: 'care', name: '結構護髮', note: '依受損程度調配，不做無效療程', minutes: 90, price: 1800 },
  { id: 'scalp1', cat: 'scalp', name: '頭皮調理', note: '出油、發癢先處理頭皮再談髮尾', minutes: 60, price: 1600 },
]

export const SLOT_TIMES = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
export const FULL_TIMES = ['12:00', '15:00']
export const CLOSED_DAYS = [7, 14, 21, 28]
export const NO_ROOM_DAY = 12
export const STEPS = ['STYLIST', 'SERVICE', 'TIME', 'DETAILS', 'CONFIRM']
export const WEEKDAY = ['一', '二', '三', '四', '五', '六', '日']
export const PAGE_SIZE = 6

export const NAV_ITEMS = [
  { id: 'home', label: 'HOME', to: '/' },
  { id: 'about', label: 'ABOUT', to: '/about' },
  { id: 'service', label: 'SERVICE', to: '/services' },
  { id: 'works', label: 'WORKS', to: '/works' },
  { id: 'stylists', label: 'STYLISTS', to: '/stylists' },
  { id: 'store', label: 'STORE', to: '/store' },
  { id: 'booking', label: 'BOOKING', to: '/booking' },
]

export const FOOTER_LINKS = [
  { label: 'IG', href: 'https://instagram.com/' },
  { label: 'FB', href: 'https://facebook.com/' },
  { label: 'KAOHSIUNG' },
]

/* ---- 首頁 ---- */

/** 首頁價目導引只挑四個代表項目，點進去是完整價目頁。 */
export const HOME_PRICE_IDS = ['cut1', 'color1', 'perm1', 'care1']

export const HOME_WORK_COUNT = 3

/* ---- 關於我們 ---- */

export const ABOUT_PRINCIPLES = [
  {
    n: '1',
    title: '一次只留給一個人',
    body: '同時段不排第二位客人。設計師在服務你的時候，不會被別人的訊息打斷，也不會中途離開去沖水。',
  },
  {
    n: '2',
    title: '先講做不到的部分',
    body: '帶來的照片我們會拆開來看：哪一段你的髮況現在做得到，哪一段要分兩次。做不起來的，我們會直接說不做。',
  },
  {
    n: '3',
    title: '剪完你要整理得動',
    body: '決定長度之前，我們會先問你早上有幾分鐘。撐三十分鐘才成立的髮型，我們不剪。',
  },
]

export const ABOUT_SPACE = [
  { caption: '入口與等候區，只有兩張椅子', img: 'space_lounge' },
  { caption: '洗髮區在最裡面，隔一道牆', img: 'space_detail' },
  { caption: '工具與藥劑，每天結束後歸零', img: 'space_cutting' },
]

/* ---- 服務與價目 ---- */

const CATEGORY_LATIN: Record<CategoryId, string> = {
  cut: 'CUT',
  color: 'COLOR',
  perm: 'PERM',
  care: 'TREATMENT',
  scalp: 'SCALP',
}

const CATEGORY_NOTE: Record<CategoryId, string> = {
  cut: '含諮詢、洗髮、剪、吹整。三週內想修一下，回來免費調整。',
  color: '補染只動長出來的那一段，髮尾不重複上藥劑。透明感為主，不追求一次到位。',
  perm: '捲度依髮況調整。撐不住的捲度我們會做小一號，三個月後再加強。',
  care: '依受損程度調配，不做無效療程。',
  scalp: '出油、發癢先處理頭皮，再談髮尾。',
}

export interface ServiceGroup {
  id: CategoryId
  label: string
  latin: string
  note: string
  rows: {
    name: string
    note: string
    duration: string
    /** 0 元的項目寫「免費」，不寫 NT$0 */
    price: string
    first: boolean
    last: boolean
  }[]
}

export const SERVICE_GROUPS: ServiceGroup[] = CATEGORIES.map(c => {
  const items = MENU.filter(m => m.cat === c.id)
  return {
    id: c.id,
    label: c.label,
    latin: CATEGORY_LATIN[c.id],
    note: CATEGORY_NOTE[c.id],
    rows: items.map((m, i) => ({
      name: m.name,
      note: m.note,
      duration: m.minutes + ' 分',
      price: m.price ? money(m.price) : '免費',
      first: i === 0,
      last: i === items.length - 1,
    })),
  }
})

export const SERVICE_NOTES = [
  { k: '長髮加價', v: '肩下加 300，胸下加 600。到店諮詢時會先確認，不會做完才說。' },
  { k: '遲到', v: '遲到超過 15 分鐘，當天可能只做得完一部分。先傳個訊息說一聲，我們會幫你調整內容。' },
  { k: '取消', v: '前一天以前都可以在預約確認信裡取消。當天取消我們不收費，但下次預約會請你提前確認。' },
  { k: '付款', v: '現金、轉帳、行動支付。不推銷課程與套卡。' },
]

/* ---- 店家資訊 ---- */

export const STORE_ROWS = [
  { k: 'ADDRESS', v: '高雄市鹽埕區五福四路 122 巷 3 號' },
  { k: 'HOURS', v: '11:00 – 20:00（最後一個時段 18:00）' },
  { k: 'CLOSED', v: '週一公休，設計師另有個人休假日' },
  { k: 'BOOKING', v: '線上預約，或私訊 IG；我們不接電話預約' },
  { k: 'CONTACT', v: 'IG ＠marginhair ・ FB 留白髮所 MARGIN' },
]

/** 地圖用的地址，與 STORE_ROWS 的 ADDRESS 同一個地點 */
export const STORE_MAP_QUERY = '高雄市鹽埕區五福四路122巷3號'

/**
 * Google Maps 嵌入網址。`output=embed` 這條不用 API key，
 * 之後換成自己的靜態地圖圖片時，直接把 store.vue 的 iframe 換回 MgImage 即可。
 */
export const STORE_MAP_SRC
  = `https://maps.google.com/maps?q=${encodeURIComponent(STORE_MAP_QUERY)}&z=17&hl=zh-TW&output=embed`

export const STORE_TIPS = [
  { k: 'MRT', v: '橘線鹽埕埔站 2 號出口，沿五福四路往西走約 4 分鐘，看到轉角老藥局左轉。' },
  { k: 'PARKING', v: '巷口有兩個路邊格，通常滿。大勇路平面停車場走過來 3 分鐘，我們可折抵一小時。' },
  { k: 'ARRIVING', v: '門口沒有招牌，白色鐵門上只有 3 號。提早到可以直接進來坐，水在櫃檯旁邊。' },
]

/* ---- helpers, ported from the hi-fi component logic ---- */

export function money(n: number) {
  return 'NT$' + n.toLocaleString('en-US')
}

export function findStylist(value: string | undefined) {
  return STYLISTS.find(x => x.value === value)
}

export function stylistLatin(value: string | undefined) {
  return findStylist(value)?.label.split(' ')[1] ?? ''
}

export function stylistZh(value: string | undefined) {
  return findStylist(value)?.label.split(' ')[0] ?? ''
}

export function serviceLabel(value: string | undefined) {
  return SERVICES.find(o => o.value === value)?.label ?? ''
}

export function workMeta(w: Work) {
  return `${serviceLabel(w.service)} ・ ${findStylist(w.stylist)?.label} ・ ${w.length}`
}

export function hoursText(minutes: number) {
  if (!minutes) return ''
  return '約 ' + Math.round((minutes / 60) * 10) / 10 + ' 小時'
}

/** 高擬真稿的日期字串：9／10（四） */
export function dateText(day: number, sep = '／') {
  return '9' + sep + day + '（' + WEEKDAY[(day + 1) % 7] + '）'
}

export function phoneBad(phone: string) {
  return !/^09\d{8}$/.test(phone.replace(/[\s-]/g, ''))
}

/** 作品單頁的規格列，時長與價格依服務類別給起價 */
export function workSpecs(w: Work) {
  return [
    { k: 'SERVICE', v: serviceLabel(w.service) },
    { k: 'STYLIST', v: findStylist(w.stylist)?.label ?? '' },
    { k: 'LENGTH', v: w.length },
    { k: 'DURATION', v: w.service === 'cut' ? '60 分鐘' : w.service === 'care' ? '90 分鐘' : '150 分鐘' },
    { k: 'PRICE', v: w.service === 'cut' ? '1,200 起' : w.service === 'care' ? '1,800 起' : '3,800 起' },
  ]
}
