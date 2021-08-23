<template>
  <div v-if="pictures[route.name]">
      <h2 class=" position-absolute bg-white translate-middle top-50 start-50 p-5">{{pictures[route.name].name}}</h2>
      <img :src="pictures[route.name].path" :alt="`${route.name}_banner`" style="height:300px" class="main-banner w-100 img-cover">
  </div>

</template>

<script>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'MainBanner',
  props: {
    slides: {
      type: Object,
      require: true
    }
  },
  setup (props) {
    const route = useRoute()
    const pictures = reactive([])
    watch(
      props.slides,
      (newVal, oldValue) => {
        Object.assign(pictures, newVal)
      },
      { immediate: true }
    )
    return { pictures, route }
  }
}
</script>

<style lang="sass" scoped>
/* For demo */
.ant-carousel :deep(.slick-slide)
  text-align: center
  height: 48vw
  line-height: 48vw
  background: #364d79
  overflow: hidden
  div
    width: 100%
    height: 100%

.ant-carousel :deep(.slick-slide h3)
  color: #fff
</style>
