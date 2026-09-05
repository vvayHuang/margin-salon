/**
 * 留白髮所 MARGIN — 內容與領域邏輯。
 * 版面與語氣沿用 Claude Design 專案的 `Works Page Hi-Fi.dc.html`，
 * 但**品牌事實以 PRD v1.3.1 為準**：店址、商圈、電話、營業時間、社群、
 * 四位設計師的姓名／職級／年資／擅長項目，都對回 PRD §1.1–1.2 與全站文案 §8。
 * 高擬真稿自己換過一套設定（鹽埕／五福四路／Amber・Ken・Leo），已不再使用。
 */

export type ServiceId = 'color' | 'cut' | 'perm' | 'care'
export type CategoryId = 'cut' | 'color' | 'perm' | 'care' | 'scalp'
export type StylistId = 'shu' | 'yuki' | 'ray' | 'an'
export type SortId = 'new' | 'old'

export interface Option<T extends string> {
  value: T
  label: string
}

/**
 * 品牌基本資料 — 唯一來源是 PRD v1.3.1 §1.1（品牌識別）與 §1.2（營運基本資料）。
 * 這一區的值不要在頁面裡各寫一份，改的時候只能改這裡。
 */
export const BRAND = {
  nameZh: '留白髮所',
  nameEn: 'MARGIN Hair Studio',
  /** 主 Slogan，首頁 Hero 的兩行大標 */
  slogan: ['剪去多餘', '留下你'],
  /** Hero 副標，PRD §1.1 */
  tagline: '一次只留給一個人的預約制沙龍',
  address: '高雄市苓雅區文橫二路 88 號 2 樓',
  district: '苓雅區',
  area: '三多商圈',
  phone: '07-338-0088',
  /** 07 的區碼在國際格式要去掉開頭的 0 */
  phoneHref: 'tel:+88673380088',
  ig: '＠margin.hair',
  igHref: 'https://www.instagram.com/margin.hair/',
} as const

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
  /** 中文職級，PRD §13.3 的三選一：總監／資深設計師／設計師 */
  roleZh: string
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
  /**
   * 指名這位設計師的顧客評價，逐字取自全站文案 §8，一人 3 則。
   * D-04 把首頁的評價區塊移到設計師頁，理由是「評價綁人比綁店有說服力」。
   */
  reviews: string[]
  /** 個人頁的 meta description，逐字取自 docs/04-SEO.md §2 */
  seoDesc: string
  /** [日, 星期, 該日開放時段] */
  avail: [number, string, string[]][]
}

