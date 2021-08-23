<template>
  <nav v-show="msg.show">
    <div
      class="alert alert-danger"
      role="alert"
      v-for="(item, idx) in msg.list"
      :key="`alert_ ${idx}`"
    >
      {{ item }}
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    msg: Object
  }
}
</script>

<style scoped lang="sass">
nav
  z-index: 2021
  position: absolute
  top: 0
  width: 100%
  transition: all 1s
.alert
  margin-bottom: 5px
  padding: 10px
  font-size: 18px
  text-align: center
</style>
