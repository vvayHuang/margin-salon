import {
  CLOSED_DAYS,
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
  note: string
  first: '是' | '否'
  len: '短' | '中長' | '長'
  touched: boolean
  /** 已經送出過一次（邊界狀態只出現一次，重送就會成功） */
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
    note: '',
    first: '是',
    len: '中長',
    touched: false,
    tried: false,
  }
}

export interface BookingReceipt {
  stylist: string
  service: string
  time: string
  price: number
}

/**
 * 預約流程的狀態。跨 /booking 與 /booking/done 兩個路由，所以放在 useState。
 * 邏輯逐條對照 `Works Page Hi-Fi.dc.html` 的 DCLogic。
 */
export function useBooking() {
  const state = useState<BookingState>('mg-booking', blank)
  /** 送出成功後的快照。/booking/done 讀這個，工作中的狀態就可以立刻清乾淨。 */
  const receipt = useState<BookingReceipt | null>('mg-booking-receipt', () => null)

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
  const dayFull = computed(() => state.value.day === NO_ROOM_DAY)

  /** 服務越久，最後可開始的時間越早 */
  const lastStart = computed(() =>
    totals.value.minutes > 180 ? '16:30' : totals.value.minutes > 90 ? '17:30' : '18:00',
  )

  const stepReady = computed<Record<number, boolean>>(() => ({
    1: !!state.value.who,
    2: totals.value.rows.length > 0,
    3: !!state.value.day && !!state.value.time,
    4: !!state.value.name.trim() && !phoneBad(state.value.phone),
    5: true,
  }))

  const blockReason = computed(
    () =>
      ({
        1: '未選擇設計師時停用',
        2: '未選擇服務項目時停用',
        3: state.value.day ? '未選擇時段時停用' : '未選擇日期時停用',
        4: '姓名與手機填完才能繼續',
        5: '',
      })[state.value.step] ?? '',
  )

  const ready = computed(() => stepReady.value[state.value.step] ?? false)

  let timer: ReturnType<typeof setTimeout> | undefined
  function pickDay(day: number) {
    if (CLOSED_DAYS.includes(day)) return
    state.value.day = day
    state.value.time = ''
    state.value.loading = true
    clearTimeout(timer)
    timer = setTimeout(() => (state.value.loading = false), 700)
  }

  function toggleService(id: string) {
    const picked = state.value.picked
    state.value.picked = picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id]
  }

  function next() {
    if (state.value.step === 4) {
      state.value.touched = true
      if (!state.value.name.trim() || phoneBad(state.value.phone)) return false
    }
    if (state.value.step < 5) {
      state.value.step += 1
      state.value.touched = false
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
  }

  /** 送出後的整理格式：2026／09／10（四）14:00 */
  const confirmTime = computed(() =>
    timeText.value
      ? `2026／09／${String(state.value.day).padStart(2, '0')}（${WEEKDAY[state.value.day % 7]}）${state.value.time}`
      : '尚未選擇',
  )

  /** 送出成功：留下收據、把流程狀態清掉，下次進 /booking 就是全新的一次。 */
  function complete() {
    receipt.value = {
      stylist: stylistText.value,
      service: serviceText.value,
      time: timeText.value,
      price: totals.value.price,
    }
    reset()
  }

  return {
    state,
    receipt,
    complete,
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
    pickDay,
    toggleService,
    next,
    goStep,
    prevStep,
    reset,
    hoursText,
    money,
  }
}
