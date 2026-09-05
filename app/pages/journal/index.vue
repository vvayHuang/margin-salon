<script setup lang="ts">
import { JOURNAL_CATEGORIES, PUBLISHED, readingMinutes, type JournalCategory } from '#shared/journal'
import { findStylist } from '#shared/margin'
import { PAGE_SEO } from '#shared/seo'

/** 髮型誌列表：置頂 1 篇 ＋ 分類篩選 ＋ 文章網格（文案 §10）。 */
const route = useRoute()
const router = useRouter()

const category = computed<JournalCategory | ''>({
  get: () => (route.query.category as JournalCategory) || '',
  set: (v) => {
    const query = { ...route.query } as Record<string, string>
    if (v) query.category = v
    else delete query.category
    router.push({ query })
  },
})

/** 每個分類的篇數。為 0 的停用不隱藏，與作品集篩選同一個規則（§13.2） */
const counts = computed(() =>
  Object.fromEntries(
    JOURNAL_CATEGORIES.map(c => [c, PUBLISHED.filter(p => p.category === c).length]),
  ) as Record<JournalCategory, number>,
)

const filtered = computed(() =>
  category.value ? PUBLISHED.filter(p => p.category === category.value) : PUBLISHED,
)
/** 置頂只在沒有篩選時獨立呈現，篩選後回到一般網格 */
const pinned = computed(() => (category.value ? undefined : filtered.value.find(p => p.pinned)))
const rest = computed(() => filtered.value.filter(p => p !== pinned.value))

useMgSeo(() => ({ ...PAGE_SEO['/journal']!, path: '/journal' }))
</script>

<template>
  <div>
    <div class="mg-gut mg-head pt-12">
      <h1 class="mg-h1 flex-none font-display leading-[1.08] font-medium tracking-display-md">
        髮型<br>
        <span class="pl-22 italic">誌</span>
      </h1>
      <div class="flex flex-col gap-5 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          四位設計師寫的實務筆記。判斷方式、為什麼這樣做，還有做不到的時候我們會說什麼。
        </p>
        <p class="mg-indent max-w-[400px] text-16 leading-body text-fg-2 text-pretty">
          共 <span class="text-accent">{{ PUBLISHED.length }}</span> 篇，之後每兩週一篇。
        </p>
      </div>
    </div>

    <!-- 分類：0 篇的停用不隱藏 -->
    <div class="mg-gut pt-14">
      <div class="flex flex-wrap items-center gap-3 bg-surface-1 px-5 py-4">
        <MgButton
          :variant="category === '' ? 'primary' : 'secondary'"
          size="sm"
          @click="category = ''"
        >
          全部 {{ PUBLISHED.length }}
        </MgButton>
        <MgButton
          v-for="c in JOURNAL_CATEGORIES"
          :key="c"
          :variant="category === c ? 'primary' : 'secondary'"
          size="sm"
          :disabled="counts[c] === 0"
          @click="category = c"
        >
          {{ c }} {{ counts[c] }}
        </MgButton>
      </div>
    </div>

    <!-- 置頂：大圖橫排 -->
    <NuxtLink v-if="pinned" :to="`/journal/${pinned.slug}`" class="mg-gut mg-sect mg-detail block">
      <MgImage
        ratio="16/9"
        :src="pinned.cover"
        :alt="pinned.title"
        sizes="(max-width: 900px) 100vw, 60vw"
        priority
      />
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4 font-label text-12 font-semibold tracking-label text-fg-3">
          <span class="text-accent">PINNED</span>
          <span>{{ pinned.category }}</span>
          <span>{{ pinned.date }}</span>
        </div>
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          {{ pinned.title }}
        </h2>
        <p class="text-16 leading-body text-fg-2 text-pretty">{{ pinned.excerpt }}</p>
        <p class="text-14 text-fg-3">
          {{ findStylist(pinned.author ?? undefined)?.label ?? '留白髮所' }}
          ・約 {{ readingMinutes(pinned) }} 分鐘
        </p>
      </div>
    </NuxtLink>

    <div v-if="rest.length" class="mg-gut mg-grid3 mg-sect">
      <NuxtLink v-for="post in rest" :key="post.slug" :to="`/journal/${post.slug}`" class="mg-post">
        <MgImage
          ratio="16/9"
          :src="post.cover"
          :alt="post.title"
          sizes="(max-width: 900px) 50vw, 33vw"
          class="mg-post__media transition-opacity duration-[320ms]"
        />
        <div class="mt-4 flex flex-col gap-2">
          <div class="flex items-center gap-3 font-label text-11 font-semibold tracking-label text-fg-3">
            <span>{{ post.category }}</span>
            <span>{{ post.date }}</span>
          </div>
          <h2 class="font-display text-22 leading-[1.4] font-medium tracking-display-sm">
            {{ post.title }}
          </h2>
          <p class="text-14 leading-body-tight text-fg-2 text-pretty">{{ post.excerpt }}</p>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="mg-gut py-30">
      <p class="font-display text-40 leading-heading-loose font-medium tracking-display-md">
        這個分類還沒有文章。
      </p>
      <div class="mt-8">
        <MgButton variant="secondary" @click="category = ''">看全部文章</MgButton>
      </div>
    </div>

    <div class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 店內空景"
        src="space_alt_02"
        alt="店內空景"
        line1="看完了，"
        line2="不如來試試看"
      />
    </div>
  </div>
</template>

<style scoped>
.mg-post:hover .mg-post__media {
  opacity: 0.85;
}
</style>