export const STYLISTS: Stylist[] = [
  {
    value: 'shu',
    label: '周敘 Shu',
    role: 'DIRECTOR ・ 15 YEARS',
    roleZh: '總監',
    short: 'DIRECTOR',
    days: 'TUE–SUN',
    pick: '韓系層次燙 ・ 剪髮結構',
    tags: ['韓系層次燙', '剪髮結構', '髮質重建'],
    t1: '先看髮流往哪邊倒',
    t2: '再決定剪不剪短',
    bio1: '我做頭髮十五年，前七年在台北，後八年在高雄。早期我很喜歡剪很有設計感的髮型，客人在店裡看起來很好，回家兩週就變形。',
    bio2: '現在我剪之前一定會問四件事：早上有多少時間、會不會用吹風機、上班能不能綁起來、多久能來一次。答案會直接決定層次要放在哪裡。',
    hours: '週一公休，最後一個時段 18:00。同時段只服務一位客人。',
    reviews: [
      '第一次遇到會先問我早上幾點起床的設計師。',
      '剪完一個月還是好整理，這是我第一次遇到。',
      '他說我這個髮質做不了那個顏色，直接叫我別做。',
    ],
    seoDesc: '年資 15 年，擅長韓系層次燙、剪髮結構與髮質重建。剪之前一定會問你早上有多少時間、會不會吹頭髮。高雄苓雅，可線上指名預約。',
    photo: 'stylist_shu',
    avail: [
      [10, 'THU', ['11:00', '14:00', '18:00']],
      [11, 'FRI', ['13:00', '16:00']],
      [12, 'SAT', []],
      [13, 'SUN', ['11:00', '15:00', '17:00']],
    ],
  },
  {
    value: 'yuki',
    label: '林宜家 Yuki',
    role: 'SENIOR STYLIST ・ 9 YEARS',
    roleZh: '資深設計師',
    short: 'SENIOR',
    days: 'TUE–SUN',
    pick: '透明感染髮 ・ 灰霧色系',
    tags: ['透明感染髮', '灰霧色系', '褪色設計'],
    t1: '顏色是養出來的',
    t2: '不是一次染出來的',
    bio1: '我專門做低彩度的顏色。透明感最難的地方不是染上去，是褪色之後還好不好看。很多人染完第一週很滿意，第三週開始變黃。',
    bio2: '所以我配色的時候，會把褪色後的樣子一起算進去。你會看到我的作品很多偏灰，那是為了讓它黃掉的速度慢一點。',
    hours: '週一公休。需要漂兩次以上的顏色，我會建議分成兩個月做。',
    reviews: [
      '褪色後居然還是好看的，這是我第一次。',
      '她直接跟我說這個顏色我做不起來，省了我三千。',
      '灰色調做得很乾淨，沒有那種霧霧的髒感。',
    ],
    seoDesc: '年資 9 年，專做低彩度顏色。配色時把褪色後的樣子一起算進去，所以作品偏灰。高雄苓雅三多商圈，可線上指名預約。',
    photo: 'stylist_yuki',
    avail: [
      [10, 'THU', ['12:00', '15:30']],
      [11, 'FRI', []],
      [12, 'SAT', ['11:00', '14:00', '17:00']],
      [13, 'SUN', ['13:00']],
    ],
  },
  {
    value: 'ray',
    label: '陳柏睿 Ray',
    role: 'STYLIST ・ 6 YEARS',
    roleZh: '設計師',
    short: 'STYLIST',
    days: 'TUE–SAT',
    pick: '短髮修剪 ・ 男士造型',
    tags: ['短髮修剪', '男士造型', '瀏海設計'],
    t1: '男生剪髮不是剪短',
    t2: '是剪對比例',
    bio1: '我大部分的客人是男生，還有想剪短的女生。短髮很難的地方在於沒有地方藏，每一刀的位置都會直接被看到。',
    bio2: '我剪之前會先看三個東西：髮旋在哪、後腦勺凸不凸、耳朵位置高不高。戴安全帽的人請一定要跟我說，壓塌的位置我會另外處理。',
    hours: '週日、週一公休。三週後想修一下，回來免費調整。',
    reviews: [
      '終於有人問我戴不戴安全帽。',
      '剪完自己在家抓也抓得起來。',
      '我後腦勺很扁，他調了側邊比例整個看起來不一樣。',
    ],
    seoDesc: '年資 6 年，擅長短髮修剪、男士造型與瀏海設計。會先看髮旋、後腦勺與耳朵位置，戴安全帽的人請務必告知。',
    photo: 'stylist_ray',
    avail: [
      [10, 'THU', ['11:00', '13:00', '16:00']],
      [11, 'FRI', ['11:30']],
      [12, 'SAT', ['14:00', '18:00']],
      [13, 'SUN', []],
    ],
  },
  {
    value: 'an',
    label: '黃安 An',
    role: 'STYLIST ・ 5 YEARS',
    roleZh: '設計師',
    short: 'STYLIST',
    days: 'TUE–SUN',
    pick: '頭皮養護 ・ 護髮',
    tags: ['頭皮養護', '敏感頭皮', '護髮'],
    t1: '頭髮的問題',
    t2: '有一半不在頭髮上',
    bio1: '我主要做頭皮跟護髮。很多人是因為掉髮或出油來的，但真正的原因常常是洗頭方式、作息或壓力。',
    bio2: '我會先用放大鏡看毛孔，螢幕會轉給你一起看，不是我說了算。護髮我不會預設你需要最貴的那個，只是乾的話基礎護髮就夠了。',
    hours: '週一公休。頭皮養護單次 40–60 分鐘，做完當天不建議染燙。',
    reviews: [
      '他說我只需要最便宜的那個護髮，我還愣住。',
      '產後掉髮做了三次，明顯有差。',
      '頭皮很敏感，做完沒有刺痛感。',
    ],
    seoDesc: '年資 5 年，主做頭皮與護髮。用放大鏡看毛孔並把螢幕轉給你一起看，不會因為你坐下就開始加項目。',
    photo: 'stylist_an',
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
  /**
   * 需不需要漂髮。文案 §6 把它列為必填：「這是顧客最在意的成本與傷害資訊」。
   * 值依各件的 note 判讀——note 講「退到 N 度」「打底」「從中段開始退」的就是要漂。
   */
  bleach: boolean
  /** 使用色號，只有染髮作品有。格式為「色度/色調」，例：10/81 ＋ 護色 */
  colorCode?: string
  /** public/img 的作品檔名前綴，`_front` / `_back` / `_thumb` 由頁面自己接 */
  img: string
}

export const WORKS: Work[] = [
  { code: 'W-128', title: '霧感灰棕', service: 'color', stylist: 'yuki', length: '中長髮', note: '退到 9 度再上灰棕，透明感為主，不追求一次到位。', bleach: true, colorCode: '9/81 ＋ 護色', img: 'works_002' },
  { code: 'W-127', title: '霧灰亞麻', service: 'color', stylist: 'yuki', length: '長髮', note: '第二次補染，只調整根部三公分，髮尾不再上藥劑。', bleach: true, colorCode: '10/11 ＋ 護色', img: 'works_001' },
  { code: 'W-126', title: '淺棕漸層', service: 'color', stylist: 'yuki', length: '長髮', note: '從中段開始退，根部留原色，長出來時比較好接。', bleach: true, colorCode: '8/73 漸層', img: 'works_005' },
  { code: 'W-125', title: '深棕加深', service: 'color', stylist: 'yuki', length: '中長髮', note: '客人要能上班的顏色，室內看是深棕，陽光下才看得出紅。', bleach: false, colorCode: '5/56', img: 'works_003' },
  { code: 'W-124', title: '冷茶棕', service: 'color', stylist: 'yuki', length: '中長髮', note: '染後兩週回店做結構護髮，顏色掉得比較慢。', bleach: false, colorCode: '6/71', img: 'works_004' },
  { code: 'W-123', title: '灰藍打底', service: 'color', stylist: 'yuki', length: '短髮', note: '打底做兩次，中間隔一週，頭皮沒有不適才繼續。', bleach: true, colorCode: '9/8 ＋ 藍調 /88', img: 'works_006' },
  { code: 'W-122', title: '剪短一點', service: 'cut', stylist: 'ray', length: '短髮', note: '髮旋偏右，左側留長 1.5 公分平衡，吹整只要抓兩下。', bleach: false, img: 'works_011' },
  { code: 'W-121', title: '耳下三公分', service: 'cut', stylist: 'ray', length: '短髮', note: '髮量多，內層打薄兩層，外層保留重量線。', bleach: false, img: 'works_014' },
  { code: 'W-120', title: '層次長髮', service: 'cut', stylist: 'shu', length: '長髮', note: '長度一公分都不減，只重整層次與臉側線條。', bleach: false, img: 'works_015' },
  { code: 'W-119', title: '水波紋燙', service: 'perm', stylist: 'shu', length: '長髮', note: '髮況只撐得住中卷，捲度做小一號，三個月後再加強。', bleach: false, img: 'works_010' },
  { code: 'W-118', title: '空氣感微捲', service: 'perm', stylist: 'shu', length: '中長髮', note: '只燙外圈，內層不動，隔天洗完頭也還在。', bleach: false, img: 'works_007' },
  { code: 'W-117', title: '結構護髮', service: 'care', stylist: 'an', length: '長髮', note: '依受損程度調配，不做無效療程；這次只做中段到髮尾。', bleach: false, img: 'works_008' },
  { code: 'W-116', title: '頭皮調理', service: 'care', stylist: 'an', length: '中長髮', note: '夏天出油，先處理頭皮再談髮尾；一個月一次就夠。', bleach: false, img: 'works_017' },
  { code: 'W-115', title: '韓系燙髮', service: 'perm', stylist: 'shu', length: '中長髮', note: '捲度只做臉側兩段，其餘留直，長出來不會斷層。', bleach: false, img: 'works_009' },
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
  { id: 'cut4', cat: 'cut', name: '總監剪髮', note: '同上，含髮流與骨架分析', minutes: 70, price: 1800 },
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
  { label: 'IG', href: BRAND.igHref },
  { label: 'KAOHSIUNG' },
]

/**
 * 頁尾的兩條站內連結。D-09 把頁尾收成單列，但 /careers 與 /privacy
 * 不放在這裡就沒有任何入口——孤島頁比頁尾多兩個文字連結糟得多。
 * 見 D-09 的 2026-09-06 補註。
 */
export const FOOTER_NAV = [
  { label: '加入我們', to: '/careers' },
  { label: '隱私權政策', to: '/privacy' },
]

/* ---- 首頁 ---- */

/** 首頁價目導引只挑四個代表項目，點進去是完整價目頁。 */
export const HOME_PRICE_IDS = ['cut1', 'color1', 'perm1', 'care1']

export const HOME_WORK_COUNT = 3

/* ---- 關於我們 ---- */

/**
 * 品牌故事「店名的由來」，逐字取自全站文案 §2 區塊 2（286 字，上限 300）。
 * 這是整個品牌的核心敘事，站上一直沒有落點，SEO description 也因此繞開了它。
 */
export const ABOUT_STORY = [
  '排版裡的 margin 是留白。它看起來什麼都沒有，卻決定了主體好不好看。',
  '頭髮也是一樣的事。很多人剪完頭髮的隔天早上會發現，昨天在店裡的樣子回不來了。那通常不是技術問題，是加了太多東西——太多層次、太多造型品、太多需要每天維持的東西。',
  '所以我們把流程反過來。先問你早上有多少時間、會不會吹頭髮、幾週會來一次、有沒有戴安全帽。然後剪掉不需要的部分。',
  '剩下的，才是你。',
  '我們在苓雅區文橫二路的二樓，同時段只服務一位客人。沒有會員卡、沒有儲值、沒有業績抽成。需要的產品我們會告訴你哪裡買，在我們這裡買不會比較便宜。',
]

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

export const SERVICE_FAQ = [
  {
    q: '一次要多久？',
    a: '剪髮約 1 小時，染燙 2–3 小時，漂髮視髮況可能到 4 小時。預約時會顯示預估時長，我們不會讓你等到超過。',
  },
  {
    q: '可以帶照片嗎？',
    a: '可以，建議帶三張。不用是同一種風格，我們比較在意你不想要什麼，那個判斷通常更準。',
  },
  {
    q: '可以指定設計師嗎？',
    a: '可以。預約第一步就是選設計師，也可以選「不指定」，我們會依你想做的項目安排。',
  },
  {
    q: '有停車位嗎？',
    a: '沒有專屬車位。汽車可停文橫二路旁的收費停車場，走過來約 3 分鐘。機車請停騎樓外白線區，別停在店門正前方。',
  },
  {
    q: '可以刷卡嗎？',
    a: '接受現金、轉帳與行動支付。不推銷課程，也沒有套卡與儲值。',
  },
  {
    q: '染髮會過敏，可以先測試嗎？',
    a: '可以。預約備註欄註明，我們會安排你提前 48 小時到店做貼膚測試，不收費用。',
  },
  {
    q: '男生可以來嗎？',
    a: '可以。剪髮不分性別計價，設計師剪髮 1,200 起。Ray 專門做短髮與男士造型，作品集可以篩他的作品看。',
  },
]

/* ---- 店家資訊 ---- */

export const STORE_ROWS = [
  { k: 'ADDRESS', v: BRAND.address },
  { k: 'HOURS', v: '週二–週日 11:00 – 20:00（最後一個時段 18:00）' },
  { k: 'CLOSED', v: '每週一公休' },
  { k: 'BOOKING', v: '全預約制，不接受現場排隊。線上預約 30 秒完成' },
  { k: 'CONTACT', v: `${BRAND.phone} ・ IG ${BRAND.ig}` },
]

/** 地圖用的地址，與 STORE_ROWS 的 ADDRESS 同一個地點 */
export const STORE_MAP_QUERY = '高雄市苓雅區文橫二路88號'

/**
 * Google Maps 嵌入網址。`output=embed` 這條不用 API key，
 * 之後換成自己的靜態地圖圖片時，直接把 store.vue 的 iframe 換回 MgImage 即可。
 */
export const STORE_MAP_SRC
  = `https://maps.google.com/maps?q=${encodeURIComponent(STORE_MAP_QUERY)}&z=17&hl=zh-TW&output=embed`

export const STORE_TIPS = [
  { k: 'MRT', v: '捷運三多商圈站 2 號出口，沿文橫二路步行 5 分鐘。公車在三多文橫路口站下車，走 1 分鐘。' },
  { k: 'PARKING', v: '沒有專屬車位。汽車停文橫二路旁的收費停車場，走過來 3 分鐘；機車請停騎樓外白線區，別停在店門正前方，那是鄰居的出入口。' },
  { k: 'ARRIVING', v: '我們在二樓，一樓是一家咖啡店。樓梯在店面右手邊，門口有一塊小木牌寫 MARGIN，上樓直接推門進來就好。' },
]

/* ---- helpers, ported from the hi-fi component logic ---- */

export function money(n: number) {
  return 'NT$' + n.toLocaleString('en-US')
}

/** 職級對應的剪髮品項。染燙護四位同價，只有剪髮有職級價差（文案 §3）。 */
export const ROLE_CUT_ITEM: Record<string, string> = {
  總監: 'cut4',
  資深設計師: 'cut2',
  設計師: 'cut1',
}

/** 這位設計師的剪髮價 */
export function stylistCutPrice(s: Stylist) {
  const id = ROLE_CUT_ITEM[s.roleZh] ?? 'cut1'
  return MENU.find(m => m.id === id)?.price ?? 1200
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

/**
 * 作品的 alt 文字。規則來自 PRD §7.1 與 §13.1 的衍生欄位：
 * `{服務項目}｜{髮長}｜{設計師}`，例：`透明感染髮｜中長髮｜Yuki`。
 * 圖片 alt 與 ImageObject 的 caption 共用同一份，兩邊不會各寫各的。
 */
export function workAlt(w: Work) {
  return `${serviceLabel(w.service)}｜${w.length}｜${stylistLatin(w.stylist)}`
}

export function workMeta(w: Work) {
  return `${serviceLabel(w.service)} ・ ${findStylist(w.stylist)?.label} ・ ${w.length}`
}

export function hoursText(minutes: number) {
  if (!minutes) return ''
  return '約 ' + Math.round((minutes / 60) * 10) / 10 + ' 小時'
}

/**
 * 高擬真稿的日期字串：9／10（四）
 * 2026-09-07 是週一（CLOSED_DAYS 就是 7／14／21／28），所以 day % 7 直接對上 WEEKDAY。
 */
export function dateText(day: number, sep = '／') {
  return '9' + sep + day + '（' + WEEKDAY[day % 7] + '）'
}

export function phoneBad(phone: string) {
  return !/^09\d{8}$/.test(phone.replace(/[\s-]/g, ''))
}

/**
 * 作品單頁的規格列，時長與價格依服務類別給起價。
 * 欄位順序照文案 §6：服務 → 色號 → 需漂髮 → 時長 → 價格。
 * 色號只有染髮作品有，沒有就不出這一列；需漂髮一律要出，是／否都是資訊。
 */
export function workSpecs(w: Work) {
  return [
    { k: 'SERVICE', v: serviceLabel(w.service) },
    { k: 'STYLIST', v: findStylist(w.stylist)?.label ?? '' },
    { k: 'LENGTH', v: w.length },
    ...(w.colorCode ? [{ k: 'COLOR', v: w.colorCode }] : []),
    { k: 'BLEACH', v: w.bleach ? '需要漂髮' : '不需漂髮' },
    { k: 'DURATION', v: w.service === 'cut' ? '60 分鐘' : w.service === 'care' ? '90 分鐘' : '150 分鐘' },
    { k: 'PRICE', v: w.service === 'cut' ? '1,200 起' : w.service === 'care' ? '1,800 起' : '3,800 起' },
  ]
}
