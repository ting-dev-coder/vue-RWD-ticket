<template>
  <main class="p-4 p-lg-5">
    <div class="d-flex align-items-center justify-content-center mb-4">
      <h3>優惠卷列表</h3>
      <button
        @click="onEditCouponClick('add')"
        class="btn btn-primary ms-4"
      >
        新增優惠卷
      </button>
    </div>
    <div class="spin-wrap" v-if="loading">
      <a-spin />
    </div>
    <div class="row" v-else>
      <div class="row-cols-1  row-cols-lg-2">
        <div
          class="voucher-wrap d-flex flex-column flex-md-row shadow py-2 px-2 px-lg-3 px-xxl-5"
          v-for="(item, i) in list"
          :key="`coupon_ ${i}`"
        >
          <div class="left w-100 w-lg-50 voucher text-white">
            <h3 class="pt-1 display-2 text-white word_space">
              {{ item.percent }}%
            </h3>
            <span class="code shadow">{{ item.code }}</span>
            <div class="mask"></div>
          </div>
          <div class="w-100 w-lg-50 pl-4 text-center text-md-end">
            <p class="fs-5 py-2 text-center text-md-end">
              {{ item.title }} |
              <span class="bg-light text-dark">
                {{ item.is_enabled === 1 ? "啟用" : "尚未啟用" }}</span>
            </p>
            <p class="font-weight-bold fs-6 py-2 text-center text-md-end">
              {{ dateFormmater(new Date(item.range?.end)) }}
            </p>
            <button
              type="button"
              class="btn btn-outline-secondary me-2"
              @click="onEditCouponClick('edit', item)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-danger text-white ms-2"
              @click="onDeletCouponClick(item)"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <Pagination :data="page" @clickPage="getData" />
  </main>
  <EdditPanel
    ref="panel"
    :list="coupon"
    @getData="getData"
    :type="coupon.selectType"
  />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'

import { dateFormmater } from '@/utils/Mixin'

import { Toast } from '@/utils/UseSwal'
import EdditPanel from './componments/VoucherPanel.vue'
import Pagination from '@components/Pagination.vue'
import { GetAllCoupon, DeletCoupon } from '@/API/MercahntCoupon'

export default {
  name: 'MerchantVoucher',
  components: {
    EdditPanel,
    Pagination
  },
  setup () {
    onMounted(() => {
      getData()
    })
    const page = reactive({
      total_pages: 0,
      current_page: 1,
      has_pre: '',
      has_next: ''
    })
    const coupon = reactive({
      selectType: '',
      list: [],
      selected: {},
      loading: false
    })
    const getData = pageMoves => {
      coupon.loading = true
      if (pageMoves) page.current_page = pageMoves
      GetAllCoupon(page.current_page).then(res => {
        coupon.loading = false
        if (!res) return
        const data = res.data
        coupon.list = data.coupons
        Object.assign(page, data.pagination)
      })
    }

    const panel = ref(null)
    const type = ref('')
    const onEditCouponClick = (type, item) => {
      if (type === 'add') {
        initForm()
      } else {
        coupon.selected = JSON.parse(JSON.stringify(item))
      }
      coupon.selectType = type
      panel.value.open()
    }
    const initForm = () => {
      if (!coupon.selected) return
      Object.keys(coupon.selected).map(function (key, index) {
        coupon.selected[key] = ''
      })
    }
    const onDeletCouponClick = item => {
      DeletCoupon(item.id).then(res => {
        if (!res) return
        const data = res.data
        Toast.fire({ icon: 'success', title: data.message })
        getData()
      })
    }
    return {
      type,
      getData,
      coupon,
      onEditCouponClick,
      panel,
      ...toRefs(coupon),
      onDeletCouponClick,
      page,
      dateFormmater
    }
  }
}
</script>

<style lang="sass" scoped>
.word_space
  letter-spacing: 12px
.voucher-wrap
  .left
    position: relative
    width: 100%
    height: 120px
    background-color: rgba(0,0,0,0.7)
    background-size: cover
    mask: url('~@imgs/vocher_mask_left.png') no-repeat center center
    mask-size: 100% 100%
.voucher
  background: url('~@imgs/bcg.jpg') no-repeat top center
  .code
    position: absolute
    bottom: 17px
    left: 25%
    right: 0
    width: 50%
    font-size: 24px
    background: black
  .mask
    z-index: -1
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background: #000000e3
</style>
