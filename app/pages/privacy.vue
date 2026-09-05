<script setup lang="ts">
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from '#shared/pages'
import { BRAND } from '#shared/margin'

/**
 * 隱私權政策。作品單頁的 ImageObject.acquireLicensePage 指到這一頁，
 * 所以它不只是法遵頁，也是結構化資料的一個端點。
 */
useMgSeo(() => ({
  title: '隱私權政策｜留白髮所 MARGIN',
  description:
    '我們蒐集哪些資料、用在哪裡、保存多久，以及你可以怎麼要求刪除。預約資料保存 2 年，應徵資料保存 6 個月，不販售給第三方。',
  path: '/privacy',
}))
</script>

<template>
  <div>
    <div class="mg-gut mg-intro pt-14">
      <h1 class="mg-h1 font-display leading-[1.08] font-medium tracking-display-md">
        隱私權<br>
        <span class="pl-22 italic">政策</span>
      </h1>
      <div class="flex flex-col gap-6 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          我們只留下服務你所需要的資料，不留多的。這一頁寫清楚是哪些、用在哪裡、保存多久。
        </p>
        <p class="font-label text-12 font-semibold tracking-label-mid text-fg-3">
          LAST UPDATED　{{ PRIVACY_UPDATED }}
        </p>
      </div>
    </div>

    <section
      v-for="sec in PRIVACY_SECTIONS"
      :key="sec.n"
      class="mg-gut mg-sect"
    >
      <div class="flex items-baseline gap-6">
        <span class="flex-none font-label text-40 leading-[.9] font-semibold tracking-[-.02em]">
          {{ sec.n }}
        </span>
        <h2 class="font-display text-24 leading-[1.3] font-medium tracking-display-sm">
          {{ sec.title }}
        </h2>
      </div>

      <dl v-if="sec.rows" class="mt-6 flex max-w-[720px] flex-col">
        <div
          v-for="row in sec.rows"
          :key="row.k"
          class="flex items-baseline gap-6 border-t border-line-2 py-5"
        >
          <dt class="w-20 flex-none text-15 text-fg-3">{{ row.k }}</dt>
          <dd class="text-15 leading-body-snug text-pretty">{{ row.v }}</dd>
        </div>
      </dl>

      <div v-if="sec.body" class="mt-6 flex max-w-[640px] flex-col gap-4">
        <p v-for="(b, i) in sec.body" :key="i" class="text-15 leading-body text-fg-2 text-pretty">
          {{ b }}
        </p>
      </div>
    </section>

    <section class="mg-gut mg-sect pb-30">
      <p class="max-w-[640px] text-15 leading-body text-fg-2 text-pretty">
        對這份政策有疑問，或想要求查詢、更正、刪除你的資料，請來電
        <a :href="BRAND.phoneHref" class="border-b border-current hover:opacity-60">{{ BRAND.phone }}</a>。
      </p>
      <p class="mt-4 max-w-[640px] text-14 leading-body-snug text-fg-3 text-pretty">
        本網站為設計作品集之模擬案例，非真實營業店家。此頁僅為結構示範，正式上線前需經法務確認用語。
      </p>
    </section>
  </div>
</template>
