<template>
  <Steps :step="2" />
  <a-result status="success" title="付款完成" sub-title="感謝您的付款!">
    <template #extra>
      <a-button key="console" class="bg-primary"><router-link :to="{ name: 'Order' }">繼續購票</router-link></a-button>
    </template>
  </a-result>
</template>

<script>
import Steps from './ShoppingCart/Steps.vue'

export default {
  name: 'PaymentComplete',
  components: { Steps }
}
</script>
