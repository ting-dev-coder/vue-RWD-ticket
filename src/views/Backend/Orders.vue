<template>
  <section class="position-relative">
    <h1 class="pt-4">訂單列表</h1>
    <div class="spin-wrap" v-if="order.loading">
      <a-spin />
    </div>
    <div class="table-responsive" v-else>
      <table class="table text-nowrap table-striped">
        <thead>
          <tr>
            <th v-for="(item, idx) in header" :key="`header_${idx}`">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in order.list" :key="`order_${idx}`">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.create_at }}</td>
            <td>{{ item.user.email }}</td>
            <td>
              <div
                v-for="(product, idx) in item.products"
                :key="`product_${idx}`"
              >
                {{ product.product.title }} : {{ product.qty }}
                {{ product.product.unit }}/ {{ product.total }}
              </div>
            </td>
            <td>{{ item.total }}</td>
            <td>{{ item.is_paid ? "是" : "否" }}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-dark me-1"
                @click="onMoreDetailsClick(item)"
              >
                檢視
              </button>
              <button
                type="button"
                class="btn btn-outline-danger ms-1"
                @click="onDeletClick(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :data="page" @clickPage="getData" />
    <OrderPanel ref="panel" :product="order" />
  </section>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

import { GetOrders, DeletOrder } from '@/API/MerchantOrders'

import OrderPanel from './componments/OrderPanel.vue'
import Pagination from '@components/Pagination.vue'
import { Toast } from '@/utils/UseSwal'

export default {
  name: 'MerchantOrder',
  components: {
    Pagination,
    OrderPanel
  },
  setup () {
    const header = reactive([
      '索引',
      '購買時間',
      'Email',
      '購買款項',
      '應付金額',
      '是否付款',
      '編輯'
    ])
    onMounted(() => {
      getData()
    })
    const order = reactive({ list: [], selected: {}, loading: false })
    const page = reactive({
      total_pages: 0,
      current_page: 1,
      has_pre: '',
      has_next: ''
    })
    const getData = pageMoves => {
      order.loading = true
      if (pageMoves) page.current_page = pageMoves
      GetOrders(page.current_page).then(res => {
        order.loading = false
        if (!res) return
        const data = res.data
        order.list = data.orders
        Object.assign(page, data.pagination)
      })
    }
    const onDeletClick = item => {
      DeletOrder(item.id).then(res => {
        if (!res) return
        const data = res.data
        Toast.fire({ icon: 'success', title: data.message })
        getData()
      })
    }
    const panel = ref(null)
    const onMoreDetailsClick = item => {
      order.selected = JSON.parse(JSON.stringify(item))
      panel.value.showDrawer()
    }
    return {
      panel,
      onMoreDetailsClick,
      onDeletClick,
      getData,
      page,
      order,
      header
    }
  }
}
</script>
