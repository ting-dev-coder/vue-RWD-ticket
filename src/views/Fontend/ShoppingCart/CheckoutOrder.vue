<template>
  <div class="container mx-auto">
  <Steps :step="1" />
    <div class="py-4">
      <div class="border shadow  p-3 mb-3 mx-auto">
        <h3 class="text-start">購物明細</h3>
        <ul class="">
          <li
            class="row fs-6 pb-3"
            v-for="item in order.products"
            :key="item.id"
            :class="{ 'alert-secondary': i % 2 == 0 }"
          >
            <p class="col-8">{{ item.product.title }} x {{ item.qty }} {{ item.product.unit }}</p>
           <span class="col-4 text-end"> $ {{ Math.floor(item.final_total) }}</span>
          </li>
        </ul>
        <div class="row fs-6 py-3 border-top">
          <p class="col-8">訂單編號:</p>
            <span class="col-4 text-end"> {{ order.id }} </span>
            <p class="col-8">訂單狀態:</p>
            <span
              class="col-4 rounded lead text-white px-3 fs-6 bg-gray-800"
            >{{ order.is_paid ? "已付款" : "未付款" }}</span>
        </div>
        <div class="d-flex border-top justify-content-end">
          <p class=" text-black text-nowrap">
            合計 : $
            <span class="font-weight-bold display-4">
              {{ Math.floor(order.total) }}</span>
          </p>
        </div>
      </div>
      <div class="user_info bg-light-yellow p-4">
        <div
          class="d-flex align-items-center justify-content-between mb-3 pb-3"
        >
          <h5
            class="text-gray-800 fs-5 pe-2 text-nowrap"
            >訂購人</h5>
          <p class="text-end  fs-5">{{ order.user.name }}</p>
        </div>
        <div
          class="d-flex align-items-center justify-content-between mb-3 pb-3"
        >
          <h5
            class="text-gray-800 fs-5 pe-2 text-nowrap"
            >電話</h5>
          <p class="text-end fs-5">{{ order.user.tel }}</p>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3 pb-3 ">
          <h5
            class="text-gray-800 fs-5 pe-2 text-nowrap"
            >地址</h5>
          <p class="text-end fs-5">{{ order.user.address }}</p>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3 pb-3">
          <h5
            class="text-gray-800 fs-5 pe-2 text-nowrap"
            >信箱</h5>
          <p class="text-end fs-5">{{ order.user.email }}</p>
        </div>
        <div
          class="d-flex align-items-center justify-content-between mb-3 pb-3"
        >
          <h5
            class="text-gray-800 fs-5 pe-2 text-nowrap"
            >備註:</h5>
          <p class="text-end fs-5">{{ order.message || "無" }}</p>
        </div>
      </div>
    </div>
  </div>
  <button
    :disabled="order.is_paid"
    type="button"
    class="btn btn-primary mt-4"
    @click="payNow"
  >
    確認付款
  </button>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { ConfirmOrder, Checkout } from '@/API/ShoppingCart'

import { dateFormmater } from '@/utils/Mixin'
import emitter from '@/utils/Bus'

import Steps from './Steps.vue'

export default {
  name: 'CheckoutOrder',
  components: { Steps },
  setup () {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const orderID = ref('')
    onMounted(() => {
      orderID.value = route.query.orderID
      getOrderDetail()
    })
    const order = reactive({
      user: {},
      id: '',
      is_paid: false,
      create_at: '',
      total: 0
    })
    const getOrderDetail = () => {
      ConfirmOrder(orderID.value).then(res => {
        if (!res) return
        const data = res.data
        Object.assign(order, data.order)
      })
    }
    const payNow = () => {
      store.commit('SET_LOADING', true)
      Checkout(orderID.value).then(res => {
        store.commit('SET_LOADING', false)
        if (!res) return
        emitter.emit('product-cart')
        router.replace({ name: 'PaymentComplete' })
      })
    }
    return { payNow, order, dateFormmater }
  }
}
</script>

<style lang="sass" scoped>
.tail::before
  content: ''
  width: 1px
  background-image: linear-gradient(to bottom,#ccc 0%,#ccc 50%,transparent 50%)
  background-size: 2px 20px
  background-repeat: repeat-y

.user_info_wrap
  position: relative
.user_info_wrap::after
  content: ''
  z-index: 2021
  position: absolute
  left: 0
  bottom: 0
  width: 100%
  height: 2px
  background-image: linear-gradient(to right, #0d5cf3 0%, #327ff7 50%, transparent 50%);
  background-size: 20px 2px
  background-repeat: repeat-x

.user_info
  box-sizing: border-box
  margin: auto
  border-radius: 5px
</style>
