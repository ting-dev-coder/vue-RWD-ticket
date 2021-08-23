<template>
  <div class="spin-wrap" v-if="dataLoading">
    <a-spin />
  </div>
  <section id="top" v-else>
    <h3 class="fs-2" >{{ currentArtilce.title }}</h3>
    <span class="fs-5 text-gray-800">{{ dateFormmater(currentArtilce.title) }}</span>
    <hr />
    <p class="content">{{ currentArtilce.content }}</p>
    <hr />
    <slot />
    <div class="d-flex justify-content-between pt-4">
      <a href="#" class="pre text-blue-500" @click.prevent="routeToPage(list[crrentIdx - 1 ])">
        <font-awesome-icon icon="chevron-left" />
        上一篇:
        <p class="nex_text text-truncate">{{ list[crrentIdx -1 ]?.title }}</p>
      </a>
      <a href="#" class="nex text-blue-500"  @click.prevent="routeToPage(list[crrentIdx + 1 ])">
        下一篇:
        <p class="nex_text text-truncate">{{ list[crrentIdx + 1]?.title }}</p>
        <font-awesome-icon icon="chevron-right" />
      </a>
    </div>
  </section>
</template>

<script>
import { reactive, watch, ref, toRefs } from 'vue'

import { dateFormmater } from '@/utils/Mixin'

import { GetArticiles, GetArticile } from '@/API/Article'
import { GetMArticile } from '@/API/MerchantArticle'

export default {
  name: 'Article',
  props: {
    ID: {
      type: String,
      require: true
    },
    requestFrom: {
      type: String,
      require: true
    }
  },
  setup (props) {
    const article = reactive({
      crrentIdx: 0,
      currentArtilce: {},
      list: []
    })
    const dataLoading = ref(false)
    const articleID = ref()
    watch(props, (newV, oldV) => {
      dataLoading.value = true
      console.log(props.ID)
      articleID.value = props.ID
      if (props.requestFrom !== 'Merchant') getArticles(articleID.value)
      getArticle(articleID.value)
    })
    watch(articleID, (newV, oldV) => {
      if (props.requestFrom !== 'Merchant') getArticles(newV)
      getArticle(newV)
    })
    const getArticles = id => {
      const api = GetArticiles
      api().then(res => {
        if (!res) return
        const data = res.data
        const { articles } = data
        article.crrentIdx = articles.findIndex(el => el.id === id)
        article.list = articles
      })
    }
    // eslint-disable-next-line no-unused-vars
    const getArticle = id => {
      dataLoading.value = false
      const api = props.requestFrom === 'Merchant' ? GetMArticile : GetArticile
      api(id).then(res => {
        dataLoading.value = false
        if (!res) return
        const data = res.data
        article.currentArtilce = data.article
      })
    }
    const routeToPage = (item) => {
      articleID.value = item.id
      document.getElementById('app').scrollIntoView(0, 0)
    }
    return { ...toRefs(article), dataLoading, dateFormmater, routeToPage }
  }
}
</script>

<style lang="sass" scoped>
.content
  letter-spacing: 5px
  line-height: 2rem
.pre, .nex
  display: flex
  align-items: center
  flex-direction: row
  max-width: 120px
  white-space: nowrap
.pre_text, .nex_text
  display: inline-block
  width: 200px
</style>
