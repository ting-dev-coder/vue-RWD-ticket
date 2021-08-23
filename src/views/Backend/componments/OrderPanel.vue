<template>
  <a-drawer
    :placement="placement"
    :closable="false"
    width="50%"
    :visible="visible"
    @close="onClose"
  >
    <a-descriptions title="訂單詳情" bordered>
      <a-descriptions-item label="姓名">{{ user.name }}</a-descriptions-item>
      <a-descriptions-item label="電話">{{ user.tel }}</a-descriptions-item>
      <a-descriptions-item label="Email">{{ user.email }}</a-descriptions-item>
      <a-descriptions-item label="地址">{{ user.address }}</a-descriptions-item>
      <a-descriptions-item label="Usage Time" :span="2">
        {{ paid_date }}
      </a-descriptions-item>
      <a-descriptions-item label="Status" :span="3">
        <a-badge
          :status="is_paid ? 'processing' : 'error'"
          :text="is_paid ? '已付款' : '尚未付款'"
        />
      </a-descriptions-item>
      <a-descriptions-item label="訂單編號" :span="2">
        {{ id }}
      </a-descriptions-item>
      <a-descriptions-item label="總額">{{ total }}</a-descriptions-item>
      <a-descriptions-item label="選購商品">
        <div
          v-for="(item, key, index) in products"
          :key="`info_${index}`"
          class="text-left"
        >
          {{ index + 1 }}. {{ item.product.title }} / {{ item.qty }}
          {{ item.product.unit }}
          <br />
          總計: {{ item.total }}
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script>
import { reactive, ref, watch, toRefs } from 'vue'

export default {
  name: 'OrderPanel',
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props) {
    const item = reactive({
      create_at: 0,
      id: '',
      is_paid: false,
      message: '',
      num: 1,
      paid_date: 0,
      products: {},
      total: 0,
      user: {}
    })
    const placement = ref('right')
    const visible = ref(false)
    const showDrawer = () => {
      visible.value = true
    }
    watch(
      props.product,
      (newVal) => {
        Object.assign(item, newVal.selected)
      },
      { deep: true }
    )
    const onClose = () => {
      visible.value = false
    }

    return {
      ...toRefs(item),
      item,
      placement,
      visible,
      showDrawer,
      onClose
    }
  }
}
</script>
