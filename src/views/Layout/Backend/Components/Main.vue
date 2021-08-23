<template>
  <div class="backend-main p-4 d-flex">
    <div class="content bg-white w-100">
      <router-view class="view" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.backend-main
  height: calc(100% - 40px)
  overflow: auto
  .content
    position: relative
    min-height: 100%
</style>
