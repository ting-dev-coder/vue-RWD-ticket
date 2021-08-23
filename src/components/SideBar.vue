<template>
  <div class="mask" v-show="dispaly" @click="$emit('update:modelValue', false)"/>
  <div
    class="sideBar px-3"
    :class="{active:dispaly}"
  >
    <header class="d-flex justify-content-between align-items-center mb-4 py-2 border-bottom">
      <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="$emit('update:modelValue', false)"></button>
      <h2 class="text-gray-300 mb-0">購物車</h2>
    </header>
    <div v-if="list.length === 0">
      <p>尚未有門票</p>
      <a
        href="#"
        src="/shopping/order"
        class="btn bg-primary mt-2"
        @click.prevent="$emit('hiddePopover','Order')"
        >訂票去</a>
    </div>
    <ul class="list-wrap" v-else>
      <li v-for="(item, idx) in list" :key="'item_' + idx" class="list my-4 row">
        <div class="col-4 avatar" :style="`background-image: url(${item.product.imageUrl})`"></div>
        <div class="px-3 text-start text-white col-6">
          <h4 class="fs-6 mb-3 text-white">{{ item.product.title }}</h4>
          <div class="mb-3">
            <a href="#" class="text-white px-2 align-middle fs-5" type="button" :class="{ disabled: item.qty <= 1 }"   @click.prevent="changeQty(item, -1)">-</a>
              <input
                type="number"
                v-model="item.qty"
                min="0"
                class="text-gray-800 text-center fs-5"
                aria-describedby="inputGroup-sizing-default"
              />
            <a href="#" class="text-white px-2 align-middle fs-5" type="button"  @click.prevent="changeQty(item, +1)">+</a>
          </div>
          <p class="fs-5">NT$ {{ item.total }}</p>
        </div>
        <div class="fs-5 col-2 d-flex justify-content-center align-items-center" @click="onDelProductlClick(item)"><font-awesome-icon class="pointer"  icon="trash-alt" /></div>
      </li>
    </ul>
    <div class="border-top">
      <p>合計: {{ total }}</p>
      <button class="w-100 border-0 btn bg-primary" @click="$emit('hiddePopover','Cart')" type="button">
        檢視購物車
      </button>
    </div>
  </div>
</template>

<script>
import { watch, ref, reactive, toRefs } from 'vue'

import { UpdateCart, DelSingleProduct } from '@/API/ShoppingCart'

import emitter from '@/utils/Bus'
import { Toast } from '@/utils/UseSwal'

export default {
  props: {
    carts: {
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: Boolean,
      default: () => false
    }
  },
  setup (props) {
    const { modelValue } = toRefs(props)
    const list = reactive([])
    const total = ref(0)
    const dispaly = ref(false)
    watch(props.carts, (newVal) => {
      total.value = newVal.total
      list.length = 0
      list.push(...newVal.list)
    }, { immediate: true })
    watch(modelValue, (newVal) => {
      dispaly.value = newVal
    })
    const changeQty = (i, operation) => {
      i.qty = i.qty + operation
      const data = {
        product_id: i.id,
        qty: i.qty
      }
      UpdateCart(data).then(res => {
        if (!res) return
        emitter.emit('product-cart')
      })
    }
    const onDelProductlClick = item => {
      DelSingleProduct(item.id).then(res => {
        if (!res) return
        emitter.emit('product-cart')
        Toast.fire({ icon: 'success', title: '商品已移除' })
      })
    }
    return { total, list, dispaly, changeQty, onDelProductlClick }
  }
}
</script>

<style lang="sass" scoped>
.mask
  z-index: 1
  position:  absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: #000
  opacity: 0.8
</style>
