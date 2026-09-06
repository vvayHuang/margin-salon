<script setup lang="ts">
import { BRAND, STORE_TIPS, money } from '#shared/margin'
import { PAGE_SEO } from '#shared/seo'

/**
 * 預約完成（PRD §6.9）。收據來自 /api/booking 的回覆，不是前端自己湊的 ——
 * 預約編號、確認信寄了沒、有沒有線上取消連結，都只有後端知道。
 */
useMgSeo(() => ({ ...PAGE_SEO['/booking/done']!, path: '/booking/done' }))

const { receipt } = useBooking()

// 直接開這個網址（重新整理、或有人把連結存起來）時沒有收據可看，把人送回流程開頭。
if (!receipt.value) {
  await navigateTo('/booking', { replace: true })
}

const doneRows = computed(() => [
  { k: 'CODE', v: receipt.value?.code ?? '' },
  { k: 'STYLIST', v: receipt.value?.stylist === '不指定' ? '不指定（確認後告知）' : (receipt.value?.stylist ?? '') },
  { k: 'SERVICE', v: receipt.value?.service ?? '' },
  { k: 'TIME', v: receipt.value?.time ?? '' },
  { k: 'TOTAL', v: `${money(receipt.value?.price ?? 0)} 起（現場確認）` },
])

/** 確認信寄出去了沒。沒寄出的話不要說「已寄出」，改成請對方留意編號。 */
const mailNote = computed(() => {
  if (!receipt.value) return ''
  if (receipt.value.mailed) return '確認信已經寄到你填的 Email，裡面有編號、時間與交通提醒。'
  return '確認信這次沒有寄出去，請先把上面的預約編號記下來。'
})

/**
 * 加入行事曆。用 data: URI 產一個 .ics，不打伺服器也不必裝套件。
 * 時區用 Asia/Taipei 的 UTC+8 直接換算成 UTC，台灣沒有日光節約時間，這樣就夠準。
 */
const icsHref = computed(() => {
  const r = receipt.value
  if (!r?.start) return ''

  const start = new Date(`${r.start}:00+08:00`)
  const end = new Date(start.getTime() + (r.minutes || 60) * 60_000)
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MARGIN Hair Studio//Booking//ZH-TW',
    'BEGIN:VEVENT',
    `UID:${r.code}@margin.hair`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${BRAND.nameZh} ${r.service}（${r.stylist}）`,
    `LOCATION:${BRAND.address}`,
    `DESCRIPTION:預約編號 ${r.code}。遲到 15 分鐘以上可能需要改期。`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`
})
</script>

<template>
  <div class="mg-gut py-30">
    <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">BOOKING RECEIVED</div>

    <h1 class="mg-h2 mt-6 font-display leading-heading font-medium tracking-display-md">
      已經收到<br>
      <span class="pl-14 italic">你的預約</span>
    </h1>

    <p class="mt-8 max-w-[440px] text-16 leading-body text-fg-2 text-pretty">
      {{ mailNote }}臨時狀況請直接來電 {{ BRAND.phone }}。
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

    <!-- 交通與停車提醒（PRD §6.9） -->
    <section class="mt-14 max-w-[640px]">
      <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">GETTING HERE</div>
      <div class="mt-5 flex flex-col">
        <p
          v-for="tip in STORE_TIPS"
          :key="tip.k"
          class="border-t border-line-2 py-5 text-15 leading-body text-fg-2 text-pretty"
        >{{ tip.v }}</p>
      </div>
    </section>

    <!-- 取消／改期（PRD §6.9） -->
    <section class="mt-14 max-w-[640px]">
      <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">CHANGE OR CANCEL</div>
      <p class="mt-5 text-15 leading-body text-fg-2 text-pretty">
        取消或改期請於 24 小時前操作。當日取消我們不收費，但下次預約會請你提前確認。
      </p>
      <div class="mt-5 flex flex-wrap items-center gap-8">
        <MgButton v-if="receipt?.cancelUrl" variant="secondary" :href="receipt.cancelUrl">
          取消或改期
        </MgButton>
        <MgButton v-else variant="secondary" :href="BRAND.phoneHref">
          致電 {{ BRAND.phone }}
        </MgButton>
      </div>
    </section>

    <div class="mt-14 flex flex-wrap items-center gap-8">
      <MgButton v-if="icsHref" :href="icsHref" download="margin-booking.ics">加入行事曆</MgButton>
      <MgButton variant="secondary" to="/works">回作品集</MgButton>
      <MgButton variant="link" muted to="/booking">再約一次</MgButton>
    </div>
  </div>
</template>
