<script setup lang="ts">
import { findPost, readingMinutes, relatedPosts } from '#shared/journal'
import { findStylist } from '#shared/margin'
import { articleSchema } from '#shared/seo'

/** 文章單頁（文案 §10）：標題、目錄、內文、作者小卡、相關文章、CTA。 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const found = computed(() => findPost(slug.value))
if (!found.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到這篇文章', fatal: true })
}
const post = computed(() => found.value!)
const author = computed(() => findStylist(post.value.author ?? undefined))
const related = computed(() => relatedPosts(post.value))

/** 目錄只有長文才顯示（文案 §10）——這裡的門檻是四個以上的段落 */
const sections = computed(() => post.value.body ?? [])
const showToc = computed(() => sections.value.length >= 4)
const anchor = (i: number) => `s${i + 1}`

const booking = useBooking()
function bookAuthor() {
  if (!author.value) return navigateTo('/booking')
  booking.reset({ who: author.value.value, step: 1 })
  navigateTo('/booking')
}

useMgSeo(() => ({
  title: `${post.value.title}｜留白髮所 MARGIN`,
  description: post.value.excerpt,
  path: `/journal/${slug.value}`,
  ogType: 'article',
}))
useJsonLd(() =>
  articleSchema({
    headline: post.value.title,
    description: post.value.excerpt,
    datePublished: post.value.date,
    author: author.value?.label ?? '留白髮所 MARGIN',
    image: post.value.cover,
    section: post.value.category,
  }),
)
</script>

<template>
  <article>
    <div class="mg-gut mg-intro pt-12">
      <div class="flex flex-col gap-6">
        <div class="flex flex-wrap items-center gap-4 font-label text-12 font-semibold tracking-label text-fg-3">
          <span>{{ post.category }}</span>
          <span>{{ post.date }}</span>
          <span>約 {{ readingMinutes(post) }} 分鐘</span>
        </div>
        <h1 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
          {{ post.title }}
        </h1>
      </div>
      <div class="flex flex-col gap-6 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">{{ post.excerpt }}</p>
        <p v-if="author" class="text-14 text-fg-3">{{ author.label }}｜{{ author.roleZh }}</p>
      </div>
    </div>

    <div class="mg-gut mg-sect">
      <MgImage
        ratio="16/9"
        :src="post.cover"
        :alt="post.title"
        sizes="100vw"
        priority
      />
    </div>

    <!-- 目錄，長文才出 -->
    <nav v-if="showToc" aria-label="目錄" class="mg-gut mg-sect">
      <div class="max-w-[640px] border-t-2 border-t-line-1 pt-5">
        <div class="font-label text-12 font-semibold tracking-label-mid text-fg-3">CONTENTS</div>
        <ol class="mt-4 flex flex-col gap-2">
          <li v-for="(sec, i) in sections" :key="sec.h2" class="flex items-baseline gap-4">
            <span class="w-6 flex-none font-label text-12 font-semibold text-fg-3">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <a :href="`#${anchor(i)}`" class="text-15 leading-body-tight hover:opacity-60">
              {{ sec.h2 }}
            </a>
          </li>
        </ol>
      </div>
    </nav>

    <div class="mg-gut mg-sect flex max-w-[720px] flex-col gap-12">
      <section v-for="(sec, i) in sections" :id="anchor(i)" :key="sec.h2" class="flex flex-col gap-5">
        <h2 class="font-display text-24 leading-[1.3] font-medium tracking-display-sm">
          {{ sec.h2 }}
        </h2>
        <p v-for="(para, j) in sec.paras" :key="j" class="text-16 leading-body text-fg-2 text-pretty">
          {{ para }}
        </p>
      </section>

      <!-- 每篇至少連 1 次 /services 或 /booking（04-SEO §5） -->
      <div v-if="post.cta" class="border-t border-line-2 pt-8">
        <MgButton variant="link" :to="post.cta.to">{{ post.cta.label }}</MgButton>
      </div>
    </div>

    <!-- 作者小卡 -->
    <section v-if="author" class="mg-gut mg-sect">
      <div class="mg-cards2">
        <NuxtLink :to="`/stylists/${author.value}`">
          <MgStylistCard
            :name="author.label"
            :photo="author.photo"
            :role="author.role"
            :note="author.pick"
          />
        </NuxtLink>
        <div class="flex flex-col items-start justify-center gap-4">
          <p class="max-w-[360px] text-15 leading-body text-fg-2 text-pretty">{{ author.bio1 }}</p>
          <MgButton @click="bookAuthor">指名 {{ author.label.split(' ')[1] }} 預約</MgButton>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="mg-gut mg-sect pb-4">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-24 leading-[1.3] font-medium tracking-display-sm">相關文章</h2>
        <MgButton variant="label" to="/journal">ALL POSTS</MgButton>
      </div>
      <div class="mg-grid3 pt-8">
        <NuxtLink v-for="p in related" :key="p.slug" :to="`/journal/${p.slug}`" class="flex flex-col gap-3">
          <MgImage ratio="16/9" :src="p.cover" :alt="p.title" sizes="(max-width: 900px) 50vw, 33vw" />
          <span class="font-label text-11 font-semibold tracking-label text-fg-3">{{ p.category }}</span>
          <span class="font-display text-18 leading-[1.4] font-medium">{{ p.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <div class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 店內空景"
        src="space_alt_02"
        alt="店內空景"
        line1="看完了，"
        line2="不如來試試看"
      />
    </div>
  </article>
</template>
