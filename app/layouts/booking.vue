<template>
  <!-- 預約流程是一個關起來的房間：沒有導覽連結，也沒有頁尾。 -->
  <div class="flex min-h-screen flex-col bg-surface-0 font-body text-fg-1">
    <MgNav variant="booking" close-to="/works" />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
