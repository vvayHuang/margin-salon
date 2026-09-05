<script setup lang="ts">
import {
  CATEGORY_IMG,
  HOME_PRICE_IDS,
  HOME_WORK_COUNT,
  MENU,
  STYLISTS,
  WORKS,
} from '#shared/margin'

/** 首頁。順序照高擬真稿：滿版標題 → 開場白 → 作品 → 設計師 → 價目導引 → 收尾。 */
useHead({ title: '留白髮所 MARGIN' })

const works = computed(() => WORKS.slice(0, HOME_WORK_COUNT))

/** 只取四個代表項目，帶到完整價目頁；卡片上只露名字，價格留給 /services。 */
const prices = computed(() =>
  HOME_PRICE_IDS.map(id => MENU.find(m => m.id === id)).filter(m => !!m),
)
</script>

<template>
  <div>
    <!-- 滿版開場：21:9 影像撐滿一個視窗高，標題壓在影像左下邊界外 -->
    <section class="flex h-screen items-center">
      <div
        class="relative flex max-h-full w-full items-end overflow-hidden bg-placeholder"
        style="aspect-ratio: 21 / 9"
      >
        <img
          :src="imgSrc('hero_desktop')"
          :srcset="imgSrcset('hero_desktop')"
          sizes="100vw"
          alt="留白髮所店內空景"
          fetchpriority="high"
          decoding="async"
          class="absolute inset-0 size-full object-cover"
        >
        <!-- 標題壓在影像左下，靠這層由下往上的暗化保住對比 -->
        <div class="mg-scrim" />
        <h1
          class="mg-h1 relative -mb-3.5 ml-[42px] font-display leading-[1.02] font-medium tracking-display-xl text-surface-0"
        >
          剪短一點<br>
          <span class="pl-22 italic">也要好整理</span>
        </h1>
      </div>
    </section>

    <!-- 開場白：整段置中，是全站唯一置中的區塊 -->
    <section class="mg-gut mg-sect flex flex-col items-center gap-8 text-center">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        髮型撐不起來，<br>
        <span class="italic">通常不是你的問題。</span>
      </h2>
      <p class="max-w-[560px] text-16 leading-body text-fg-2 text-pretty">
        我們先看你的髮流、生長方向，還有你早上真正願意花的時間，再決定要不要動剪刀。留白不是留少，是留下你自己整理得動的部分。
      </p>
      <p class="max-w-[560px] text-16 leading-body text-fg-2 text-pretty">
        那一張你想帶去剪的照片，帶來就好。我們會告訴你哪一段做得到，哪一段先不要。
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 pt-2">
        <MgButton variant="link" to="/about">關於我們</MgButton>
        <MgButton variant="link" muted to="/stylists">認識設計師</MgButton>
      </div>
    </section>

    <section class="mg-gut mg-sect">
      <div class="mg-grid3 pt-10">
        <MgWorkCard v-for="w in works" :key="w.code" :work="w" />
      </div>
    </section>

    <section class="mg-gut mg-sect">
      <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
        同時段只服務<span class="italic">一位客人</span>
      </h2>
      <div class="mg-cards2 pt-10">
        <NuxtLink v-for="s in STYLISTS" :key="s.value" :to="`/stylists/${s.value}`">
          <MgStylistCard
            :name="s.label"
            :photo="s.photo"
            :role="`${s.short} ・ ${s.days}`"
            :note="s.pick"
          />
        </NuxtLink>
      </div>
    </section>

    <section class="mg-gut mg-sect">
      <div class="mg-avail pt-10">
        <NuxtLink
          v-for="m in prices"
          :key="m.id"
          to="/services"
          class="mg-price flex flex-col gap-4"
        >
          <MgImage
            ratio="4/5"
            :src="CATEGORY_IMG[m.cat]"
            :alt="m.name"
            sizes="(max-width: 900px) 100vw, 25vw"
            class="mg-price__media transition-opacity duration-[320ms]"
          />
          <span class="font-display text-24 leading-[1.3] font-medium tracking-display-sm text-fg-1">
            {{ m.name }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <div class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 洗髮區"
        src="space_alt_02"
        alt="店內鏡前工作區"
        line1="想剪了，"
        line2="就選個時間"
      />
    </div>
  </div>
</template>

<style scoped>
/* 與 WorkCard 同一個行為：hover 只讓影像變淡，文字不動 */
.mg-price:hover .mg-price__media {
  opacity: 0.85;
}
</style>
