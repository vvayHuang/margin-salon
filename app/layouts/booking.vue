<template>
  <!-- 預約流程是一個關起來的房間：沒有導覽連結，也沒有頁尾。
       只留一行概念作品聲明——這裡是全站唯一會填個資的地方，不能看不到。 -->
  <div class="flex min-h-screen flex-col bg-surface-0 font-body text-fg-1">
    <MgNav variant="booking" close-to="/works" />
    <main class="flex-1">
      <slot />
    </main>
    <p class="border-t border-line-2 px-4 py-4 text-12 text-fg-3 md:px-12">
      概念作品，非真實店家，請勿填寫真實個資
    </p>
  </div>
</template>
