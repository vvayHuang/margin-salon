/**
 * 髮型誌。欄位對齊 PRD §13.4 的 Notion 資料庫定義，之後接 Notion CMS 時
 * 這份陣列直接換成建置時抓下來的資料，頁面不用動。
 *
 * **只有「狀態＝上線」的會出現在站上**（§13.5）。目前上線 4 篇，其餘是草稿——
 * 這不是偷懶，是 04-SEO §8 的內容排程：M1 出 #1 #2 #5 #7，M2 出 #3 #4 #6 #8，
 * M3 出剩下的。一個剛上線的站本來就只有 M1 那四篇。
 *
 * 文案 §10 的第 12 篇「為什麼我們沒有 LINE」沒有列進來：D-01 是不放 LINE，
 * 不特地寫一篇說明沒放，那會把它變成焦點。
 */
import type { StylistId } from './margin'

export type JournalCategory = '趨勢' | '保養知識' | '髮色圖鑑' | '店內公告'

export const JOURNAL_CATEGORIES: JournalCategory[] = ['趨勢', '保養知識', '髮色圖鑑', '店內公告']

export interface JournalSection {
  h2: string
  paras: string[]
}

export interface JournalPost {
  slug: string
  title: string
  status: '上線' | '草稿'
  category: JournalCategory
  /** public/img 檔名 */
  cover: string
  /** 60 字，列表與 meta description 共用（§13.4） */
  excerpt: string
  author: StylistId | null
  date: string
  pinned?: boolean
  body?: JournalSection[]
  /** 每篇至少連 1 次 /services 或 /booking（04-SEO §5） */
  cta?: { label: string; to: string }
}

