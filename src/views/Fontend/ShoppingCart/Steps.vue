<template>
  <a-steps v-model:current="current" type="navigation" :style="stepStyle">
    <a-step title="填寫訂購人資訊" disabled />
    <a-step title="確認訂單" disabled />
    <a-step title="完成訂購" disabled />
  </a-steps>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

export default {
  name: 'Skeleton',
  props: {
    step: {
      type: Number,
      require: true
    }
  },
  setup (props) {
    const current = ref(0)
    const stepStyle = reactive({
      marginBottom: '60px',
      boxShadow: '0px -1px 0 0 #e8e8e8 inset'
    })
    onMounted(() => {
      current.value = props.step
    })
    return { current, stepStyle }
  }
}
</script>
