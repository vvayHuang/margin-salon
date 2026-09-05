import { SITE_URL } from '#shared/seo'

/** robots.txt（04-SEO §5）。允許爬取，只擋預約完成頁。 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Disallow: /booking/done

Sitemap: ${SITE_URL}/sitemap.xml
`
})
