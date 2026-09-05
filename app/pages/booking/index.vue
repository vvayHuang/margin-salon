<script setup lang="ts">
import {
  BRAND,
  CATEGORIES,
  CLOSED_DAYS,
  FULL_TIMES,
  MENU,
  NO_ROOM_DAY,
  SLOT_TIMES,
  STEPS,
  STYLISTS,
  dateText,
  money,
  phoneBad,
  type CategoryId,
  type StylistId,
} from '#shared/margin'
import type { DayCell } from '~/components/MgDatePicker.vue'
import type { SummaryRow } from '~/components/MgBookingSummary.vue'

definePageMeta({ layout: 'booking' })
useHead({ title: '線上預約 — 留白髮所 MARGIN' })

const route = useRoute()
const {
  state,
  totals,
  stylistText,
  serviceText,
  timeText,
  dayFull,
  lastStart,
  ready,
  blockReason,
  pickDay,
  toggleService,
  next,
  goStep,
  prevStep,
  complete,
  hoursText,
} = useBooking()

/**
 * 高擬真稿把邊界狀態做成一個 prop（無／時段被搶走／送出失敗），預設是「時段被搶走」。
 * 這裡原樣保留成網址參數，方便把兩種狀態叫出來看：/booking?edge=fail
 */
const edge = computed(() => (route.query.edge as string) ?? 'taken')

const modalOpen = ref(false)
const toastOpen = ref(false)

/* ---- 步驟 1 ---- */
interface StylistCard {
  value: StylistId | 'any'
  name: string
  role: string
  note: string
  /** 「不指定」那張沒有頭像 */
  photo?: string
  variant: 'bordered' | 'plain'
}

const stylistCards = computed<StylistCard[]>(() => [
  ...STYLISTS.map(x => ({
    value: x.value,
    name: x.label,
    role: state.value.who === x.value ? `SELECTED ・ ${x.short}` : x.short,
    note: x.pick,
    photo: x.photo,
    variant: 'bordered' as const,
  })),
  {
    value: 'any',
    name: '不指定',
    role: '',
    note: '依你要做的項目安排適合的設計師',
    variant: 'plain',
  },
])

/* ---- 步驟 2 ---- */
const serviceRows = computed(() => MENU.filter(m => m.cat === state.value.cat))
const durationNote = computed(() =>
  totals.value.rows.length
    ? `已選 ${serviceText.value}，${hoursText(totals.value.minutes)} ・ ${money(totals.value.price)} 起。長髮加價會在到店諮詢後確認。`
    : '還沒選項目。金額與時長會依你選的內容計算，可以複選。',
)

/* ---- 步驟 3 ---- */
const days = computed<(DayCell | null)[]>(() => {
  const cells: (DayCell | null)[] = [null]
  for (let d = 1; d <= 30; d++) {
    let st: DayCell['state'] = 'available'
    if (d <= 4) st = 'past'
    else if (CLOSED_DAYS.includes(d)) st = 'full'
    else if (d === state.value.day) st = d === NO_ROOM_DAY ? 'selected-unavailable' : 'selected'
    cells.push({ day: d, state: st })
  }
  return cells
})

const slots = computed(() =>
  SLOT_TIMES.map(time => ({
    time,
    state: state.value.loading
      ? ('loading' as const)
      : FULL_TIMES.includes(time)
        ? ('full' as const)
        : state.value.time === time
          ? ('selected' as const)
          : ('available' as const),
  })),
)

const altSlots = computed(() =>
  ([[13, '15:00'], [14, '11:30'], [16, '16:00']] as [number, string][]).map(([day, time]) => ({
    day,
    time,
    label: `9／${day} ${time}`,
    state:
      state.value.day === day && state.value.time === time
        ? ('selected' as const)
        : ('available' as const),
  })),
)

const slotHeading = computed(() =>
  state.value.day
    ? dateText(state.value.day) + (dayFull.value ? ' 沒有空檔' : ' 可預約')
    : '先選一個日期',
)
const slotNote = computed(() => {
  if (!state.value.day) return '選好日期，右邊會列出當天還開放的時段。'
  if (dayFull.value) return ''
  return `灰色為已滿時段。你的服務${hoursText(totals.value.minutes) || '約 1 小時'}，`
})
const slotNoteAccent = computed(() =>
  !state.value.day || dayFull.value ? '' : `最後可開始時間 ${lastStart.value}。`,
)
const dayFullNote = computed(
  () =>
    `${dateText(NO_ROOM_DAY)} 剩下的空檔只有 60 分鐘，你選的服務需要 ${totals.value.minutes || 150} 分鐘，接不下來。這三個時間可以。`,
)

