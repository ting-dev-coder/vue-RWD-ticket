<template>
  <Animation class="d-none d-md-block" />
  <router-link :to="{ name: 'Order' }" class="d-block d-md-none">
    <div class="mobile-poster" />
  </router-link>
  <section class="mt-0 mt-md-5 ">
    <div class="mb-5 container">
      <div class="row">
        <dl class="col-12 col-md-6">
          <dt
          class="text-start border-bottom p-2 d-flex justify-content-between align-items-center"
          >
          <h3 class="text-title">最新消息</h3>
          <router-link :to="{ name: 'ArticleList' }" class="fs-6 text-gray-300">
            查看更多消息
          </router-link>
          </dt>
          <dd
          class="text-start border-bottom p-2 w-100 text-truncate"
          v-for="(article, idx) in articles"
          :key="`article_${idx}`"
        >
          <a-skeleton
            active
            :avatar="{ shape: 'square' }"
            :paragraph="{ rows: 0 }"
            :loading="articlesLoading"
          >
            <router-link
              :to="{ name: 'Article', params: { id: article.id } }"
              class="text-black text-truncate "
              >{{ article.title }}</router-link>
          </a-skeleton>
          </dd>
        </dl>
        <iframe
          src="https://www.youtube.com/embed/rlpUNtNdjNc?autoplay=1&mute=1&loop=1&playlist=rlpUNtNdjNc"
          width="100%"
          height="315"
          frameborder="0"
          allowfullscreen="allowfullscreen"
          class="col-12 col-md-6"
        />
      </div>
    </div>
    <div class="category w-100 mb-8 container">
      <div class="divider">
        <h3 class="text-title">熱門分類</h3>
      </div>
      <ul class="justify-content-between row p-3 p-md-6">
        <li class="col-12 col-sm-4 px-2 mb-3 position-relative" @click="routeToShopping('音樂')">
          <span
            class="bg-primary ms-2 p-2 fs-5 fw-bold position-absolute bottom-0 start-0"
            style="z-index:1"
            >音樂類</span>
          <div class="w-100 h-100" />
        </li>
        <li class="col-12 col-sm-4 px-2 position-relative mb-3" @click="routeToShopping('藝術')">
          <span
            class="bg-primary ms-2 p-2 fs-5 fw-bold mb-auto position-absolute top-0 start-0"
            style="z-index:1"
            >藝術類</span>
          <div class="w-100 h-100" />
        </li>
        <li class="col-12 col-sm-4 px-2 position-relative mb-3" @click="routeToShopping('表演')">
          <span
            class="bg-primary ms-2 p-2 fs-5 fw-bold mb-auto position-absolute bottom-0 start-0"
            style="z-index:1"
            >表演類</span>
          <div class="w-100 h-100" />
        </li>
      </ul>
    </div>
    <div
      class="coupon banner mb-8 text-primary d-flex flex-column justify-content-center"
    >
      <div class="container text-center">
        <p class="fs-3 fw-bold text-center">專屬你的優惠卷，不要錯過!</p>
        <p class="fs-5 text-center py-2">心動不如馬上來領取!</p>
        <a
          href="#"
          class="btn btn-secondary flex-none"
          @click.prevent="showCouponPop = true"
        >我要領取</a>
      </div>
    </div>
    <div
      v-if="showCouponPop"
      class="coupon-wrap position-absolute vw-100 vh-100 d-flex align-items-center justify-content-center flex-column top-0 start-0 fs-3"
      style="background:rgba(0,0,0,0.5);z-index:2021;"
    >
      <button
        type="button"
        class="btn-close btn-close-white"
        aria-label="Close"
        @click="showCouponPop = false"
        style="margin-left:50%;"
      />
      <img src="~@imgs/coupon.png" alt="優惠代碼圖片" style="height:500px" />
      <button class="btn btn-danger" @click="copyCode" type="button">
        點擊並複製優惠代碼
      </button>
    </div>
    <section class="container">
      <div class="divider">
        <h3 class="text-title">熱門展覽</h3>
      </div>
    <ItemsList :items="products" :loading="productsLoading" />
    </section>
    <div
      class="subscribe banner d-flex align-items-center justify-content-end mt-5"
    >
      <div class=" rounded-2 container">
        <h4 class="text-primary fs-3 my-2 text-center">訂閱我們!</h4>
        <p class="text-white fs-5 my-2 text-center">
          獲取最優惠價格，不錯過最新一手消息。
        </p>
        <div class="input-group w-100 w-md-50 mb-3 px-8 mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Email"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <button class="btn btn-secondary" type="button" id="button-addon2">
            訂閱
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Toast } from '@/utils/UseSwal'

import Animation from './BannerAnimation.vue'
import ItemsList from '@components/Items.vue'
import { GetProductData } from '@/API/ShoppingCart'
import { GetArticiles } from '@/API/Article'

export default {
  name: 'Home',
  components: { Animation, ItemsList },
  setup () {
    const router = useRouter()
    const showCouponPop = ref(false)
    const info = reactive({
      products: {},
      articles: {},
      productsLoading: true,
      articlesLoading: true
    })
    onMounted(() => {
      getProdctList()
      getArticles()
    })
    const getProdctList = () => {
      GetProductData(1).then(res => {
        info.productsLoading = false
        if (!res) return
        const data = res.data
        info.products = data.products
      })
    }
    const getArticles = () => {
      GetArticiles().then(res => {
        info.articlesLoading = false
        if (!res) return
        const data = res.data
        info.articles = data.articles
      })
    }
    const copyCode = e => {
      const span = document.createElement('span')
      span.textContent = 'BigSale9'
      document.body.appendChild(span)

      const selection = document.getSelection()
      const range = document.createRange()
      range.selectNode(span)
      selection.removeAllRanges()
      selection.addRange(range)

      document.execCommand('copy')
      selection.removeAllRanges()

      document.body.removeChild(span)
      showCouponPop.value = false
      Toast.fire({ icon: 'success', title: '優惠代碼複製成功' })
    }
    const routeToShopping = (type) => {
      router.push({ name: 'Order', params: { category: type } })
    }
    return { ...toRefs(info), showCouponPop, copyCode, routeToShopping }
  }
}
</script>
<style lang="sass" scoped>
.ant-carousel /deep/ .slick-slide
  text-align: center
  height: 160px
  line-height: 160px
  background: #364d79
  overflow: hidden

.ant-carousel :deep .slick-slide h3
  color: #fff
.custom_card /deep/ .ant-card-meta-description
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  white-space: normal
.coupon
  background-attachment: fixed
  height: 300px
  width: 100vw
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(~@imgs/coupon_banner.jpg)
  background-size: cover
  background-position: 50%
.subscribe
  margin-bottom: -2.5rem!important
  background-attachment: fixed
  height: 350px
  width: 100vw
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(~@imgs/newslette_bcg.jpg)
  background-size: cover
  background-position: 50%
.category
  li
    cursor: pointer
    overflow: hidden
    height: 16rem
    span, div
      transition: 0.3s
    div
      background-size: cover!important

  li:nth-child(1) div
    background: url('~@imgs/category_1.jpg')
  li:nth-child(2) div
    background: url('~@imgs/category_2.jpg')
  li:nth-child(3) div
    background: url('~@imgs/category_3.jpeg')
  li:hover div, li:hover span
    transform: scale(1.2)
.mobile-poster
  width: 100%
  height: 300px
  background: url('~@imgs/MagrittePoster.jpg') no-repeat
  background-size: cover
</style>
