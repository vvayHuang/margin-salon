import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // 不釘住的話 Nuxt 有時把 app 綁在 IPv6、HMR websocket 綁在 wildcard，
  // 於是 http://localhost:3000 會打到 websocket 並回 426 Upgrade Required。
  devServer: { host: '127.0.0.1', port: 3000 },
  css: ['~/assets/css/main.css'],
  /**
   * 全部只在伺服器讀得到（沒有 public 區塊）——預約與寄信的金鑰不該進到瀏覽器。
   * 每一個都可以留空：留空時 `/booking` 退回站上的示範資料、表單照常運作但不寄信，
   * 這是一個作品集網站，沒有金鑰也要跑得起來。對應的環境變數見 .env.example。
   */
  runtimeConfig: {
    simplybookLogin: '',
    simplybookApiKey: '',
    /** 取消／改期連結的樣板，{id} 與 {hash} 會被換成 SimplyBook 回傳的值 */
    simplybookCancelUrl: '',
    resendApiKey: '',
    /** 寄件人，要是 Resend 上已驗證網域的位址，例：MARGIN <hello@margin.tw> */
    mailFrom: '',
    /** 店內收件匣：新預約與應徵通知都寄到這裡 */
    mailInbox: '',
  },
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
