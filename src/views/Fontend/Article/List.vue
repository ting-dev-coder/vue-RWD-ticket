<template>
  <article class="col-md-8 mx-auto">
    <div class="spin-wrap" v-if="loading">
      <a-spin />
    </div>
    <ul v-else>
      <li
        class="py-3 border-bottom text-start d-flex align-items-start"
        v-for="(item, i) in dataList"
        :key="`article_ ${i}`"
      >
        <a-avatar v-if="!item.imageUrl" class="flex-none mx-2 fs-6" shape="square" :size="85">
          <template #icon>暫無圖片</template>
        </a-avatar>
        <a-avatar
          v-else
          :src="item.imageUrl"
          class="mx-2"
          shape="square"
          :size="85"
        />
        <div class="d-flex col">
          <div class="pb-2 col">
             <router-link
              :to="{ name: 'Article', params: { id: item.id } }"
              class="text-start fs-6"
              >{{ item.title }}</router-link>
            <div class="pb-2">
              <span
                class="p-1 mr-2 me-3 rounded-2 bg-gray-300"
                v-for="(tag, i) in item.tags"
                :key="`tag_${i}`"
                >{{ tag }}</span>
            </div>
          </div>
          <span class="ps-2 text-nowrap">{{ dateFormmater(item.create_at) }}</span>
        </div>
      </li>
    </ul>
  </article>
</template>

<script>
import { reactive, onMounted } from 'vue'

import { dateFormmater } from '@/utils/Mixin'

import { GetArticiles } from '@/API/Article'

export default {
  name: 'Article',
  setup () {
    const dataList = reactive([])
    onMounted(() => {
      getArticles()
    })
    const getArticles = () => {
      GetArticiles().then(res => {
        if (!res) return
        const data = res.data
        dataList.push(...data.articles)
      })
    }
    return {
      dataList,
      dateFormmater
    }
  }
}
</script>

<style lang="sass" scoped>
.ant-breadcrumb
  text-algin: left
</style>
