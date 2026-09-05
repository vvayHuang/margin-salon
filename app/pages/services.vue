<script setup lang="ts">
import { SERVICE_GROUPS, SERVICE_NOTES } from '#shared/margin'

/**
 * 服務與價目。同一支 PriceRow，這裡是純列表（不可勾選）；
 * 要勾選的版本在預約流程第二步。
 */
useHead({ title: '服務與價目 — 留白髮所 MARGIN' })
</script>

<template>
  <div>
    <div class="mg-gut pt-8">
      <MgBreadcrumb :items="[{ label: '首頁', to: '/' }, { label: '服務與價目' }]" />
    </div>

    <div class="mg-gut mg-intro pt-14">
      <h1 class="mg-h1 font-display leading-[1.08] font-medium tracking-display-md">
        服務<br>
        <span class="pl-22 italic">與價目</span>
      </h1>
      <div class="flex flex-col gap-6 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
          價目是起價，含諮詢與吹整。髮長、髮量、上次做過什麼，都會影響時間與藥劑量，我們會在動手前先說清楚。
        </p>
        <p class="mg-indent max-w-[400px] text-16 leading-body text-fg-2 text-pretty">
          判斷做不起來的項目，我們會直接說不做，不會先收錢再看結果。
        </p>
      </div>
    </div>

    <section v-for="g in SERVICE_GROUPS" :key="g.id" class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          {{ g.label }}
        </h2>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">{{ g.latin }}</span>
      </div>
      <p class="mt-4 max-w-[560px] text-15 leading-body text-fg-2 text-pretty">{{ g.note }}</p>
      <div class="mt-8 flex flex-col">
        <MgPriceRow
          v-for="row in g.rows"
          :key="row.name"
          :selectable="false"
          :name="row.name"
          :note="row.note"
          :duration="row.duration"
          :price="row.price"
          :first="row.first"
          :last="row.last"
        />
      </div>
    </section>

    <!-- 加價、遲到、取消、付款：先講規則，客人才不用問 -->
    <section class="mg-gut mg-sect">
      <dl class="flex max-w-[720px] flex-col">
        <div
          v-for="n in SERVICE_NOTES"
          :key="n.k"
          class="flex items-baseline gap-6 border-t border-line-2 py-5"
        >
          <dt class="w-22 flex-none font-label text-11 font-semibold tracking-label-wide text-fg-3">
            {{ n.k }}
          </dt>
          <dd class="text-15 leading-body-snug text-pretty">{{ n.v }}</dd>
        </div>
      </dl>
    </section>

    <div class="mg-sect">
      <MgCtaBand
        note="IMAGE 21:9 — 藥劑檯"
        src="space_alt_01"
        alt="店內藥劑檯"
        line1="想好了，"
        line2="就約一個時間"
      />
    </div>
  </div>
</template>
