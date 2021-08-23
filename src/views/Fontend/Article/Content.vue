<template>
  <section class="bg-white container mt-5 mx-auto border">
    <a-breadcrumb class="text-start mb-5">
      <a-breadcrumb-item><router-link to="/shopping">首頁</router-link></a-breadcrumb-item>
      <a-breadcrumb-item><router-link to="/shopping/article/list">文章列表</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>文章</a-breadcrumb-item>
    </a-breadcrumb>
    <Article :ID="ID" requestFrom="shopping" >
      <QuestionBars />
    </Article>

  </section>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import QuestionBars from '@/components/QuestionBars.vue'
import Article from '@/components/Article.vue'

export default {
  name: 'shoppingArticle',
  components: { Article, QuestionBars },
  setup () {
    const route = useRoute()
    const ID = ref('')
    onMounted(() => {
      ID.value = route.params.id
    })
    return { ID }
  }
}
</script>
