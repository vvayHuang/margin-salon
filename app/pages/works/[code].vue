<script setup lang="ts">
import {
  WORKS,
  findStylist,
  serviceLabel,
  stylistLatin,
  workSpecs,
} from '#shared/margin'

const route = useRoute()
const code = computed(() => String(route.params.code))

const work = computed(() => WORKS.find(w => w.code === code.value))
if (!work.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到這件作品', fatal: true })
}

const current = computed(() => work.value!)
const stylist = computed(() => findStylist(current.value.stylist)!)
const specs = computed(() => workSpecs(current.value))
const tags = computed(() => [
  serviceLabel(current.value.service),
  current.value.length,
  stylistLatin(current.value.stylist),
])
const related = computed(() =>
  WORKS.filter(w => w.stylist === current.value.stylist && w.code !== current.value.code).slice(0, 4),
)

useHead(() => ({ title: `${current.value.title} ${current.value.code} — 留白髮所 MARGIN` }))

const booking = useBooking()
function bookThis() {
  booking.reset({ who: current.value.stylist, step: 1 })
  navigateTo('/booking')
}
</script>

<template>
  <div>
    <div class="mg-gut mg-detail pt-12">
      <MgImage
        ratio="4/5"
        :src="`${current.img}_front`"
        :alt="`${current.title}｜${current.length}`"
        sizes="(max-width: 900px) 100vw, 60vw"
        priority
      />

      <div class="flex flex-col gap-8">
        <div class="flex items-baseline justify-between gap-4">
          <h1 class="font-display text-40 leading-heading font-medium tracking-display-md">
            {{ current.title }}
          </h1>
          <span class="font-label text-12 font-semibold tracking-label text-fg-3">{{ current.code }}</span>
        </div>

        <p class="text-16 leading-body text-fg-2 text-pretty">{{ current.note }}</p>

        <div class="flex flex-col">
          <div
            v-for="spec in specs"
            :key="spec.k"
            class="flex items-baseline gap-6 border-t border-line-2 py-4"
          >
            <span class="w-22 flex-none font-label text-11 font-semibold tracking-label-wide text-fg-3">
              {{ spec.k }}
            </span>
            <span class="text-15 leading-body-tight">{{ spec.v }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <MgChip v-for="tag in tags" :key="tag" :label="tag" />
        </div>

        <div class="flex flex-col items-start gap-4">
          <MgButton full-width @click="bookThis">用這張預約</MgButton>
          <MgButton variant="link" :to="`/stylists/${current.stylist}`">
            看 {{ stylistLatin(current.stylist) }} 的個人頁
          </MgButton>
          <MgButton variant="link" muted to="/works">‹ 回作品集</MgButton>
        </div>
      </div>
    </div>

    <div class="mg-gut mg-sect pb-30">
      <div class="flex items-baseline justify-between gap-4">
        <h2 class="font-display text-24 leading-[1.3] font-medium tracking-display-sm">
          {{ stylist.label }}的其他作品
        </h2>
        <span class="font-label text-12 font-semibold tracking-label text-fg-3">
          {{ related.length }} WORKS
        </span>
      </div>
      <div class="mg-grid4 mt-8">
        <MgWorkCard v-for="w in related" :key="w.code" :work="w" />
      </div>
    </div>
  </div>
</template>
