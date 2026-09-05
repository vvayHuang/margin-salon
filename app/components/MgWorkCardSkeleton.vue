<template>
  <!-- 骨架脈衝是系統內唯一允許的動態 -->
  <div class="flex flex-col gap-4" aria-hidden="true">
    <div class="ds-skeleton w-full" style="aspect-ratio: 4 / 5" />
    <div class="flex items-baseline justify-between gap-4">
      <div class="ds-skeleton h-[24px] w-1/2" />
      <div class="ds-skeleton h-[12px] w-12" />
    </div>
    <div class="ds-skeleton h-[14px] w-3/4" />
  </div>
</template>
