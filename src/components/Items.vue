<template>
  <div class="spin-wrap" v-if="loading">
    <a-spin />
  </div>
  <div class="row row-cols-1 row-cols-lg-3 row-cols-xl-4 row-cols-md-2 " v-else>
    <div
      class="col mb-4"
      v-for="(random, idx) in random"
      :key="`list_${idx}`"
    >
      <a-card
        hoverable
        :bodyStyle="{ 'text-align': 'left' }"
        @click="onMoreDetailsClick(random)"
      >
        <template #cover>
          <img alt="預設圖片" :src="random.imageUrl" />
        </template>
        <a-card-meta :title="random.title">
          <template #description>
            <p class="text-start text-nowrap fs-5">
                NTD
                <span class="fs-3" :class="{'text-warning': random.price !== random.origin_price}">{{ random.price }}</span>
                <span v-if="random.price !== random.origin_price"> /<del>{{ random.origin_price }} </del></span>
            </p>
            <a
              ref="panel"
              class="btn btn-outline-primary ms-auto"
              @click.stop.self.prevent="$emit('onAddCartClick',random)"
              href="#"
            >
              <font-awesome-icon
                icon="spinner"
                spin
                v-if="loadingItem === random.id"
              />
              加到購物車
            </a>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script>
import { watch, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'productList',
  props: {
    items: Array,
    loading: Boolean,
    isShowAddBtn: Boolean
  },
  setup (props) {
    const loadingItem = ref('')
    const router = useRouter()
    const random = reactive([])
    watch(
      () => props.items,
      (item) => {
        Object.assign(random, item)
      },
      { immediate: true, deep: true }
    )
    const onMoreDetailsClick = item => {
      router.push({ name: 'ItemDetail', query: { id: item.id } })
    }
    return { random, onMoreDetailsClick, loadingItem }
  }
}
</script>
