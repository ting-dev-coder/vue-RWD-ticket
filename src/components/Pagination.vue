<template>
  <nav aria-label="Page navigation" class="mt-4 pt-5">
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        :class="{ disabled: !page.has_pre }"
        @click.prevent="prevPage"
      >
        <a class="page-link shadow-none" href="#">上一頁</a>
      </li>
      <li
        class="page-item"
        :class="{ active: page.current_page === n }"
        v-for="n in page['total_pages']"
        :key="`page_${n}`"
        @click.prevent="onPageClick(n)"
      >
        <a class="page-link shadow-none" href="#" tabindex="-1">{{ n }}</a>
      </li>
      <li
        class="page-item pe-auto"
        :class="{ disabled: !page.has_next }"
        @click.prevent="nextPage"
      >
        <a class="page-link shadow-none pe-auto" href="#">下一頁</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { reactive, watch } from 'vue'

export default {
  name: 'pagination',
  props: ['data'],
  setup (props, { emit }) {
    const page = reactive({})
    watch(props.data, (newVal, oldValue) => {
      Object.assign(page, newVal)
    })
    const onPageClick = n => {
      document.getElementById('app').scrollIntoView()
      emit('clickPage', n)
    }
    const nextPage = () => {
      if (!page.has_next) return
      emit('clickPage', page.current_page + 1)
    }
    const prevPage = () => {
      if (!page.has_pre) return
      emit('clickPage', page.current_page - 1)
    }
    return { nextPage, page, prevPage, onPageClick }
  }
}
</script>
