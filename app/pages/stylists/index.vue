<script setup lang="ts">
import { STYLISTS } from '#shared/margin'

/**
 * 設計師索引。高擬真稿的 STYLISTS 導覽是直接跳到某一位的個人頁，
 * 沒有畫索引頁；這裡用設計系統既有的 StylistCard 補一頁，讓導覽不會是死連結。
 */
useHead({ title: '設計師 — 留白髮所 MARGIN' })
</script>

<template>
  <div>
    <div class="mg-gut mg-head pt-12">
      <h1 class="mg-h1 flex-none font-display leading-[1.08] font-medium tracking-display-md">
        設計<br>
        <span class="pl-22 italic">師</span>
      </h1>
      <div class="flex flex-col gap-5 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          四位設計師，各自擅長的東西不一樣。看完再決定要找誰。
        </p>
      </div>
    </div>

    <div class="mg-gut mg-cards2 pt-12 pb-30">
      <NuxtLink v-for="s in STYLISTS" :key="s.value" :to="`/stylists/${s.value}`">
        <MgStylistCard :name="s.label" :photo="s.photo" :role="s.role" :note="s.pick" />
      </NuxtLink>
    </div>
  </div>
</template>
