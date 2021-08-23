<template>
  <div class="container">
    <a-breadcrumb class="text-start py-4 fs-5">
      <a-breadcrumb-item>
        <font-awesome-icon icon="long-arrow-alt-left" />
        <router-link to="/shopping/order" class=""> 訂票去 </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>購票</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="d-flex flex-column flex-md-row">
      <section
        class="
          d-flex
          border
          bg-white
          w-100
          w-md-40
          order-1
          order-md-0
        "
      >
        <div class="col-1 h-100 info-container d-none d-md-block"></div>
        <div class="col-11 px-4 pt-5 text-center d-flex flex-column flex-start">
          <h2 class="text-start font-weight-bold fs-3">{{ item.title }}</h2>
          <p class="fs-6 text-gray-800 text-start py-3 flex-grow-1">{{ item.description }}</p>
          <hr />
          <p class="text-center mb-2 text-nowrap fs-5">
           NTD
           <span class="fs-3" :class="{'text-warning': item.price !== item.origin_price}">{{ item.price }}</span>
           <span v-if="item.price !== item.origin_price"> /<del>{{ item.origin_price }} </del></span>
          </p>
          <div class="input-wrap m-auto mb-3">
            <button class="btn border" type="button" :class="{ disabled: amount <= 1 }"   @click="changeQty(-1)">-</button>
            <input
              type="number"
              v-model="amount"
              min="0"
              class="input text-center"
              aria-describedby="inputGroup-sizing-default"
            />
            <button class="btn border" type="button"  @click="changeQty(+1)">+</button>
            <a
              href="#"
              class="pointer ms-2 btn-primary p-2"
              :class="{ disabled: amount <= 0 }"
              @click.prevent="onAddCartClick()"
            >
              加入購物車
            </a>
          </div>
        </div>
      </section>
      <div class="position-relative col" id="main_pic">
        <img
          :src="item.imageUrl"
          alt="產品主要圖片"
          class="avatar w-100 h-100 img-cover"
        />
      </div>
    </div>
    <section class="d-flex my-5">
      <div class="shadow pb-3 w-100 w-md-70 text-start p-3 p-md-4">
        <div class="bg-white ">
          <h3 class="pb-4 text-title">關於作品:</h3>
          <p style="letter-spacing: 3px;">{{ item.content }}</p>
          <div class="divider">
            <span class="text-title">活動資訊</span>
          </div>
          <pre>
演出日期：2022年8月22-23日(日/一)、2022年8月26-27日(四/五)
演出時間：20:00
演出地點： MUSIC ZONE＠E-MAX
演出地址：台北南港展覽館1館
<span class="text-danger font-weight-bold h5">※ 防疫人人有責：</span>
★本活動會因應政府對疫情的控制與變化所為的行政行為，而適時調整相關資訊與規範，請您諒解與留意 ★
        </pre>
          <Map class="mb-5" />
          <QuestionBars />
        </div>
      </div>
      <div
        class="w-40 w-md-20 d-none d-md-block position-fixed top-10 end-10"
      >
        <a-card :title="item.title" class="w-100" v-show="showPaenl" :bodyStyle="{ padding: '0'}" :headStyle="{ padding: '0'}">
          <p class="text-start text-nowrap fs-5">
            NTD
            <span
              class="fs-3"
              :class="{ 'text-warning': item.price !== item.origin_price }"
              >{{ item.price }}</span>
            <span v-if="item.price !== item.origin_price">
              /<del>{{ item.origin_price }} </del></span>
          </p>
          <div class="input-wrap m-auto mb-3">
            <div class="d-flex me-2">
              <button class="btn border" type="button" :class="{ disabled: amount <= 1 }"   @click="changeQty(-1)">-</button>
              <input
                type="number"
                v-model="amount"
                min="0"
                class="input text-center"
                aria-describedby="inputGroup-sizing-default"
              />
              <button class="btn border" type="button"  @click="changeQty(+1)">+</button>
            </div>
            <a
              href="#"
              class="pointer btn-primary p-2 text-nowrap"
              :class="{ disabled: amount <= 0 }"
              @click.prevent="onAddCartClick()"
            >
            加入購物車
          </a>
          </div>
        </a-card>
      </div>
    </section>
    <h3 class="text-start pb-5 text-title" id="recommend">
      你可能也會喜歡⋯
    </h3>
    <ItemsList :items="random" :loading="productsLoading" />
  </div>