function pickSlot(time: string) {
  if (!FULL_TIMES.includes(time)) state.value.time = time
}
function pickAlt(day: number, time: string) {
  state.value.day = day
  state.value.time = time
  state.value.loading = false
  modalOpen.value = false
}

/* ---- 步驟 4 ----
   高擬真稿把 touched 設在 next() 裡，但那一步的「下一步」在填完之前就是停用的，
   所以欄位級錯誤在原型裡其實走不到。這裡改成離開欄位就檢查，
   設計好的錯誤態（2px #C8351C ＋ Archivo「!」）才真的會出現。 */
const nameError = computed(() =>
  state.value.touched && !state.value.name.trim()
    ? '還沒填名字。設計師當天要叫得出你的名字。'
    : '',
)
const phoneError = computed(() =>
  state.value.touched && phoneBad(state.value.phone)
    ? '手機號碼看起來不對。填 09 開頭的 10 碼數字就可以送出。'
    : '',
)

/* ---- 步驟 5 ---- */
const confirmRows = computed(() => [
  { k: 'STYLIST', v: stylistText.value, sub: '', hasSub: false, step: 1 },
  {
    k: 'SERVICE',
    v: serviceText.value || '尚未選擇',
    sub: `${hoursText(totals.value.minutes)} ・ ${money(totals.value.price)} 起（長髮加價到店確認）`,
    hasSub: totals.value.rows.length > 0,
    step: 2,
  },
  { k: 'TIME', v: timeText.value || '尚未選擇', sub: '', hasSub: false, step: 3 },
  {
    k: 'DETAILS',
    v: `${state.value.name || '尚未填寫'} ・ ${state.value.phone || '尚未填手機'}`,
    sub:
      (state.value.first === '是' ? `第一次到店 ・ ${state.value.len}髮` : '來過了') +
      (state.value.note ? ` ・ ${state.value.note}` : ''),
    hasSub: true,
    step: 4,
  },
])

/* ---- 右側摘要：每一步把剛決定的那個值提上來 ---- */
const summaryRows = computed<SummaryRow[]>(() => {
  const price = totals.value.price ? money(totals.value.price) : ''
  if (state.value.step === 1) {
    return [
      { label: '設計師', value: stylistText.value, emphasis: 'serif' },
      { label: '服務', value: serviceText.value },
      { label: '時間', value: timeText.value },
    ]
  }
  if (state.value.step === 2) {
    return [
      { label: '設計師', value: stylistText.value },
      { label: '已選', value: serviceText.value, emphasis: 'serif' },
      { label: '預估', value: hoursText(totals.value.minutes) },
      { label: '金額', value: price, emphasis: 'money' },
    ]
  }
  const invalid = dayFull.value && !state.value.time
  const timeRow: SummaryRow = {
    label: '時間',
    value: invalid ? `${dateText(NO_ROOM_DAY)} 無空位` : timeText.value,
    emphasis: state.value.step === 3 ? 'serif' : null,
    invalid,
  }
  return [
    { label: '設計師', value: stylistText.value },
    { label: '服務', value: serviceText.value },
    timeRow,
    { label: '金額', value: price, emphasis: 'money' },
  ]
})

const summaryCaption = computed(() => {
  if (!ready.value) return blockReason.value
  if (state.value.step === 5) return '送出後會收到簡訊確認，不需要另外聯絡。'
  if (state.value.step === 2 && totals.value.rows.length) return '長髮加價會在到店諮詢後確認。'
  return ''
})

const modalTitle = computed(() =>
  timeText.value ? `${timeText.value} 剛剛被別人約走了` : '你選的時段剛剛被約走了',
)

function submit() {
  if (!state.value.tried && edge.value === 'taken') {
    state.value.tried = true
    modalOpen.value = true
    return
  }
  if (!state.value.tried && edge.value === 'fail') {
    state.value.tried = true
    toastOpen.value = true
    return
  }
  complete()
  navigateTo('/booking/done')
}

function primaryAction() {
  if (!ready.value) return
  if (state.value.step === 5) submit()
  else next()
}
</script>

