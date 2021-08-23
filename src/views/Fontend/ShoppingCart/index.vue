<template>
  <div class="container mx-auto">
    <Steps :step="0" />
    <section class="row">
      <Form
        ref="form"
        class="col-md-5 col-12 px-md-4 px-2 rounded-2 shadow order-last mt-4 mt-md-0 order-md-first"
        v-slot="{ errors }"
        @submit="onCheckoutClick"
      >
        <h4 class="text-start font-weight-bold">聯絡資訊</h4>
        <div v-for="(item, idx) in formVal" :key="`form_${idx}`">
          <label :for="item.name" class="text-start py-1">
            <span class="text-danger">*</span>
            {{ item.name }}
          </label>
          <Field
            :id="item.name"
            :name="item.name"
            :type="item.type"
            class="form-control rounded-2"
            :class="{ 'is-invalid': errors[item.name] }"
            :placeholder="item.placeholder"
            :rules="item.rules"
            v-model="formData.user[item.text]"
          />
          <ErrorMessage :name="item.name" class="invalid-feedback text-start" />
        </div>
        <div class="msg_wrap">
          <label for="message" class="text-start py-1">留言</label>
          <textarea
            name="message"
            id="message"
            class="form-control rounded-2"
            cols="20"
            rows="5"
            v-model="formData.message"
          />
        </div>
        <button type="submit" class="btn btn-primary my-4" >送出訂單</button>
      </Form>
      <Cart ref="cart" class="col-md-7 col-12" />
    </section>

    <h3 class="text-start pt-5 font-weight-bold my-5">其他人也買了...</h3>
    <ItemsList ref="productList" :isShowAddBtn="true" :items="random" :loading="productsLoading" @onAddCartClick="onAddCartClick"/>
  </div>
</template>

<script>

import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import emitter from '@/utils/Bus'
import { Toast } from '@/utils/UseSwal'
import { getRandomInt } from '@/utils/Mixin'

import { Order, GetAllProduct, AddCart } from '@/API/ShoppingCart'

import ItemsList from '@components/Items.vue'
import Cart from './Cart.vue'
import Steps from './Steps.vue'

const isPhone = value => {
  const phoneNumber = /^(09)[0-9]{8}$/
  return phoneNumber.test(value) ? true : '請填入正確手機格式'
}

export default {
  name: 'BuyerInfo',
  components: { Cart, Steps, ItemsList },
  setup () {
    const router = useRouter()
    const formVal = reactive([
      {
        name: 'Email',
        text: 'email',
        type: 'email',
        placeholder: '請輸入信箱',
        rules: 'email|required'
      },
      {
        name: '姓名',
        text: 'name',
        type: 'text',
        placeholder: '請輸入姓名',
        rules: 'required'
      },
      {
        name: '電話',
        text: 'tel',
        type: 'tel',
        placeholder: '請輸入 收件人電話',
        rules: isPhone
      },
      {
        name: '地址',
        text: 'address',
        type: 'text',
        placeholder: '請輸入 收件人地址',
        rules: 'required'
      }
    ])
    const formData = reactive({
      user: {
        name: '',
        email: '',
        tel: '',
        address: ''
      },
      message: ''
    })
    const cart = ref(null)
    onMounted(() => {
      getList()
    })
    const loading = reactive({
      productsLoading: false,
      recommendProductLoading: ''
    })
    const getList = () => {
      loading.productsLoading = true
      GetAllProduct()
        .then(res => {
          loading.productsLoading = false
          if (!res) return
          const data = res.data
          getRadomProducts(data.products)
        })
        .catch(error => {
          console.log(error)
        })
    }
    const random = reactive([])
    const getRadomProducts = arr => {
      const filter = arr.filter(i => i.rate === 5)
      const arrSet = new Set([])
      const max = filter.length < 12 ? filter.length : 12
      for (let index = 0; arrSet.size < max; index++) {
        const num = getRandomInt(max)
        arrSet.add(num)
      }
      arrSet.forEach(i => {
        random.push(filter[i])
      })
    }
    const productList = ref(null)
    const onAddCartClick = (item) => {
      console.log('點', item.id)
      productList.value.loadingItem = item.id
      AddCart({ product_id: item.id, qty: 1 }).then(res => {
        productList.value.loadingItem = ''
        if (!res) return
        emitter.emit('product-cart')
        cart.value.getCartData()
        Toast.fire({ icon: 'success', title: '商品已加入購物車' })
      })
    }
    const onCheckoutClick = () => {
      if (cart.value.item.list.length === 0) {
        Toast.fire({
          icon: 'error',
          title: '購物車商品目前沒有商品'
        })
      }
      Order(formData).then(res => {
        if (!res) return
        const data = res.data
        router.push({
          name: 'CheckoutOrder',
          query: { orderID: data.orderId }
        })
      })
    }
    return {
      formData,
      cart,
      productList,
      onCheckoutClick,
      formVal,
      isPhone,
      random,
      onAddCartClick
    }
  }
}
</script>

<style lang="sass" scoped>
label
  width: 100%
</style>