</template>

<script>
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import QuestionBars from '@/components/QuestionBars.vue'
import Map from '@/components/GoogleMap.vue'
import ItemsList from '@components/Items.vue'

import { GetSingleProduct, AddCart, GetAllProduct } from '@/API/ShoppingCart'

import emitter from '@/utils/Bus'
import { getRandomInt } from '@/utils/Mixin'
import { Toast } from '@/utils/UseSwal'

export default {
  name: 'ItemDetail',
  components: {
    Map,
    ItemsList,
    QuestionBars
  },
  setup () {
    const route = useRoute()
    const showPaenl = ref(false)
    const watchScroll = () => {
      const screenTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset
      const targetHeight = document.getElementById('main_pic').clientHeight
      const targetEnd = document.getElementById('recommend').offsetTop
      showPaenl.value = screenTop > targetHeight && screenTop < targetEnd - 200
    }
    onMounted(() => {
      item.id = route.query.id
      getData(item.id)
      window.addEventListener('scroll', watchScroll, true)
    })
    watch(
      () => route.query,
      (val) => {
        // 防止點擊上一頁時query也會更動而觸發
        if (!val.id) return
        getData(val.id)
        document.getElementById('app').scrollIntoView(0, 0)
      }
    )
    onUnmounted(() => {
      window.removeEventListener('scroll', watchScroll, true)
    })
    const item = reactive({ id: '', imgs: [] })
    const getData = ID => {
      console.log('getdata')
      GetSingleProduct(ID).then(res => {
        if (!res) return
        const data = res.data
        Object.assign(item, data.product)
        getRelevantProducts()
      })
    }
    const productsLoading = ref(false)
    const getRelevantProducts = () => {
      productsLoading.value = true
      GetAllProduct()
        .then(res => {
          productsLoading.value = false
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
      const filter = arr.filter(i => i.category === item.category)
      const arrSet = new Set([])
      const max = filter.length < 4 ? filter.length : 4
      for (let index = 0; arrSet.size < max; index++) {
        const num = getRandomInt(max)
        arrSet.add(num)
      }
      // 每次都先清空數組
      random.length = 0
      arrSet.forEach(i => {
        random.push(filter[i])
      })
    }
    const amount = ref(1)
    const changeQty = (qty) => {
      amount.value += qty
    }
    const onAddCartClick = () => {
      AddCart({ product_id: item.id, qty: parseInt(amount.value) }).then(
        res => {
          if (!res) return
          emitter.emit('product-cart')
          Toast.fire({ icon: 'success', title: '商品已加入購物車' })
        }
      )
    }

    return {
      productsLoading,
      random,
      watchScroll,
      item,
      amount,
      onAddCartClick,
      showPaenl,
      changeQty
    }
  }
}
</script>

<style lang="sass" scoped>
.ant-card
  &>>> .ant-card-body
  padding: 1rem

.view_item
  z-index: 2021
  box-sizing: border-box
  position: absolute
  inset: 0
  padding: 20px
  width: 70vw
  height: 65vh
  background: #fff
  margin: auto
.mask
  position: absolute
  inset: 0
  width: 100vw
  height: 100vh
  background: rgba(0,0,0, 0.7)
.avatar, .item_details
  flex: 0 0 auto
  width: 50%
.item_details
  box-sizing: border-box
  padding-left: 50px

.input-wrap
  position: relative
  display: flex
  flex-wrap: wrap
  .input, button
    width: 36px
    height: 36px
    border-radius: 0
  .input
    border-top: 1px solid #dee2e6
    border-bottom: 1px solid #dee2e6

.info-container
  position: relative
.info-container::before
  content: 'TICKET'
  position: absolute
  top: 50%
  left: 5PX
  transform: translateY(-50%)
  font-size: 24px
  writing-mode: vertical-rl
.info-container::after
  content: ''
  z-index: 20
  position: absolute
  top: 0
  width: 3px
  left: 40px
  height: 100%
  background-image: linear-gradient(to bottom,#9d9d9d 0%,#9d9d9d 50%,transparent 50%)
  background-size: 3px 18px
  background-repeat: repeat-y
</style>