<template>
  <div>
    <MgToast
      v-if="toastOpen"
      label="SUBMIT FAILED"
      message="送出的時候連線斷了，預約沒有成立。再按一次送出就可以，資料都還在。"
      @close="toastOpen = false"
    >
      <template #action>
        <MgButton variant="link" inverse :href="BRAND.phoneHref">打電話給我們 {{ BRAND.phone }}</MgButton>
      </template>
    </MgToast>

    <div v-if="state.step === 1" class="mg-gut mg-intro pt-14">
      <h1 class="mg-h1 font-display leading-[1.08] font-medium tracking-display-md">
        線上<br>
        <span class="pl-22 italic">預約</span>
      </h1>
      <div class="flex flex-col gap-6 pt-4">
        <p class="max-w-[440px] text-16 leading-body text-fg-2 text-pretty">五個步驟，約 30 秒完成。</p>
        <p class="mg-indent max-w-[400px] text-16 leading-body text-fg-2 text-pretty">
          預約請用線上系統，這樣設計師在服務你的時候不會被訊息打斷。
        </p>
      </div>
    </div>

    <div class="mg-gut pt-14">
      <MgStepBar :steps="STEPS" :current="state.step" @step-click="goStep" />
    </div>

    <div class="mg-gut mg-book pt-14 pb-30">
      <div class="flex flex-col gap-8">
        <!-- 01 STYLIST -->
        <div v-if="state.step === 1" class="flex flex-col gap-8">
          <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">想找誰？</h2>
          <div class="mg-cards2">
            <MgStylistCard
              v-for="card in stylistCards"
              :key="card.value"
              :name="card.name"
              :photo="card.photo"
              :role="card.role"
              :note="card.note"
              :variant="card.variant"
              :selected="state.who === card.value"
              @click="state.who = card.value"
            />
          </div>
        </div>

        <!-- 02 SERVICE -->
        <div v-else-if="state.step === 2" class="flex flex-col gap-8">
          <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">這次想做什麼？</h2>
          <div class="flex flex-wrap items-baseline gap-6 text-16">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.id"
              type="button"
              class="border-b pb-[3px]"
              :class="state.cat === cat.id ? 'border-accent text-fg-1' : 'border-transparent text-fg-3'"
              @click="state.cat = cat.id as CategoryId"
            >{{ cat.label }}</button>
          </div>
          <div class="flex flex-col">
            <MgPriceRow
              v-for="(row, i) in serviceRows"
              :key="row.id"
              :name="row.name"
              :note="row.note"
              :duration="`${row.minutes} 分`"
              :price="money(row.price)"
              :checked="state.picked.includes(row.id)"
              :first="i === 0"
              :last="i === serviceRows.length - 1"
              @toggle="toggleService(row.id)"
            />
          </div>
          <p class="text-14 leading-body-snug text-fg-3 text-pretty">{{ durationNote }}</p>
        </div>

        <!-- 03 TIME -->
        <div v-else-if="state.step === 3" class="flex flex-col gap-8">
          <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">什麼時候方便？</h2>
          <div class="mg-time">
            <div class="flex flex-col gap-4">
              <MgDatePicker month="2026 年 9 月" :days="days" @pick="pickDay" />
              <div class="flex flex-wrap gap-4 text-12 text-fg-3">
                <span>白底＝可預約</span><span>淺灰＝已滿</span><span>黑底＝選中</span><span>週一公休</span>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <p class="font-display text-22 font-medium tracking-display-sm">{{ slotHeading }}</p>

              <div v-if="dayFull" class="border border-accent p-6">
                <div class="font-label text-12 font-semibold tracking-label-wide text-accent">
                  NO ROOM THAT DAY
                </div>
                <p class="mt-4 text-16 leading-body text-pretty">{{ dayFullNote }}</p>
                <div class="mt-6 font-label text-12 font-semibold tracking-label-wide text-fg-3">
                  OTHER DATES
                </div>
                <div class="mg-slots mt-3">
                  <MgTimeSlot
                    v-for="alt in altSlots"
                    :key="alt.label"
                    :time="alt.label"
                    :state="alt.state"
                    @pick="pickAlt(alt.day, alt.time)"
                  />
                </div>
              </div>

              <div v-else-if="state.day" class="mg-slots">
                <MgTimeSlot
                  v-for="slot in slots"
                  :key="slot.time"
                  :time="slot.time"
                  :state="slot.state"
                  @pick="pickSlot(slot.time)"
                />
              </div>

              <p class="text-14 leading-body-snug text-fg-3 text-pretty">
                {{ slotNote }}<span class="text-accent">{{ slotNoteAccent }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 04 DETAILS -->
        <div v-else-if="state.step === 4" class="flex max-w-[640px] flex-col gap-8">
          <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">留一下聯絡方式</h2>

          <div class="flex flex-wrap gap-2">
            <MgInput
              v-model="state.name"
              class="min-w-60 flex-1"
              label="姓名（必填）"
              placeholder="王小明"
              :error="nameError"
              @blur="state.touched = true"
            />
            <MgInput
              v-model="state.phone"
              class="min-w-60 flex-1"
              label="手機（必填）"
              placeholder="0912 345 678"
              :error="phoneError"
              @blur="state.touched = true"
            />
          </div>

          <fieldset class="flex flex-col gap-2">
            <legend class="mb-2 text-13 text-fg-3">是否第一次到店？</legend>
            <div class="flex gap-2">
              <div v-for="option in (['是', '否'] as const)" :key="option" class="w-40">
                <MgTimeSlot
                  :time="option"
                  :state="state.first === option ? 'selected' : 'available'"
                  @pick="state.first = option"
                />
              </div>
            </div>
          </fieldset>

          <fieldset v-if="state.first === '是'" class="flex flex-col gap-2 border-l-2 border-accent pl-6">
            <legend class="mb-2 text-13 text-fg-3">目前髮長（第一次到店才問）</legend>
            <div class="flex flex-wrap gap-2">
              <div v-for="option in (['短', '中長', '長'] as const)" :key="option" class="w-30">
                <MgTimeSlot
                  :time="option"
                  :state="state.len === option ? 'selected' : 'available'"
                  @pick="state.len = option"
                />
              </div>
            </div>
          </fieldset>

          <MgInput
            v-model="state.note"
            label="想跟設計師說的話（選填）"
            placeholder="例如：上次染壞了、想剪短但不要太短"
            multiline
          />

          <div class="flex flex-col gap-2">
            <span class="text-13 text-fg-3">參考照片（選填）</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="n in 3"
                :key="n"
                class="flex size-30 items-center justify-center border border-line-2 text-24 text-fg-4"
              >＋</div>
            </div>
          </div>
        </div>

        <!-- 05 CONFIRM -->
        <div v-else-if="state.step === 5" class="flex flex-col gap-10">
          <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
            確認一下<br>
            <span class="pl-14 italic">再送出</span>
          </h2>

          <div class="flex flex-col">
            <div
              v-for="row in confirmRows"
              :key="row.k"
              class="flex items-baseline gap-6 border-t border-line-2 py-6"
            >
              <span class="w-24 flex-none font-label text-12 font-semibold tracking-label-mid text-fg-3">
                {{ row.k }}
              </span>
              <div class="flex flex-1 flex-col gap-2">
                <span class="font-display text-24 font-medium tracking-display-sm">{{ row.v }}</span>
                <span v-if="row.hasSub" class="text-14 leading-body-snug text-fg-3">{{ row.sub }}</span>
              </div>
              <button
                type="button"
                class="border-b border-fg-3 pb-0.5 text-14 text-fg-3"
                @click="goStep(row.step)"
              >修改</button>
            </div>
          </div>

          <div class="flex max-w-[640px] flex-col gap-3">
            <span class="font-label text-12 font-semibold tracking-label-wide text-fg-3">
              BEFORE YOU COME
            </span>
            <p class="text-16 leading-body text-fg-2 text-pretty">
              遲到 15 分鐘以上可能需要改期，因為同時段只服務你一位。<span class="text-accent">當日取消請至少 3 小時前告知</span>，我們會把時段釋出給其他人。
            </p>
          </div>
        </div>

        <div v-if="state.step > 1">
          <MgButton variant="link" muted @click="prevStep">‹ 上一步</MgButton>
        </div>
      </div>

      <MgBookingSummary :rows="summaryRows" :caption="summaryCaption">
        <template #action>
          <MgButton full-width :disabled="!ready" @click="primaryAction">
            {{ state.step === 5 ? '送出預約' : '下一步' }}
          </MgButton>
        </template>
      </MgBookingSummary>
    </div>

    <MgModal
      :open="modalOpen"
      label="SLOT TAKEN"
      :title="modalTitle"
      @scrim-click="modalOpen = false"
    >
      <p class="text-16 leading-body text-fg-2 text-pretty">
        你填的資料都還在，換一個時間就能送出。這位設計師接下來三個時段是空的。
      </p>
      <div class="mg-slots mt-6">
        <MgTimeSlot
          v-for="alt in altSlots"
          :key="alt.label"
          :time="alt.label"
          :state="alt.state"
          @pick="pickAlt(alt.day, alt.time)"
        />
      </div>
      <template #actions>
        <MgButton @click="modalOpen = false">用新的時間送出</MgButton>
        <MgButton variant="link" muted @click="modalOpen = false; goStep(3)">自己重選時間</MgButton>
      </template>
    </MgModal>
  </div>
</template>
