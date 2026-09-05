import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // 不釘住的話 Nuxt 有時把 app 綁在 IPv6、HMR websocket 綁在 wildcard，
  // 於是 http://localhost:3000 會打到 websocket 並回 426 Upgrade Required。
  devServer: { host: '127.0.0.1', port: 3000 },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant-TW' },
      // title 與 description 由各頁的 useMgSeo 設定（docs/04-SEO.md §2）；
      // 這裡只留 fallback title，全站共用的 description 會蓋掉每頁自己的。
      title: '留白髮所 MARGIN',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;700&family=Archivo:wght@400;600;700&display=swap',
        },
      ],
    },
  },
})
