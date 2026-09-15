import { INDEXABLE, OG_IMAGE_ALT, OG_IMAGE_PATH, type PageSeo } from '#shared/seo'
import { BRAND } from '#shared/margin'

export interface MgSeoInput extends PageSeo {
  /** 不含網域的路徑；省略時取當前路由。動態頁要自己給，否則 canonical 會帶到查詢字串 */
  path?: string
  ogType?: 'website' | 'article'
}

/**
 * 每頁的 title／description／canonical／OG／Twitter，依 docs/04-SEO.md §2–§3。
 *
 * 吃 getter 而不是物件，因為作品單頁與設計師個人頁的值要跟著路由參數走。
 */
export function useMgSeo(input: () => MgSeoInput) {
  const route = useRoute()
  const data = computed(input)
  // 網域取這次請求實際的 origin，不寫死（見 shared/seo.ts 的 OG_IMAGE_PATH 註解）。
  const site = useRequestURL().origin
  // canonical 一律用 route.path，不帶查詢字串：/works?service=color 的篩選結果
  // 與 /works 是同一份內容，指回主頁避免重複內容（04-SEO §5）。
  const url = computed(() => site + (data.value.path ?? route.path))
  const ogImage = site + OG_IMAGE_PATH

  useSeoMeta({
    title: () => data.value.title,
    description: () => data.value.description,
    robots: () => (!INDEXABLE || data.value.noindex ? 'noindex, nofollow' : 'index, follow'),

    ogType: () => data.value.ogType ?? 'website',
    ogSiteName: `${BRAND.nameZh} ${BRAND.nameEn}`,
    ogLocale: 'zh_TW',
    ogTitle: () => data.value.title,
    ogDescription: () => data.value.description,
    ogUrl: () => url.value,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: OG_IMAGE_ALT,

    twitterCard: 'summary_large_image',
    twitterTitle: () => data.value.title,
    twitterDescription: () => data.value.description,
    twitterImage: ogImage,
  })

  useHead(() => ({ link: [{ rel: 'canonical', href: url.value }] }))
}

/**
 * 把一份 schema.org 物件掛成 <script type="application/ld+json">。
 * `build` 會拿到這次請求的 origin，schema 裡的絕對網址都從它組。
 */
export function useJsonLd(build: (site: string) => Record<string, unknown>) {
  const site = useRequestURL().origin
  useHead(() => ({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(build(site)),
      },
    ],
  }))
}
