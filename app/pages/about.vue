<script setup lang="ts">
import { ABOUT_PRINCIPLES, ABOUT_SPACE } from '#shared/margin'

/** 關於我們。標題靠右、影像在右欄，是全站唯一右對齊 H1 的版面。 */
useHead({ title: '關於我們 — 留白髮所 MARGIN' })
</script>

<template>
  <div>
    <div class="mg-gut pt-8">
      <MgBreadcrumb :items="[{ label: '首頁', to: '/' }, { label: '關於我們' }]" />
    </div>

    <!-- 標題欄自己有一組左邊距（.mg-about-hero），不吃 .mg-gut -->
    <section class="mg-about-hero pt-20">
      <div class="flex flex-col gap-10">
        <h1 class="mg-h1 text-right font-display leading-[1.02] font-medium tracking-display-md">
          留白<br>
          <span class="italic">不是留少</span>
        </h1>
        <div class="flex max-w-[420px] flex-col gap-5">
          <p class="text-15 leading-body text-fg-2 text-pretty">
            我們在鹽埕開了七年，一次只留給一個人。從諮詢到吹整由同一個人做完，中間不會被交接，也不會被晾在旁邊。
          </p>
          <p class="text-15 leading-body text-fg-2 text-pretty">
            這代表我們一天能接的人不多，也代表你不需要在店裡待到天黑。
          </p>
        </div>
      </div>
      <MgImage
        ratio="3/4"
        src="about_hero"
        alt="留白髮所店內全景"
        sizes="(max-width: 900px) 100vw, 50vw"
        priority
      />
    </section>

    <!-- 三條原則：Archivo 大數字與內文並排 -->
    <section class="mg-gut mg-sect">
      <div class="mg-nums">
        <div v-for="p in ABOUT_PRINCIPLES" :key="p.n" class="flex items-start gap-6">
          <span class="flex-none font-label text-64 leading-[.9] font-semibold tracking-[-.02em]">
            {{ p.n }}
          </span>
          <div class="flex flex-col gap-3 pt-1">
            <h2 class="font-display text-22 leading-[1.4] font-medium tracking-display-sm">
              {{ p.title }}
            </h2>
            <p class="text-15 leading-body text-fg-2 text-pretty">{{ p.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mg-gut mg-sect">
      <div class="mg-grid3">
        <figure v-for="s in ABOUT_SPACE" :key="s.caption">
          <MgImage
            ratio="4/5"
            :src="s.img"
            :alt="s.caption"
            sizes="(max-width: 900px) 50vw, 33vw"
          />
          <figcaption class="mt-4 text-14 leading-body-tight text-fg-3">{{ s.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <div class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 鏡前工作檯"
        src="about_intro"
        alt="鏡前工作檯"
        line1="先聊過，"
        line2="再動剪刀"
      />
    </div>
  </div>
</template>
