<script setup lang="ts">
import { MENU, STYLISTS, WORKS, money, type CategoryId } from '#shared/margin'
import { SERVICE_PAGES } from '#shared/services'
import { serviceSchema } from '#shared/seo'

/**
 * 服務單頁 — 五頁共用這一個模板（PRD §6.3）。
 * 個別差異全部靠 shared/services.ts 的資料，版面不動。
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const found = computed(() => SERVICE_PAGES.find(s => s.slug === slug.value))
if (!found.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到這個服務', fatal: true })
}
const page = computed(() => found.value!)

const stylist = computed(() => STYLISTS.find(s => s.value === page.value.stylist)!)

/** 價格區間取自價目表，不另外寫死 */
const prices = computed(() =>
  MENU.filter(m => m.cat === page.value.cat && m.price > 0).map(m => m.price),
)
const priceLo = computed(() => Math.min(...prices.value))
const priceHi = computed(() => Math.max(...prices.value))
const priceRange = computed(() =>
  priceLo.value === priceHi.value
    ? `${money(priceLo.value)} 起`
    : `${money(priceLo.value)} – ${money(priceHi.value)}`,
)

/**
 * 該項目的作品。作品的 service 沒有 scalp（頭皮養護歸在護髮底下做），
 * 所以頭皮這頁抓不到東西，整個區塊就不出現——不硬湊。
 */
const works = computed(() =>
  WORKS.filter(w => (w.service as CategoryId) === page.value.cat).slice(0, 4),
)

const booking = useBooking()
function bookThis() {
  // 帶著這個服務類別跳到預約流程第二步，跳過分類選擇（文案 §4）
  booking.reset({ cat: page.value.cat, step: 2 })
  navigateTo('/booking')
}

useMgSeo(() => ({
  title: page.value.seoTitle,
  description: page.value.seoDesc,
  path: `/services/${slug.value}`,
}))
useJsonLd(() =>
  serviceSchema({
    name: page.value.title,
    serviceType: page.value.serviceType,
    lowPrice: priceLo.value,
    highPrice: priceHi.value,
  }),
)
</script>

<template>
  <div>
    <!-- 1. 名稱 + 一句話定位 + 價格區間 -->
    <div class="mg-gut mg-intro pt-14">
      <h1 class="mg-h1 font-display leading-[1.08] font-medium tracking-display-md">
        {{ page.title }}
      </h1>
      <div class="flex flex-col gap-6 pt-4">
        <p class="max-w-[440px] font-display text-24 leading-heading font-medium tracking-display-sm">
          {{ page.lead }}
        </p>
        <div class="flex items-baseline gap-4">
          <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">PRICE</span>
          <span class="font-label text-20 font-semibold">{{ priceRange }}</span>
        </div>
        <MgButton variant="link" to="/services">回完整價目表</MgButton>
      </div>
    </div>

    <!-- 2. 適合誰 -->
    <section class="mg-gut mg-sect">
      <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
        如果你有這些狀況
      </h2>
      <ul class="mt-8 flex max-w-[720px] flex-col">
        <li
          v-for="s in page.symptoms"
          :key="s"
          class="flex items-baseline gap-4 border-t border-line-2 py-4 text-16 leading-body-tight"
        >
          <span class="flex-none font-mono text-13 text-fg-3" aria-hidden="true">・</span>
          <span>{{ s }}</span>
        </li>
      </ul>
      <p class="mt-6 max-w-[560px] text-15 leading-body text-fg-2 text-pretty">
        {{ page.symptomNote }}
      </p>
    </section>

    <!-- 3. 施作內容 -->
    <section class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          我們會做什麼
        </h2>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">
          {{ page.latin }}
        </span>
      </div>
      <dl class="mt-8 flex max-w-[720px] flex-col">
        <div
          v-for="step in page.steps"
          :key="step.k"
          class="flex items-baseline gap-6 border-t border-line-2 py-5"
        >
          <dt class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
            {{ step.k }}
          </dt>
          <dd class="text-15 leading-body-snug text-pretty">{{ step.v }}</dd>
        </div>
      </dl>
    </section>

    <!-- 4. 使用產品／技術 -->
    <section class="mg-gut mg-sect">
      <div class="mg-intro">
        <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
          用什麼<br>
          <span class="pl-14 italic">怎麼做</span>
        </h2>
        <p class="max-w-[440px] pt-4 text-16 leading-body text-fg-2 text-pretty">
          {{ page.products }}
        </p>
      </div>
    </section>

    <!-- 5. 該項目的作品。沒有 before 素材，所以不做 Before／After（見 D-11） -->
    <section v-if="works.length" class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          {{ page.title }}的作品
        </h2>
        <MgButton variant="label" :to="`/works?service=${page.cat}`">ALL WORKS</MgButton>
      </div>
      <div class="mg-grid4 pt-10">
        <MgWorkCard v-for="w in works" :key="w.code" :work="w" />
      </div>
    </section>

    <!-- 6. 時間與注意事項 -->
    <section class="mg-gut mg-sect">
      <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
        你需要知道
      </h2>
      <ul class="mt-8 flex max-w-[720px] flex-col">
        <li
          v-for="c in page.cautions"
          :key="c"
          class="flex items-baseline gap-4 border-t border-line-2 py-4 text-15 leading-body-tight text-pretty"
        >
          <span class="flex-none font-mono text-13 text-fg-3" aria-hidden="true">・</span>
          <span>{{ c }}</span>
        </li>
      </ul>
    </section>

    <!-- 7. 專長設計師 -->
    <section class="mg-gut mg-sect">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        這個項目<br>
        <span class="pl-14 italic">找誰</span>
      </h2>
      <div class="mg-cards2 pt-10">
        <NuxtLink :to="`/stylists/${stylist.value}`">
          <MgStylistCard
            :name="stylist.label"
            :photo="stylist.photo"
            :role="stylist.role"
            :note="page.stylistNote"
          />
        </NuxtLink>
      </div>
    </section>

    <!-- 8. 該項目 FAQ -->
    <section class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          常見問題
        </h2>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">FAQ</span>
      </div>
      <div class="mt-8 max-w-[720px]">
        <MgFaq :items="page.faq" />
      </div>
      <div class="mt-10 flex flex-wrap items-center gap-8">
        <MgButton @click="bookThis">預約{{ page.title }}</MgButton>
        <MgButton variant="link" muted to="/services">看其他項目</MgButton>
      </div>
    </section>

    <!-- 9. 預約 CTA -->
    <div class="mg-sect">
      <MgCtaBand
        :note="`IMAGE 21:9 — ${page.ctaAlt}`"
        :src="page.ctaImg"
        :alt="page.ctaAlt"
        :line1="page.ctaLine1"
        :line2="page.ctaLine2"
      />
    </div>
  </div>
</template>
