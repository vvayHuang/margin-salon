import { STYLISTS, WORKS } from '#shared/margin'
import { SERVICE_PAGES } from '#shared/services'
import { SITE_URL } from '#shared/seo'

/**
 * sitemap.xml（04-SEO §5）。
 *
 * 04-SEO 原本寫用 @nuxtjs/sitemap 自動產生，這裡直接寫成 Nitro route：
 * 路由是靜態的、資料都在 shared/ 裡，多一個相依只是為了做同一件事。
 *
 * `/booking/done` 不列入——那頁 noindex，而且沒有預約收據時會導回 /booking。
 */
export default defineEventHandler((event) => {
  const paths = [
    '/',
    '/about',
    '/services',
    ...SERVICE_PAGES.map(s => `/services/${s.slug}`),
    '/works',
    ...WORKS.map(w => `/works/${w.code}`),
    '/stylists',
    ...STYLISTS.map(s => `/stylists/${s.value}`),
    '/store',
    '/booking',
  ]

  const urls = paths
    .map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
