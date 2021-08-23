<template>
  <div class="container py-4">
    <div class="d-flex justify-content-center mb-4">
      <h1>商品列表</h1>
      <button
        type="button"
        class="btn btn-primary mb-auto ms-4"
        @click="onEditProductClick('add')"
      >
        新增產品
      </button>
    </div>
    <div class="spin-wrap" v-if="product.loading">
      <a-spin />
    </div>
    <div class="table-responsive" v-else>
      <table class="table text-nowrap">
        <thead>
          <tr>
            <th v-for="(item, idx) in header" :key="`header_${idx}`">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in product.list" :key="`list_${idx}`">
            <td class="align-middle">
              <img :alt="item.title" :src="item.imageUrl" style="width: 6vw;" />
            </td>
            <td class="align-middle">{{ item.title }}</td>
            <td class="align-middle">{{ item.origin_price }}</td>
            <td class="align-middle">{{ item.price }}</td>
            <td class="align-middle">{{ item.category }}</td>
            <td class="align-middle">
              <i
                class="fa fa-star "
                aria-hidden="true"
                v-for="i in item.rate"
                :key="`rate_${i}`"
              />
              {{ item.rate || "尚未評價" }}
              <span v-show="item.rate">星</span>
            </td>
            <td
              :class="{ inactive: item.is_enabled !== 1 }"
              class="align-middle"
            >
              {{ item.is_enabled === 1 ? "啟用" : "不啟用" }}
            </td>
            <td class="edit_btns align-middle ">
              <button
                type="button"
                class="btn btn-outline-dark me-1"
                @click="onEditProductClick('edit', item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger me-1"
                @click="onDeletProductClick(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <EdditPanel
    ref="panel"
    :type="panelType"
    :list="product"
    @getData="getData"
  />
  <Pagination :data="page" @clickPage="getData" />
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

import { GetProductData, DeletProduct } from '@/API/MerchantProduct'

import { Toast, useSwal } from '@/utils/UseSwal'
import Pagination from '@components/Pagination.vue'
import EdditPanel from './componments/EdditPanel.vue'

export default {
  name: 'Products',
  components: {
    EdditPanel,
    Pagination
  },
  setup () {
    const Swal = useSwal()
    const header = reactive([
      '主要圖片',
      '產品名稱',
      '原價',
      '售價',
      '分類',
      '評價',
      '是否啟用',
      '編輯'
    ])
    const product = reactive({
      list: [],
      selected: {},
      loading: false
    })
    const page = reactive({
      total_pages: 0,
      current_page: 1,
      has_pre: '',
      has_next: ''
    })
    onMounted(() => {
      getData()
    })
    const getData = pageMoves => {
      product.loading = true
      if (pageMoves) page.current_page = pageMoves
      GetProductData(page.current_page)
        .then(res => {
          product.loading = false
          if (!res) return
          const data = res.data
          product.list = data.products
          Object.assign(page, data.pagination)
        })
        .catch(error => {
          console.log(error)
        })
    }
    const onDeletProductClick = item => {
      Swal.fire({
        title: '確定要刪除嗎?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定'
      }).then(res => {
        if (res.isConfirmed) {
          requestDeletProduct(item.id)
        }
      })
    }
    const requestDeletProduct = id => {
      DeletProduct(id).then(res => {
        if (!res) return
        const data = res.data
        getData()
        Toast.fire({ icon: 'success', title: data.message })
      })
    }
    const panel = ref(null)
    const panelType = ref('')
    const onEditProductClick = (type, item) => {
      if (type === 'add') {
        initForm()
      } else {
        product.selected = JSON.parse(JSON.stringify(item))
      }
      panelType.value = type
      panel.value.open()
    }
    const initForm = () => {
      if (!product.selected) return
      Object.keys(product.selected).map((key) => {
        product.selected[key] = ''
      })
    }
    return {
      panelType,
      product,
      onDeletProductClick,
      onEditProductClick,
      header,
      page,
      getData,
      panel
    }
  }
}
</script>

<style lang="sass" scoped>
.page-link:focus
  box-shadow: none
.container
  margin: 0 auto
table
  width: 100%
  display: block
  min-height: 500px
  caption-side: bottom
  border-collapse: collapse
  th
    width: 120px
.productList tr td
  padding: 0.5rem
.switch
  position: relative
  display: inline-block
  width: 60px
  height: 34px
.switch input
  opacity: 0
  width: 0
  height: 0
.fa
  color: $primary
.inactive
  color: $danger
.edit_btns
  width: auto
  overflow: hidden
  white-space: nowrap
tr, td
  padding: 0
  margin: 0
  border: 0
  border-collapse: collapse
</style>
