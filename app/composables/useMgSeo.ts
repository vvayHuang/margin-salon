import { OG_IMAGE, OG_IMAGE_ALT, SITE_URL, type PageSeo } from '#shared/seo'
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
  // canonical 一律用 route.path，不帶查詢字串：/works?service=color 的篩選結果
  // 與 /works 是同一份內容，指回主頁避免重複內容（04-SEO §5）。
  const url = computed(() => SITE_URL + (data.value.path ?? route.path))

  useSeoMeta({
    title: () => data.value.title,
    description: () => data.value.description,
    robots: () => (data.value.noindex ? 'noindex, nofollow' : 'index, follow'),

    ogType: () => data.value.ogType ?? 'website',
    ogSiteName: `${BRAND.nameZh} ${BRAND.nameEn}`,
    ogLocale: 'zh_TW',
    ogTitle: () => data.value.title,
    ogDescription: () => data.value.description,
    ogUrl: () => url.value,
    ogImage: OG_IMAGE,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: OG_IMAGE_ALT,

    twitterCard: 'summary_large_image',
    twitterTitle: () => data.value.title,
    twitterDescription: () => data.value.description,
    twitterImage: OG_IMAGE,
  })

  useHead(() => ({ link: [{ rel: 'canonical', href: url.value }] }))
}

/** 把一份 schema.org 物件掛成 <script type="application/ld+json"> */
export function useJsonLd(build: () => Record<string, unknown>) {
  useHead(() => ({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(build()),
      },
    ],
  }))
}