export const JOURNAL: JournalPost[] = [
  {
    slug: 'korean-layered-perm-2026',
    title: '2026 韓系層次燙：三種不用整理也好看的長度',
    status: '上線',
    category: '趨勢',
    cover: 'service_perm',
    excerpt: '韓系層次燙不是一種捲度，是一種讓髮尾有方向的做法。這篇講三種長度各適合誰，以及早上各要花幾分鐘。',
    author: 'shu',
    date: '2026-08-28',
    pinned: true,
    body: [
      {
        h2: '韓系層次不是把頭髮打薄',
        paras: [
          '很多人第一次來會說「我想要韓系那種」，然後拿出照片。照片裡的共通點通常不是捲度，是髮尾有方向——它往內或往外倒，但不是亂翹。',
          '要做到那個，靠的是層次的位置，不是打薄的量。打薄會讓髮尾變輕，短期看起來蓬鬆，三週後開始毛躁，然後你會覺得是髮質不好。',
        ],
      },
      {
        h2: '鎖骨上兩公分：早上五分鐘',
        paras: [
          '這個長度撐得住自己的重量，吹乾之後髮尾會自然往內。適合早上真的只有五分鐘的人。',
          '缺點是每六週就要修一次。長出來一公分，整個形狀就鬆掉了。',
        ],
      },
      {
        h2: '鎖骨下五公分：早上十分鐘',
        paras: [
          '最常做的長度。捲度只做在下半段，上面留直的，看起來才不會蓬得不自然。',
          '髮量偏少的人特別適合，因為重量還在，不會塌。',
        ],
      },
      {
        h2: '過胸：早上十五分鐘，但可以綁',
        paras: [
          '長度夠的話，層次要拉高才看得出來。這個長度真正的好處是不想整理就綁起來，綁起來還是好看的。',
          '所以燙之前我會問你上班能不能綁——答案會直接決定層次放多高。',
        ],
      },
      {
        h2: '三種都一樣的那件事',
        paras: [
          '我剪之前一定會問四件事：早上有多少時間、會不會用吹風機、上班能不能綁起來、多久能來一次。',
          '撐不住的捲度我們會做小一號，三個月後再加強。一次做到滿，掉得也快。',
        ],
      },
    ],
    cta: { label: '看燙髮的完整說明', to: '/services/perm' },
  },
  {
    slug: 'sheer-color-why-bleach',
    title: '透明感染髮是什麼？為什麼一定要漂',
    status: '上線',
    category: '髮色圖鑑',
    cover: 'service_color',
    excerpt: '透明感不是一種顏色，是明度到位之後才看得到的效果。這篇講為什麼要漂，以及不漂可以做到哪裡。',
    author: 'yuki',
    date: '2026-08-21',
    body: [
      {
        h2: '透明感是明度，不是色調',
        paras: [
          '亞洲人的黑髮裡有大量紅棕色素。直接把冷色染上去，那些色素還在下面，看起來就是霧霧的髒感。',
          '漂髮是把底下的色素退掉，讓上面的顏色有地方顯色。所以透明感的關鍵不是你選哪個色號，是底色退到幾度。',
        ],
      },
      {
        h2: '退到幾度，決定你看到什麼',
        paras: [
          '退到 7 度：能做深棕、冷茶棕。看得出顏色，但沒有透明感。',
          '退到 9 度：灰棕、亞麻。這是透明感的門檻，我們大部分的作品在這裡。',
          '退到 11 度以上：粉、藍、灰白。要漂兩次以上，髮質要撐得住才行。',
        ],
      },
      {
        h2: '不漂可以做到哪裡',
        paras: [
          '可以，而且很多人適合。深棕加深、冷茶棕這一類不用漂，室內看是深棕，陽光下才看得出紅。',
          '上班場合能接受、又不想每六週回來一次的話，這是最實際的選擇。',
        ],
      },
      {
        h2: '為什麼我會把褪色一起算進去',
        paras: [
          '很多人染完第一週很滿意，第三週開始變黃，然後就只能一直回店裡補。',
          '所以我配色的時候會偏灰一點，那是為了讓它黃掉的速度慢一點。你看到我的作品偏灰，原因在這裡。',
          '如果你想要的顏色需要漂兩次以上，我會建議分成兩個月做。髮質差很多，這不是為了多賺一次。',
        ],
      },
    ],
    cta: { label: '看染髮的完整說明', to: '/services/color' },
  },
  {
    slug: 'mens-haircut-three-photos',
    title: '男生剪髮怎麼溝通？帶這三張照片就夠了',
    status: '上線',
    category: '保養知識',
    cover: 'service_cut',
    excerpt: '男生剪髮最常見的問題不是剪太短，是比例不對。帶這三張照片，設計師就知道你要什麼。',
    author: 'ray',
    date: '2026-08-14',
    body: [
      {
        h2: '「短一點」不是一個長度',
        paras: [
          '我最常聽到的是「兩側推掉，上面留一點」。這句話可以做出五種完全不同的頭。',
          '差別在推的高度、上面留幾公分、後腦勺收在哪裡。這三個決定你看起來是清爽還是老氣。',
        ],
      },
      {
        h2: '第一張：你喜歡的正面',
        paras: ['正面決定瀏海長度與臉型的框。帶一張你覺得「就是這個感覺」的正面照就好，不用找到一模一樣的髮質。'],
      },
      {
        h2: '第二張：側面',
        paras: [
          '側面才看得出推的高度與鬢角怎麼收。多數人只帶正面，於是側邊高度全靠設計師猜——猜錯就是差一公分，而短髮差一公分就是另一個人。',
        ],
      },
      {
        h2: '第三張：你上一次不喜歡的樣子',
        paras: [
          '這張最有用。你不想要什麼，比你想要什麼準確得多。',
          '上次太短、上面太厚、兩側太高——講得出來，這次就不會再發生一樣的事。',
        ],
      },
      {
        h2: '還有一件事：戴不戴安全帽',
        paras: [
          '高雄十個有八個騎車。安全帽會把兩側壓塌，壓塌的位置我會另外處理，所以請一定要跟我說。',
          '我剪之前會先看三個東西：髮旋在哪、後腦勺凸不凸、耳朵位置高不高。這三個決定側邊要留多少，比「你想剪多短」重要得多。',
        ],
      },
    ],
    cta: { label: '看剪髮的完整說明', to: '/services/cut' },
  },
  {
    slug: 'oily-scalp-not-shampoo',
    title: '頭皮出油有味道，可能不是洗髮精的問題',
    status: '上線',
    category: '保養知識',
    cover: 'service_scalp',
    excerpt: '換了三罐洗髮精還是出油，通常代表問題不在洗髮精。這篇講怎麼判斷，以及什麼時候該來店裡處理。',
    author: 'an',
    date: '2026-08-07',
    body: [
      {
        h2: '先確認你洗的是頭皮還是頭髮',
        paras: [
          '很多人洗頭是把泡沫抹在頭髮上，頭皮其實沒洗到。',
          '正確的做法是指腹貼著頭皮搓，頭髮的部分沖水時自然就洗到了。這一件事改掉，有些人就不用做養護了。',
        ],
      },
      {
        h2: '水溫太高，出油會更嚴重',
        paras: [
          '熱水洗起來很舒服，但它會把頭皮的油脂洗得太乾淨，皮脂腺接著補償性分泌，於是下午就油了。',
          '溫水就好。判斷方式是手腕內側覺得溫、不覺得燙。',
        ],
      },
      {
        h2: '味道通常不是髒，是氧化',
        paras: [
          '皮脂在頭皮上待久了會氧化，那個味道跟「沒洗乾淨」不一樣——它在你洗完幾小時之後才出現。',
          '如果你早上洗完、下午就聞得到，那是出油速度的問題，不是清潔的問題。再換一罐洗髮精也不會解決。',
        ],
      },
      {
        h2: '什麼時候該來處理',
        paras: [
          '以下有兩項以上，做一次會有感：早上洗完下午就扁塌、戴安全帽或綁頭髮後會癢、掉髮量比去年明顯變多。',
          '我會先用放大鏡看毛孔，螢幕會轉給你一起看，不是我說了算。出油與異味通常一次有感；掉髮需要三次以上並搭配作息。',
          '頭皮有傷口或發炎中請先就醫，那個狀況我們不接。',
        ],
      },
    ],
    cta: { label: '看頭皮養護的完整說明', to: '/services/scalp' },
  },

  /* ---- 以下為草稿，站上不會出現。排程見 04-SEO §8 ---- */
  { slug: 'ash-fade-six-weeks', title: '灰霧色褪色會變什麼顏色？六週實拍紀錄', status: '草稿', category: '髮色圖鑑', cover: 'service_color', excerpt: '同一顆頭連拍六週，看灰霧色是怎麼掉的、什麼時候該回來補。', author: 'yuki', date: '2026-09-18' },
  { slug: 'fine-hair-thinning', title: '細軟髮想蓬鬆，該打薄還是不該打薄', status: '草稿', category: '保養知識', cover: 'service_cut', excerpt: '細軟髮打薄之後為什麼更塌？這篇講重量線該留在哪裡。', author: 'shu', date: '2026-09-25' },
  { slug: 'helmet-bangs', title: '戴安全帽的人，瀏海該怎麼剪', status: '草稿', category: '保養知識', cover: 'service_cut', excerpt: '高雄十個有八個騎車。壓塌的位置怎麼剪才不會一脫帽就出事。', author: 'ray', date: '2026-10-02' },
  { slug: 'do-you-need-treatment', title: '護髮要不要做？三種髮況的判斷方式', status: '草稿', category: '保養知識', cover: 'service_treatment', excerpt: '只是乾、染後褪色快、漂過三次以上——三種髮況要做的完全不同。', author: 'an', date: '2026-10-09' },
  { slug: 'is-bleaching-damaging', title: '漂髮傷不傷？我們怎麼判斷你能不能漂', status: '草稿', category: '髮色圖鑑', cover: 'service_color', excerpt: '漂髮不是傷不傷的問題，是你的髮質現在撐不撐得住的問題。', author: 'yuki', date: '2026-10-16' },
  { slug: 'blow-dry-at-home', title: '剪完隔天就變了？在家吹整的三個關鍵', status: '草稿', category: '保養知識', cover: 'service_perm', excerpt: '店裡那顆頭回不來，多半不是技術問題，是吹的順序不對。', author: 'shu', date: '2026-10-23' },
  { slug: 'sanduo-walk', title: '三多商圈散步：剪完頭髮可以去的五個地方', status: '草稿', category: '店內公告', cover: 'location_env_01', excerpt: '文橫二路走出去五分鐘內，我們自己常去的五個地方。', author: null, date: '2026-10-30' },
]

/** 站上只出現「上線」的，依發布日期新到舊（§13.5） */
export const PUBLISHED = JOURNAL
  .filter(p => p.status === '上線')
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function findPost(slug: string | undefined) {
  return PUBLISHED.find(p => p.slug === slug)
}

/** 中文閱讀速度抓每分鐘 350 字 */
export function readingMinutes(post: JournalPost) {
  const chars = (post.body ?? []).reduce(
    (n, s) => n + s.h2.length + s.paras.reduce((m, p) => m + p.length, 0),
    0,
  )
  return Math.max(1, Math.round(chars / 350))
}

/** 相關文章：同分類優先，不足就補同作者，取 3 篇（§13.1 的作法搬過來） */
export function relatedPosts(post: JournalPost) {
  const others = PUBLISHED.filter(p => p.slug !== post.slug)
  const sameCat = others.filter(p => p.category === post.category)
  const rest = others.filter(p => !sameCat.includes(p))
  return [...sameCat, ...rest].slice(0, 3)
}
