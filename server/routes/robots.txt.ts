import { INDEXABLE } from '#shared/seo'

/**
 * robots.txt（04-SEO §5）。允許爬取，只擋預約完成頁。
 *
 * INDEXABLE 為 false（概念作品）時仍然 Allow：不收錄靠的是每頁的 noindex meta，
 * 爬蟲要讀得到頁面才看得到它。只是不公布 sitemap，不主動邀請收錄。
 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  const sitemap = INDEXABLE ? `\nSitemap: ${getRequestURL(event).origin}/sitemap.xml\n` : ''
  return `User-agent: *
Allow: /
Disallow: /booking/done
${sitemap}`
})
