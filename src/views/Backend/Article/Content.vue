<template>
  <section class="bg-white ">
    <a-breadcrumb class="text-left p-3">
      <a-breadcrumb-item>
        <router-link to="/merchant/article/list">
          <font-awesome-icon icon="long-arrow-alt-left" class="mr-2" />
          文章列表
        </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>最新消息</a-breadcrumb-item>
    </a-breadcrumb>
    <Article :ID="ID" requestFrom="Merchant" />
  </section>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Article from '@/components/Article.vue'

export default {
  name: 'MerchantArticle',
  components: { Article },
  setup () {
    const route = useRoute()
    const ID = ref('')
    onMounted(() => {
      console.log(route.params.id)
      ID.value = route.params.id
    })
    return { ID }
  }
}
</script>
