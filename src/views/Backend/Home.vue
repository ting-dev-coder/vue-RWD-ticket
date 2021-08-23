<template>
  <div class="home-wrap d-flex px-lg-5 px-0 px-lg-1 flex-lg-row flex-column">
    <div
      class="main_wrap w-100 w-lg-70 d-flex flex-column"
    >
      <div
        class="bg-white d-flex justify-content-between align-items-end shadow"
      >
        <img src="~@imgs/shoppingA.png" alt="實體店消費" class="w-30"/>
        <div class="py-5 py-lg-0 align-self-center">
          <h4 class="text-center fs-5 flex-none">
            歡迎:
            <span class="time d-block fs-6">現在時間:{{ new Date().getHours() }} :
              {{ new Date().getMinutes() }}</span>
          </h4>
        </div>
        <img src="~@imgs/shoppingB.png" class="w-25" alt="網店消費" />
      </div>
      <div class="info d-flex flex-xxl-row flex-column col">
        <div class="expir-voucher d-flex flex-column w-100 w-xxl-30">
          <h3 class="pt-4 pb-1 text-start text-gray-300 fs-4">
            即將到期優惠卷
          </h3>
          <div class="col">
            <div
              class="top d-flex flex-column justify-content-center text-white h-70"
              :percentage="coupon.percent"
            >
              <h2
                class="text-center fs-5 text-start pt-2"
                style="color:#dee2e65c;"
              >
                {{ coupon.title }}
              </h2>
              <span class="py-2">{{
                dateFormmater(coupon.due_date)
              }}</span>
              <p class="text-center text-white h1 text-start discount">
                {{ coupon.percent }}%
              </p>
            </div>
            <div
              class="bottom shadow bg-white d-flex flex-column justify-content-center align-items-center h-30"
            >
              <router-link
                :to="{ name: 'MerchantVoucher' }"
                class="fs-6 font-weight-bold text-white"
              >
                查看更多
              </router-link>
            </div>
          </div>
        </div>
        <div class="news ms-xxl-5 d-flex flex-column w-100 w-xxl-70">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="pt-4 pb-1 text-start text-gray-300 fs-4">最新文章</h3>
            <router-link
              :to="{ name: 'MerchantArticleList' }"
              class="fs-6 font-weight-bold"
            >
              查看更多
            </router-link>
          </div>

          <ul class="bg-white shadow p-3 col">
            <a-skeleton
              active
              :avatar="{ shape: 'square' }"
              :paragraph="{ rows: 0 }"
              :loading="articlesLoading"
              v-for="fake in 8"
              :key="`fake_${fake}`"
            />
            <li
              class="py-2 text-start d-flex align-items-center border-bottom"
              v-for="(article, i) in articles"
              :key="`art_ ${i}`"
            >
              <span
                class="p-1 text-white border-5 fs-7 flex-none"
                style="background: #f7a5a6;"
              >
                {{ article.isPublic ? "發布" : "尚未發布" }}</span>
              <h3 class="ms-2 text-start fs-6 text-truncate">
                {{ article.title }}
              </h3>
              <span class="ps-7 ms-auto">{{
                dateFormmater(article.create_at)
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="proudct_list w-100 w-lg-25  d-flex flex-column ms-auto">
      <div class="d-flex pb-2 align-items-center justify-content-between">
        <h3 class="text-gray-300 fs-4 ">上架產品列表</h3>
        <router-link
          :to="{ name: 'MerchantProducts' }"
          class="fs-6 font-weight-bold"
        >
          查看更多</router-link>
      </div>
      <ul class="content bg-white shadow p-3 col">
        <a-skeleton
          active
          :avatar="{ shape: 'square' }"
          :paragraph="{ rows: 0 }"
          :loading="productsLoading"
          v-for="fake in 10"
          :key="`fakeP_${fake}`"
        />
        <li
          class="d-flex mb-4 align-items-center"
          v-for="(item, i) in products.slice(0, 8)"
          :key="`prod_${i}`"
        >
          <img
            :src="item.imageUrl"
            :alt="item.title"
            class="flex-none"
            style="width: 2.5rem; height: 2rem;"
          />

          <div class="text ps-3 text-truncate">
            <p class="text-start text-truncatet">{{ item.title }}</p>
            <div class="d-flex align-items-center fs-8 flex-none">
              <p class="text-muted text-start pe-2">{{ item.category }}</p>
              <font-awesome-icon
                icon="star"
                class="text-warning"
                aria-hidden="true"
                v-for="i in 5"
                :key="`rate_${i}`"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'

import { dateFormmater } from '@/utils/Mixin'

import { GetAllProducts } from '@/API/MerchantHome'
import { GetArticiles } from '@/API/MerchantArticle'
import { GetAllCoupon } from '@/API/MercahntCoupon'

export default {
  name: 'Home',
  setup () {
    onMounted(() => {
      getList()
      getArticle()
      getCoupon()
    })
    const article = reactive({
      articles: [],
      articlesLoading: true
    })
    const getArticle = () => {
      GetArticiles(1).then(res => {
        article.articlesLoading = false
        if (!res) return
        const data = res.data
        article.articles.push(...data.articles)
      })
    }
    const product = reactive({
      products: [],
      productsLoading: true
    })
    const getList = () => {
      GetAllProducts().then(res => {
        product.productsLoading = false
        if (!res) return
        const data = res.data
        for (const key in data.products) {
          product.products.push(data.products[key])
        }
      })
    }
    const coupon = reactive({})
    const getCoupon = () => {
      GetAllCoupon(null).then(res => {
        if (!res) return
        const data = res.data
        if (data.coupons.length !== 0) {
          const closestOne = data.coupons.reduce(
            (preValue, curValue, index, array) => {
              return preValue.due_date > curValue.due_date
                ? preValue
                : curValue
            }
          )
          Object.assign(coupon, closestOne)
        }
      })
    }
    return { ...toRefs(product), coupon, ...toRefs(article), dateFormmater }
  }
}
</script>

<style lang="sass" scoped>
.home-wrap
  height: 100%

.expir-voucher
  overflow: hidden
  .top
    position: relative
    height: 120px
    background: linear-gradient(#6463b7,#8771de,#bfaff1)
    h2
      font-weight: 600
      font-size: 24px
    .discount
      z-index: 1
      position: relative
      font-size: 68px
  .bottom
    box-sizing: border-box
    padding: 10px
    height: 6rem
    a
      background: #8583ec
      padding: 8px
      font-size: 26px
      border-radius: 5px
.expir-voucher .top::after
  content: attr(percentage)
  position: absolute
  left: 0
  top: 0
  right: 0
  width: 100%
  height: 100%
  transform: scale(1,0.9)
  color: #dee2e65c
  text-shadow: none
  font-size: 145px
  letter-spacing: 10px
  font-weight: 600
</style>
