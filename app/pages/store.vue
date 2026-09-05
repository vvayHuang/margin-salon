<script setup lang="ts">
import { STORE_MAP_SRC, STORE_ROWS, STORE_TIPS } from '#shared/margin'
import { PAGE_SEO } from '#shared/seo'

/** 店家資訊。地址、時間、交通，最後一句提醒臨時狀況怎麼聯絡。 */
useMgSeo(() => ({ ...PAGE_SEO['/store']!, path: '/store' }))
</script>

<template>
  <div>
    <!-- Hero：地名貼齊影像左下邊界，與設計師個人頁同一個做法 -->
    <section
      class="relative flex w-full items-end overflow-hidden bg-placeholder"
      style="aspect-ratio: 21 / 9"
    >
      <img
        :src="imgSrc('location_stairs')"
        :srcset="imgSrcset('location_stairs')"
        sizes="100vw"
        alt="店門口與上樓的樓梯"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 size-full object-cover"
      >
      <!-- 地名壓在影像左下，靠這層由下往上的暗化保住對比 -->
      <div class="mg-scrim" />
      <h1
        class="mg-hero-name relative -mb-3.5 -ml-1.5 font-display leading-display-tight font-medium tracking-[.01em] text-surface-0"
      >
        苓雅<br>
        <span class="italic">Lingya</span>
      </h1>
    </section>

    <div class="mg-gut mg-intro mg-sect">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        走進來<br>
        <span class="pl-14 italic">大概要五分鐘</span>
      </h2>

      <div class="flex flex-col gap-8 pt-2">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          從捷運三多商圈站 2 號出口出來，沿文橫二路走約五分鐘。我們在二樓，一樓是一家咖啡店，樓梯在店面右手邊，門口有一塊小木牌寫 MARGIN。
        </p>
        <dl class="flex max-w-[720px] flex-col">
          <div
            v-for="r in STORE_ROWS"
            :key="r.k"
            class="flex items-baseline gap-6 border-t border-line-2 py-5"
          >
            <dt class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
              {{ r.k }}
            </dt>
            <dd class="text-16 leading-body-tight text-pretty">{{ r.v }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <section class="mg-gut mg-sect">
      <div class="mg-grid3">
        <div
          v-for="t in STORE_TIPS"
          :key="t.k"
          class="flex flex-col gap-3 border-t-2 border-t-line-1 pt-4 pr-6"
        >
          <h3 class="font-label text-12 font-semibold tracking-label-mid text-fg-3">{{ t.k }}</h3>
          <p class="text-15 leading-body text-fg-2 text-pretty">{{ t.v }}</p>
        </div>
      </div>
    </section>

    <section class="mg-gut mg-sect">
      <!-- 沒有靜態地圖素材，先嵌 Google Maps；版位仍是 21:9，窄螢幕給一個最小高度免得只剩一條 -->
      <div
        class="relative overflow-hidden bg-surface-2 max-[900px]:min-h-[260px]"
        style="aspect-ratio: 21 / 9"
      >
        <iframe
          :src="STORE_MAP_SRC"
          title="留白髮所 MARGIN 位置圖"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="absolute inset-0 size-full border-0"
        />
      </div>
    </section>

    <section class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 巷口街景"
        src="location_exterior"
        alt="巷口街景"
        line1="找得到路了，"
        line2="就約一個時間"
      />
      <p class="mg-gut pt-6 text-14 leading-body-snug text-fg-3 text-pretty">
        如果早到了，一樓可以先坐一下，我們不會提前開始，因為前一位客人還在。取消或改期請於 24 小時前操作，臨時狀況直接來電 07-338-0088。
      </p>
    </section>
  </div>
</template>
