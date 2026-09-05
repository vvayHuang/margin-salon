<script setup lang="ts">
import { money } from '#shared/margin'

useHead({ title: '預約完成 — 留白髮所 MARGIN' })

const { receipt } = useBooking()

// 直接開這個網址（重新整理、或有人把連結存起來）時沒有收據可看，把人送回流程開頭。
if (!receipt.value) {
  await navigateTo('/booking', { replace: true })
}

const doneRows = computed(() => [
  { k: 'STYLIST', v: receipt.value?.stylist === '不指定' ? '不指定（確認後告知）' : (receipt.value?.stylist ?? '') },
  { k: 'SERVICE', v: receipt.value?.service || '設計師剪髮' },
  { k: 'TIME', v: receipt.value?.time || '9／10（四）14:00' },
  { k: 'TOTAL', v: `${money(receipt.value?.price || 1200)} 起（現場確認）` },
])
</script>

<template>
  <div class="mg-gut py-30">
    <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">BOOKING RECEIVED</div>

    <h1 class="mg-h2 mt-6 font-display leading-heading font-medium tracking-display-md">
      已經收到<br>
      <span class="pl-14 italic">你的預約</span>
    </h1>

    <p class="mt-8 max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
      我們會在營業時間內用簡訊回覆確認，通常一小時內。收到確認才算約成。臨時狀況請直接來電 07-338-0088。
    </p>

    <div class="mt-10 flex max-w-[640px] flex-col">
      <div
        v-for="row in doneRows"
        :key="row.k"
        class="flex items-baseline gap-6 border-t border-line-2 py-5"
      >
        <span class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
          {{ row.k }}
        </span>
        <span class="text-16 leading-body-tight">{{ row.v }}</span>
      </div>
    </div>

    <div class="mt-10 flex flex-wrap items-center gap-8">
      <MgButton variant="secondary" to="/works">回作品集</MgButton>
      <MgButton variant="link" muted to="/booking">再約一次</MgButton>
    </div>
  </div>
</template>
