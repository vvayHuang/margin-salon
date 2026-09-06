import {
  MENU,
  NO_ROOM_DAY,
  WEEKDAY,
  dateText,
  findStylist,
  hoursText,
  money,
  phoneBad,
  type CategoryId,
  type StylistId,
} from '#shared/margin'
import {
  BOOKING_MONTH,
  bookingDate,
  emailBad,
  type AvailabilityResponse,
  type BookingResult,
  type SlotsResponse,
} from '#shared/booking'

export interface BookingState {
  who: StylistId | 'any' | ''
  step: number
  cat: CategoryId
  picked: string[]
  day: number
  time: string
  loading: boolean
  name: string
  phone: string
  email: string
  note: string
  first: '是' | '否'
  len: '短' | '中長' | '長'
  touched: boolean
  /** 送出中，按鈕停用避免重複送出 */
  sending: boolean
  /** 已經送出過一次（示範模式的邊界狀態只演一次，重送就會成功） */
  tried: boolean
}

function blank(): BookingState {
  return {
    who: 'yuki',
    step: 1,
    cat: 'cut',
    picked: [],
    day: 0,
    time: '',
    loading: false,
    name: '',
    phone: '',
    email: '',
    note: '',
    first: '是',
    len: '中長',
    touched: false,
    sending: false,
    tried: false,
  }
}

/** 送出失敗的兩種結果：時段被搶走（可換時間重送）／其他錯誤（原地重試） */
export interface BookingFailure {
  taken: boolean
  message: string
}

/**
 * 預約流程的狀態。跨 /booking 與 /booking/done 兩個路由，所以放在 useState。
 * 版面邏輯逐條對照 `Works Page Hi-Fi.dc.html` 的 DCLogic；
 * 空檔與送出改走 `/api/booking/*`（PRD F-06），後端沒接上預約系統時
 * 那幾支 API 會回站上的示範資料，所以這裡不需要分兩套。
 */
