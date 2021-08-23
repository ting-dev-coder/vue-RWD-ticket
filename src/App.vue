<template>
  <router-view id="view_one" />
  <img
    src="@imgs/loading.jpg"
    alt="loading"
    class="loading"
    v-if="store.state.laoding"
  />
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'APP',
  setup () {
    const store = useStore()
    return { store }
  }
}
</script>

<style lang="sass">

body, html
  width: 100vw
  height: 100%
  overflow-x: hidden!important

#app
  width: 100%
  font-size: 14px
  font-family: "Noto Sans SC", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;
  font-smoothing: grayscale
  text-align: center
  color: $gray-800

.router_view
  position: relative
.loading
  z-index: 2050
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  margin: auto
  width: 10vw
.swal2-container
  z-index: 99999!important
</style>
