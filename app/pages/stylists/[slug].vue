<script setup lang="ts">
import {
  BRAND,
  STYLISTS,
  WORKS,
  money,
  stylistCutPrice,
  stylistLatin,
  stylistZh,
  type StylistId,
} from '#shared/margin'

const route = useRoute()
const slug = computed(() => String(route.params.slug) as StylistId)

const stylist = computed(() => STYLISTS.find(s => s.value === slug.value))
if (!stylist.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到這位設計師', fatal: true })
}

const who = computed(() => stylist.value!)
const allWorks = computed(() => WORKS.filter(w => w.stylist === slug.value))
const shownWorks = computed(() => allWorks.value.slice(0, 4))

// Title 公式見 04-SEO §2：{姓名}｜{職級}・{主要擅長}｜MARGIN
useMgSeo(() => ({
  title: `${who.value.label}｜${who.value.roleZh}・${who.value.tags[0]}｜MARGIN`,
  description: who.value.seoDesc,
  path: `/stylists/${slug.value}`,
}))

/** 只有剪髮有職級價差，染燙護四位同價（文案 §3） */
const cutPrice = computed(() => money(stylistCutPrice(who.value)))

const booking = useBooking()

function bookWithStylist() {
  booking.reset({ who: slug.value, step: 1 })
  navigateTo('/booking')
}
function seePrices() {
  booking.reset({ who: slug.value, step: 2 })
  navigateTo('/booking')
}
function pickSlot(day: number, time: string) {
  booking.reset({ who: slug.value, step: 2, day, time })
  navigateTo('/booking')
}
</script>

<template>
  <div>
    <!-- Hero：大名字貼齊影像左下邊界 -->
    <section
      class="relative flex w-full items-end overflow-hidden bg-placeholder"
      style="aspect-ratio: 21 / 9"
    >
      <!-- 個人照是 1:1，裁進 21:9 只會留下臉的那一條；object-position 往上帶一點，
           讓五官落在畫面中線，下緣的名字才不會壓在眼睛上。 -->
      <img
        :src="imgSrc(who.photo)"
        :srcset="imgSrcset(who.photo)"
        sizes="100vw"
        :alt="`${who.label}的個人照`"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 size-full object-cover"
        style="object-position: center 45%"
      >
      <!-- 大名字壓在影像左下，靠這層由下往上的暗化保住對比 -->
      <div class="mg-scrim" />
      <h1
        class="mg-hero-name relative -mb-3.5 -ml-1.5 font-display leading-display-tight font-medium tracking-[.01em] text-surface-0"
      >
        {{ stylistZh(slug) }}<br>
        <span class="italic">{{ stylistLatin(slug) }}</span>
      </h1>
    </section>

    <div class="mg-gut mg-intro mg-sect">
      <p class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        {{ who.t1 }}<br>
        <span class="pl-14 italic">{{ who.t2 }}</span>
      </p>

      <div class="flex flex-col gap-8 pt-2">
        <div class="flex items-center gap-4">
          <span class="font-label text-12 font-semibold tracking-label-wide">{{ who.role }}</span>
          <span class="h-px max-w-30 flex-1 bg-fg-1" />
        </div>
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">{{ who.bio1 }}</p>
        <p class="mg-indent max-w-[400px] text-16 leading-body text-fg-2 text-pretty">{{ who.bio2 }}</p>
        <div class="ml-8 flex flex-wrap gap-2">
          <MgChip v-for="tag in who.tags" :key="tag" :label="tag" />
        </div>
      </div>
    </div>

    <div class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
          {{ stylistLatin(slug) }} 的<span class="italic">作品</span>
        </h2>
        <MgButton variant="label" :to="`/works?stylist=${slug}`">
          ALL {{ allWorks.length }} WORKS
        </MgButton>
      </div>
      <div class="mg-grid4 pt-10">
        <MgWorkCard v-for="w in shownWorks" :key="w.code" :work="w" />
      </div>
    </div>

    <!-- 顧客評價：D-04 把首頁的評價區塊移到這裡，評價綁人比綁店有說服力 -->
    <div class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
          指名 {{ stylistLatin(slug) }} 的<br>
          <span class="pl-14 italic">客人這樣說</span>
        </h2>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">REVIEWS</span>
      </div>
      <div class="mg-nums pt-12">
        <figure v-for="(review, i) in who.reviews" :key="i" class="border-t-2 border-t-line-1 pt-5">
          <blockquote class="font-display text-20 leading-heading-loose text-fg-1 text-pretty">
            「{{ review }}」
          </blockquote>
        </figure>
      </div>
    </div>

    <div class="mg-gut mg-intro mg-sect">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        最近的<br>
        <span class="pl-14 italic">空檔</span>
      </h2>

      <div class="flex flex-col gap-8 pt-2">
        <div class="mg-avail">
          <div
            v-for="[day, week, times] in who.avail"
            :key="day"
            class="flex flex-col gap-3 border-t-2 pt-4"
            :class="times.length ? 'border-t-line-1' : 'border-t-line-2'"
          >
            <div
              class="font-label text-12 font-semibold tracking-label"
              :class="times.length ? 'text-fg-3' : 'text-fg-4'"
            >09／{{ day }} {{ week }}</div>

            <div v-if="!times.length" class="text-14 text-fg-4">已滿</div>
            <div v-else class="flex flex-col items-start gap-2 text-16">
              <button
                v-for="time in times"
                :key="time"
                type="button"
                class="hover:opacity-60"
                @click="pickSlot(day, time)"
              >{{ time }}</button>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-8">
          <MgButton @click="bookWithStylist">預約 {{ stylistLatin(slug) }}</MgButton>
          <button type="button" class="text-16 hover:opacity-60" @click="seePrices">看服務與價目</button>
        </div>

        <p class="text-14 leading-body-snug text-fg-3 text-pretty">{{ who.hours }}</p>
      </div>
    </div>

    <!-- 我的價目與社群（PRD §6.5 區塊 6、7） -->
    <div class="mg-gut mg-sect pb-30">
      <dl class="flex max-w-[720px] flex-col">
        <div class="flex items-baseline gap-6 border-t border-line-2 py-5">
          <dt class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
            CUT
          </dt>
          <dd class="text-16 leading-body-tight">
            {{ cutPrice }}
            <span class="text-fg-3">（{{ who.roleZh }}）</span>
          </dd>
        </div>
        <div class="flex items-baseline gap-6 border-t border-line-2 py-5">
          <dt class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
            OTHERS
          </dt>
          <dd class="text-16 leading-body-tight">染、燙、護與頭皮養護四位同價</dd>
        </div>
        <div class="flex items-baseline gap-6 border-t border-b border-line-2 py-5">
          <dt class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
            INSTAGRAM
          </dt>
          <dd class="text-16 leading-body-tight">
            <!-- 全店共用一個帳號（PRD §1.2），不是每位設計師各一個 -->
            <a
              :href="BRAND.igHref"
              target="_blank"
              rel="noopener noreferrer"
              class="border-b border-current hover:opacity-60"
            >{{ BRAND.ig }}</a>
            <span class="text-fg-3">・作品發布用，不接受 DM 預約</span>
          </dd>
        </div>
      </dl>
      <div class="pt-6">
        <MgButton variant="link" muted to="/services">看完整價目表</MgButton>
      </div>
    </div>
  </div>
</template>