export function useBooking() {
  const state = useState<BookingState>('mg-booking', blank)
  /** 送出成功後的收據。/booking/done 讀這個，工作中的狀態就可以立刻清乾淨。 */
  const receipt = useState<BookingResult | null>('mg-booking-receipt', () => null)
  /** 月曆的日期狀態與當日時段，都由後端給 */
  const month = useState<AvailabilityResponse | null>('mg-booking-month', () => null)
  const daySlots = useState<SlotsResponse | null>('mg-booking-slots', () => null)

  const totals = computed(() => {
    const rows = MENU.filter(m => state.value.picked.includes(m.id))
    return {
      rows,
      minutes: rows.reduce((a, b) => a + b.minutes, 0),
      price: rows.reduce((a, b) => a + b.price, 0),
    }
  })

  const stylist = computed(() => findStylist(state.value.who))
  const stylistText = computed(() =>
    state.value.who === 'any' ? '不指定' : (stylist.value?.label ?? ''),
  )
  const serviceText = computed(() => totals.value.rows.map(r => r.name).join('＋'))
  const timeText = computed(() =>
    state.value.day && state.value.time
      ? `${dateText(state.value.day)} ${state.value.time}`
      : '',
  )

  /** 這一站是不是真的接上 Google 日曆。示範模式下才演那三種邊界狀態。 */
  const live = computed(() => month.value?.live ?? false)

  /**
   * 選到的那天排不進所選服務。
   * 判斷是「沒有任何一個可約的時段」，不是「時段清單是空的」——
   * 接上日曆之後已滿的時段照樣會回傳（PRD §6.9：已滿顯示為停用態，不隱藏）。
   */
  const dayFull = computed(() =>
    !!state.value.day
    && !state.value.loading
    && !(daySlots.value?.times ?? []).some(slot => slot.state === 'available'),
  )

  /** 服務越久，最後可開始的時間越早 */
  const lastStart = computed(() =>
    totals.value.minutes > 180 ? '16:30' : totals.value.minutes > 90 ? '17:30' : '18:00',
  )

  const stepReady = computed<Record<number, boolean>>(() => ({
    1: !!state.value.who,
    2: totals.value.rows.length > 0,
    3: !!state.value.day && !!state.value.time,
    4:
      !!state.value.name.trim()
      && !phoneBad(state.value.phone)
      && !emailBad(state.value.email),
    5: !state.value.sending,
  }))

  const blockReason = computed(
    () =>
      ({
        1: '未選擇設計師時停用',
        2: '未選擇服務項目時停用',
        3: state.value.day ? '未選擇時段時停用' : '未選擇日期時停用',
        4: '姓名、手機與 Email 填完才能繼續',
        5: state.value.sending ? '送出中，不要重複按' : '',
      })[state.value.step] ?? '',
  )

  const ready = computed(() => stepReady.value[state.value.step] ?? false)

  /* ---------------------------------------------------------------- 空檔 */

  function serviceQuery() {
    return {
      stylist: state.value.who || 'any',
      services: state.value.picked.join(','),
    }
  }

  /**
   * 進第三步、或設計師／服務項目換了的時候重抓整個月。
   * 這兩支都不讓錯誤往外冒 —— 它們是從 template 的事件處理器叫的，
   * 丟出去只會變成沒人接的 rejection。抓不到就維持原本畫得出來的東西。
   */
  async function loadMonth() {
    try {
      month.value = await $fetch<AvailabilityResponse>('/api/booking/availability', {
        query: { month: BOOKING_MONTH, ...serviceQuery() },
      })
    }
    catch {
      // 保留上一次抓到的月曆；第一次就失敗的話畫面是空月曆，按不下去也不會誤導。
    }
  }

  async function pickDay(day: number) {
    const cell = month.value?.days.find(d => d.day === day)
    if (!cell || cell.state !== 'available') return

    state.value.day = day
    state.value.time = ''
    state.value.loading = true
    try {
      daySlots.value = await $fetch<SlotsResponse>('/api/booking/slots', {
        query: { date: bookingDate(day), ...serviceQuery() },
      })
    }
    catch {
      // 抓不到當天的時段就當成沒有空檔，右側會出現「沒有空檔」與來電的出口。
      daySlots.value = { date: bookingDate(day), times: [], alternatives: [], live: live.value }
    }
    finally {
      state.value.loading = false
    }
  }

  function toggleService(id: string) {
    const picked = state.value.picked
    state.value.picked = picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id]
    // 換了服務項目，原本選的時段可能已經接不下來，重選。
    state.value.day = 0
    state.value.time = ''
    daySlots.value = null
  }

  /* ---------------------------------------------------------------- 步驟 */

  async function next() {
    if (state.value.step === 4) {
      state.value.touched = true
      if (!stepReady.value[4]) return false
    }
    if (state.value.step < 5) {
      state.value.step += 1
      state.value.touched = false
      if (state.value.step === 3) await loadMonth()
      if (import.meta.client) window.scrollTo(0, 0)
    }
    return true
  }

  function goStep(step: number) {
    if (step < state.value.step) {
      state.value.step = step
      if (import.meta.client) window.scrollTo(0, 0)
    }
  }

  function prevStep() {
    if (state.value.step > 1) {
      state.value.step -= 1
      if (import.meta.client) window.scrollTo(0, 0)
    }
  }

  function reset(patch: Partial<BookingState> = {}) {
    state.value = { ...blank(), ...patch }
    daySlots.value = null
  }

  /** 送出後的整理格式：2026／09／10（四）14:00 */
  const confirmTime = computed(() =>
    timeText.value
      ? `2026／09／${String(state.value.day).padStart(2, '0')}（${WEEKDAY[state.value.day % 7]}）${state.value.time}`
      : '尚未選擇',
  )

  /**
   * 真的把預約送出去。成功就留下收據、把流程狀態清掉，
   * 下次進 /booking 就是全新的一次；失敗回一個 BookingFailure 讓畫面決定怎麼演。
   */
  async function submit(): Promise<BookingFailure | null> {
    if (state.value.sending) return null
    state.value.sending = true
    try {
      receipt.value = await $fetch<BookingResult>('/api/booking', {
        method: 'POST',
        body: {
          stylist: state.value.who,
          services: state.value.picked,
          date: bookingDate(state.value.day),
          time: state.value.time,
          name: state.value.name,
          phone: state.value.phone,
          email: state.value.email,
          note: state.value.note,
          first: state.value.first,
          len: state.value.len,
        },
      })
      reset()
      return null
    }
    catch (err: any) {
      state.value.tried = true
      return {
        taken: !!err?.data?.data?.taken,
        message:
          err?.data?.statusMessage
          ?? err?.statusMessage
          ?? '送出的時候連線斷了，預約沒有成立。再按一次送出就可以，資料都還在。',
      }
    }
    finally {
      state.value.sending = false
    }
  }

  return {
    state,
    receipt,
    month,
    daySlots,
    live,
    submit,
    totals,
    stylist,
    stylistText,
    serviceText,
    timeText,
    confirmTime,
    dayFull,
    lastStart,
    ready,
    blockReason,
    loadMonth,
    pickDay,
    toggleService,
    next,
    goStep,
    prevStep,
    reset,
    hoursText,
    money,
    NO_ROOM_DAY,
  }
}
