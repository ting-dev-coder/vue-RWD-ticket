<template>
  <main class="p-4 bg-white">
    <div class="d-flex align-items-center justify-content-center mb-4">
      <h1 class="mb-0">消息公布</h1>
      <router-link
        class="btn btn-primary mb-auto ml-4 p-2"
        :to="{ name: 'MerchantAddArticle' }"
        >新增文章</router-link>
    </div>
    <div class="spin-wrap" v-if="loading">
      <a-spin />
    </div>
    <ul v-else>
      <li
        class="py-3 border-bottom text-start d-flex align-items-start"
        v-for="(item, i) in list"
        :key="`article_ ${i}`"
      >
        <a-avatar v-if="!item.imageUrl" class="mx-2" shape="square" :size="85">
          <template #icon>暫無圖片</template>
        </a-avatar>
        <a-avatar
          v-else
          :src="item.imageUrl"
          class="mx-2"
          shape="square"
          :size="85"
        />
        <div class="article col">
          <div class="d-flex justify-content-between pb-2">
            <h3 class="text-start h6">{{ item.title }}</h3>
            <span>{{ dateFormmater(item.create_at) }}</span>
          </div>
          <div class="pb-2 _tags_wrap">
            <span
              class="p-1 mr-2 tag rounded-2"
              v-for="(tag, i) in item.tags"
              :key="`tag_${i}`"
              >{{ tag }}</span>
          </div>
          <div class="d-flex justify-content-end">
            <!-- <p class="text-start text-muted">description</p> MerchantAddArticle-->
            <div>
              <span class="btn mr-2"><router-link
                  :to="{ name: 'MerchantArticle', params: { id: item.id } }"
                  >瀏覽</router-link></span>
              <span class="btn mr-2"><router-link
                  :to="{ name: 'MerchantAddArticle', params: { id: item.id } }"
                  >編輯</router-link></span>
              <span class="btn text-danger" @click="onDeletClick(item)">刪除</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <Pagination :data="page" @clickPage="getData" />
  </main>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'

import { dateFormmater } from '@/utils/Mixin'
import { useSwal, Toast } from '@/utils/UseSwal'

import Pagination from '@components/Pagination.vue'
import { GetArticiles, DeletArticile } from '@/API/MerchantArticle'

export default {
  name: 'MerchantArticleList',
  components: { Pagination },
  setup () {
    const Swal = useSwal()
    const product = reactive({
      list: [],
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
      GetArticiles(page.current_page).then(res => {
        product.loading = false
        if (!res) return
        const data = res.data
        product.list = data.articles
        Object.assign(page, data.pagination)
      })
    }
    const onDeletClick = item => {
      Swal.fire({
        title: '確定要刪除嗎?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定'
      }).then(res => {
        if (res.isConfirmed) {
          requestDelet(item.id)
        }
      })
    }
    const requestDelet = ID => {
      DeletArticile(ID).then(res => {
        if (!res) return
        const data = res.data
        getData()
        Toast.fire({ icon: 'success', title: data.message })
      })
    }
    return { getData, page, ...toRefs(product), onDeletClick, dateFormmater }
  }
}
</script>

<style lang="sass" scoped>
$tag-bg: #ff9763, #ffc107, #85ffe8, #83c4f9
$repeat: 4// How often you want the pattern to repeat.
// Warning: a higher number outputs more CSS.

@for $i from 1 through $repeat
  .tag:nth-child(#{length($tag-bg)}n + #{$i})
    background: nth($tag-bg, $i)
    color: #333333
</style>
