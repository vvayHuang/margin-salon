<script setup lang="ts">
import { CAREERS_CULTURE, CAREERS_JOBS, CAREERS_VOICES } from '#shared/pages'
import { BRAND, phoneBad } from '#shared/margin'
import type { CareersResult } from '#shared/booking'

/**
 * 加入我們（文案 §11）。
 * 送出會打 `/api/careers`，由後端寄一封通知信到店內收件匣（PRD F-11）。
 * 沒設定寄信服務的環境（例如只跑 `npm run dev` 看版面）後端會回 `mailed: false`，
 * 畫面就照實說沒有寄出去——不假裝收到了。
 */
useMgSeo(() => ({
  title: '加入我們｜高雄美髮設計師與助理職缺｜MARGIN',
  description:
    '沒有業績抽成，所以不用推銷。教育訓練排在上班時間、不佔休假也不收學費。設計師底薪 35,000 起、助理 30,000 起，週休二日。',
  path: '/careers',
}))

const form = reactive({
  name: '',
  phone: '',
  role: '設計師' as '設計師' | '助理',
  link: '',
  note: '',
  agree: false,
})
const touched = reactive({ name: false, phone: false, link: false })
const sent = ref(false)
const sending = ref(false)
/** 通知信有沒有真的寄到店裡。null 代表還沒送出過。 */
const mailed = ref<boolean | null>(null)
const failMessage = ref('')
/** 蜜罐：藏起來的欄位，只有機器人會填它 */
const honeypot = ref('')

const nameError = computed(() => (touched.name && !form.name.trim() ? '請填姓名' : ''))
const phoneError = computed(() =>
  touched.phone && phoneBad(form.phone) ? '手機號碼看起來不太對，格式：09 開頭共 10 碼' : '',
)
/** 應徵設計師必填作品集連結（文案 §11） */
const linkRequired = computed(() => form.role === '設計師')
const linkError = computed(() =>
  touched.link && linkRequired.value && !form.link.trim() ? '應徵設計師請附作品集或履歷連結' : '',
)

const ready = computed(
  () =>
    !!form.name.trim()
    && !phoneBad(form.phone)
    && (!linkRequired.value || !!form.link.trim())
    && form.agree,
)

async function submit() {
  touched.name = true
  touched.phone = true
  touched.link = true
  if (!ready.value || sending.value) return

  sending.value = true
  failMessage.value = ''
  try {
    const result = await $fetch<CareersResult>('/api/careers', {
      method: 'POST',
      body: { ...form, company: honeypot.value },
    })
    mailed.value = result.mailed
    sent.value = true
  }
  catch (err: any) {
    failMessage.value
      = err?.data?.statusMessage
      ?? `送出的時候連線斷了，資料都還在，再按一次就可以。也可以直接來電 ${BRAND.phone}。`
  }
  finally {
    sending.value = false
  }
}

function again() {
  sent.value = false
  mailed.value = null
}
</script>

