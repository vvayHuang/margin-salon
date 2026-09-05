<script setup lang="ts">
import {
  PAGE_SIZE,
  SERVICES,
  SORTS,
  STYLISTS,
  findStylist,
  serviceLabel,
  type ServiceId,
  type SortId,
  type StylistId,
  type Work,
} from '#shared/margin'

useHead({ title: '作品集 — 留白髮所 MARGIN' })

const route = useRoute()
const router = useRouter()

/* 篩選狀態放在網址上：分享出去的連結會帶著同一組條件。 */
function setQuery(patch: Record<string, string | number | null>) {
  const query: Record<string, string> = { ...(route.query as Record<string, string>) }
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') delete query[key]
    else query[key] = String(value)
  }
  router.push({ query })
}

const service = computed<ServiceId | ''>({
  get: () => (route.query.service as ServiceId) || '',
  set: value => setQuery({ service: value, limit: null }),
})
const stylist = computed<StylistId | ''>({
  get: () => (route.query.stylist as StylistId) || '',
  set: value => setQuery({ stylist: value, limit: null }),
})
const sort = computed<SortId | ''>({
  get: () => (route.query.sort as SortId) || 'new',
  set: value => setQuery({ sort: value === 'new' ? null : value }),
})
const limit = computed(() => Number(route.query.limit) || PAGE_SIZE)

const filterCount = computed(() => Number(!!service.value) + Number(!!stylist.value))
const hasFilters = computed(() => filterCount.value > 0)

const { data, pending } = await useFetch('/api/works', {
  query: { service, stylist, sort, limit },
})

const shownWorks = computed<Work[]>(() => data.value?.items ?? [])
const matched = computed(() => data.value?.matched ?? 0)
const totalWorks = computed(() => data.value?.total ?? 0)
const isEmpty = computed(() => !pending.value && matched.value === 0)
const hasResults = computed(() => matched.value > 0)
const canLoadMore = computed(() => shownWorks.value.length < matched.value)
const shownLabel = computed(() => `SHOWING ${shownWorks.value.length} / ${matched.value}`)

/** 空狀態文案：先講是誰的哪個項目沒有，再給兩個出口 */
const emptyNote = computed(
  () =>
    (stylist.value ? findStylist(stylist.value)?.label : '這位設計師') +
    '目前的' +
    (serviceLabel(service.value) || '這個項目') +
    '作品還沒拍。你可以只留設計師這個條件，或先看全部作品。',
)

function clearAll() {
  setQuery({ service: null, stylist: null, limit: null })
}
/** 只清掉服務項目，把設計師留著 */
function keepStylist() {
  setQuery({ service: null, limit: null })
}
function loadMore() {
  setQuery({ limit: limit.value + PAGE_SIZE })
}
</script>

<template>
  <div>
    <div class="mg-gut pt-8">
      <MgBreadcrumb
        :items="[
          { label: '首頁', to: '/' },
          ...(hasFilters ? [{ label: '作品集', to: '/works' }, { label: '篩選結果' }] : [{ label: '作品集' }]),
        ]"
      />
    </div>

    <div class="mg-gut mg-head pt-12">
      <h1 class="mg-h1 flex-none font-display leading-[1.08] font-medium tracking-display-md">
        作品<br>
        <span class="pl-22 italic">集</span>
      </h1>
      <div class="flex flex-col gap-5 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          每一張都是實際施作的紀錄，沒有修過髮色。你看到的就是離店那天的樣子。
        </p>
        <p class="mg-indent max-w-[400px] text-16 leading-body text-fg-2 text-pretty">
          共 <span class="text-accent">{{ totalWorks }}</span> 件作品，可依服務項目與設計師篩選。
        </p>
      </div>
    </div>

    <div class="mg-gut pt-14">
      <div
        class="flex min-h-16 flex-wrap items-center justify-between gap-[10px] bg-surface-1 px-5"
      >
        <div class="flex flex-wrap items-center gap-[10px] py-3">
          <MgDropdown v-model="service" label="SERVICE" placeholder="全部項目" :options="SERVICES" />
          <MgDropdown
            v-model="stylist"
            label="STYLIST"
            placeholder="全部設計師"
            :options="STYLISTS.map(s => ({ value: s.value, label: s.label }))"
          />
          <MgDropdown v-model="sort" label="SORT" placeholder="最新上架" :options="SORTS" />
        </div>

        <div v-if="hasFilters" class="flex items-center gap-3 py-3">
          <span
            class="flex size-[26px] flex-none items-center justify-center bg-accent font-label text-12 font-semibold text-surface-0"
            :aria-label="`已套用 ${filterCount} 項條件`"
          >{{ filterCount }}</span>
          <MgButton variant="secondary" size="sm" @click="clearAll">清除篩選 ✕</MgButton>
        </div>
      </div>
    </div>

    <!-- 空狀態：保留篩選，給兩個出口 -->
    <div v-if="isEmpty" class="mg-gut py-30">
      <p class="max-w-[20ch] font-display text-40 leading-heading-loose font-medium tracking-display-md text-fg-1">
        這個組合還沒有作品。
      </p>
      <p class="mt-6 max-w-[440px] text-16 leading-body text-fg-2 text-pretty">{{ emptyNote }}</p>
      <div class="mt-8 flex flex-wrap items-center gap-8">
        <MgButton variant="secondary" @click="keepStylist">只看這位設計師</MgButton>
        <MgButton variant="link" muted @click="clearAll">看全部作品</MgButton>
      </div>
    </div>

    <template v-if="hasResults || pending">
      <div class="mg-gut mg-grid3 pt-12">
        <template v-if="pending && shownWorks.length === 0">
          <MgWorkCardSkeleton v-for="n in PAGE_SIZE" :key="`skeleton-${n}`" />
        </template>
        <MgWorkCard v-for="work in shownWorks" v-else :key="work.code" :work="work" />
      </div>

      <div class="mg-gut flex flex-col items-center gap-4 pt-16 pb-30">
        <MgButton v-if="canLoadMore" variant="label" :disabled="pending" @click="loadMore">
          LOAD MORE
        </MgButton>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">
          {{ shownLabel }}
        </span>
      </div>
    </template>

    <MgCtaBand
      note="IMAGE 21:9 — 鏡前完成照"
      src="hero_desktop_alt"
      alt="鏡前完成照"
      line1="找到喜歡的"
      line2="那一張"
    />
  </div>
</template>