<template>
  <div>
    <div class="mg-gut mg-intro pt-14">
      <h1 class="mg-h1 font-display leading-[1.08] font-medium tracking-display-md">
        和我們一起<br>
        <span class="pl-22 italic">把手藝做好</span>
      </h1>
      <p class="max-w-[440px] pt-4 text-16 leading-body text-fg-2 text-pretty">
        我們一天能接的客人不多，所以每一顆頭都要做得完整。想找的是願意慢慢做、也講得出為什麼這樣做的人。
      </p>
    </div>

    <!-- 我們是什麼樣的團隊 -->
    <section class="mg-gut mg-sect">
      <div class="mg-nums">
        <div v-for="c in CAREERS_CULTURE" :key="c.n" class="flex items-start gap-6">
          <span class="flex-none font-label text-64 leading-[.9] font-semibold tracking-[-.02em]">
            {{ c.n }}
          </span>
          <div class="flex flex-col gap-3 pt-1">
            <h2 class="font-display text-22 leading-[1.4] font-medium tracking-display-sm">
              {{ c.title }}
            </h2>
            <p class="text-15 leading-body text-fg-2 text-pretty">{{ c.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 職缺 -->
    <section v-for="job in CAREERS_JOBS" :key="job.id" class="mg-gut mg-sect">
      <div class="flex items-baseline justify-between gap-6">
        <h2 class="font-display text-40 leading-heading font-medium tracking-display-md">
          {{ job.title }}
        </h2>
        <span class="font-label text-12 font-semibold tracking-label-mid text-fg-3">
          {{ job.latin }}
        </span>
      </div>
      <dl class="mt-8 flex max-w-[720px] flex-col">
        <div
          v-for="row in job.rows"
          :key="row.k"
          class="flex items-baseline gap-6 border-t border-line-2 py-5"
        >
          <dt class="w-24 flex-none text-15 text-fg-3">{{ row.k }}</dt>
          <dd class="text-15 leading-body-snug text-pretty">{{ row.v }}</dd>
        </div>
      </dl>
    </section>

    <!-- 夥伴說 -->
    <section class="mg-gut mg-sect">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        夥伴<br>
        <span class="pl-14 italic">說</span>
      </h2>
      <div class="mg-cards2 pt-10">
        <figure v-for="v in CAREERS_VOICES" :key="v.who" class="border-t-2 border-t-line-1 pt-5 pr-8">
          <blockquote class="font-display text-20 leading-heading-loose text-fg-1 text-pretty">
            「{{ v.quote }}」
          </blockquote>
          <figcaption class="mt-4 font-label text-12 font-semibold tracking-label text-fg-3">
            — {{ v.who }}
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- 應徵 -->
    <section class="mg-gut mg-sect pb-30">
      <h2 class="mg-h2 font-display leading-heading font-medium tracking-display-md">
        應徵
      </h2>

      <div v-if="sent" class="mt-10 max-w-[560px] border border-line-1 p-8">
        <div class="font-label text-12 font-semibold tracking-label-wide text-fg-3">
          APPLICATION RECEIVED
        </div>
        <p class="mt-4 font-display text-24 leading-heading font-medium tracking-display-sm">
          收到了，{{ form.name }}。
        </p>
        <p class="mt-4 text-15 leading-body text-fg-2 text-pretty">
          我們會在 5 個工作天內回覆。這段期間你可以先看看設計師頁，那是我們平常怎麼講話的樣子。
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-8">
          <MgButton variant="secondary" to="/stylists">看設計師</MgButton>
          <MgButton variant="link" muted @click="again">再填一次</MgButton>
        </div>
        <p v-if="!mailed" class="mt-6 text-13 leading-body-snug text-fg-3 text-pretty">
          （這個環境沒有接上寄信服務，通知信沒有真的寄出去。想確定我們收到，請來電 {{ BRAND.phone }}。）
        </p>
      </div>

      <form v-else class="mt-10 flex max-w-[560px] flex-col gap-6" @submit.prevent="submit">
        <!-- 蜜罐：真人看不到也 tab 不到，填了就當成機器人擋掉 -->
        <input
          v-model="honeypot"
          type="text"
          name="company"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="absolute -left-[9999px] size-px opacity-0"
        >
        <MgInput
          v-model="form.name"
          label="姓名（必填）"
          placeholder="王小明"
          :error="nameError"
          @blur="touched.name = true"
        />
        <MgInput
          v-model="form.phone"
          label="手機（必填）"
          placeholder="0912 345 678"
          :error="phoneError"
          @blur="touched.phone = true"
        />

        <div class="flex flex-col gap-3">
          <span class="font-label text-12 font-semibold tracking-label-wide text-fg-3">
            應徵職位
          </span>
          <div class="flex flex-wrap gap-3">
            <MgButton
              v-for="job in CAREERS_JOBS"
              :key="job.id"
              :variant="form.role === job.title ? 'primary' : 'secondary'"
              size="sm"
              @click="form.role = job.title as '設計師' | '助理'"
            >
              {{ job.title }}
            </MgButton>
          </div>
        </div>

        <MgInput
          v-model="form.link"
          :label="linkRequired ? '作品集或履歷連結（必填）' : '作品集或履歷連結（選填）'"
          placeholder="https://"
          :error="linkError"
          @blur="touched.link = true"
        />
        <MgInput
          v-model="form.note"
          label="想說的話（選填）"
          placeholder="例如：想學頭皮判讀、能配合週末班"
          multiline
        />

        <label class="flex cursor-pointer items-start gap-3 text-15 leading-body-tight">
          <input v-model="form.agree" type="checkbox" class="mt-1 size-4 flex-none accent-accent">
          <span>我同意個資用於此次應徵聯繫，保存期間 6 個月（見<NuxtLink to="/privacy" class="border-b border-current">隱私權政策</NuxtLink>）</span>
        </label>

        <div class="flex flex-col items-start gap-3">
          <MgButton type="submit" :disabled="!ready || sending" @click="submit">
            {{ sending ? '送出中…' : '送出應徵' }}
          </MgButton>
          <span v-if="failMessage" class="flex items-start gap-2 text-13 leading-body-tight text-accent text-pretty">
            <span aria-hidden="true" class="font-label text-12 leading-[1.6] font-bold">!</span>
            {{ failMessage }}
          </span>
          <span v-else class="text-13 text-fg-3">
            {{ ready ? '我們會在 5 個工作天內回覆。' : '姓名、手機與同意勾選都填好才能送出。' }}
          </span>
        </div>
      </form>
    </section>
  </div>
</template>
