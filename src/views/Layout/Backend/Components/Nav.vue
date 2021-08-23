<template>
  <div
    class="backend-nav h-100"
    :data-collapsed="collapse"
  >
    <font-awesome-icon
      icon="bars"
      class="text-white fs-4 d-md-none me-4"
      @click="toggleCollapsed"
    />
    <ul class="w-100">
      <li
        class="text-white"
        v-for="(item, idx) in list"
        :key="idx"
        @click.prevent="toggleMenu(idx, item.routerName, item.children)"
        :class="{
          selectedNav: router.currentRoute.value.name === item.routerName
        }"
        @mouseover="childrenCollapse = item.children && collapse ? true : false"
        @mouseout="childrenCollapse = false"
      >
        <span />
        <span />
        <a-tooltip
          placement="right"
          :title="item.title"
          v-if="!item.children && collapse"
        >
          <div
            class="position-absolute"
            style="top:0;bottom:0;left:0;right:0;"
          />
        </a-tooltip>
        <font-awesome-icon
          class="fs-3 pointer"
          :icon="item.iconName"
        />
        <a class="name" href="#"> {{ item.title }}</a>
        <ul
          v-if="item.children"
          class="children-ui"
          :class="{
            'children-ui-open': extendchildren && !collapse,
            'children-nav-hover': childrenCollapse
          }"
        >
          <li v-for="(item, cIdx) in item.children" :key="cIdx">
            <router-link :to="{ name: item.routerName }">{{
              item.title
            }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import emitter from '@/utils/Bus'

export default {
  setup () {
    const router = useRouter()
    const route = useRoute()
    const navState = reactive({
      collapse: true,
      extendchildren: true,
      childrenCollapse: false
    })
    const path = reactive(router.options.routes)
    const list = reactive([
      {
        title: '首頁',
        routerName: 'MerchantHome',
        iconName: 'home'
      },
      {
        title: '產品',
        routerName: 'MerchantProducts',
        iconName: 'dolly'
      },
      {
        title: '訂單列表',
        routerName: 'MerchantOrders',
        iconName: 'shipping-fast'
      },
      {
        title: '文章',
        iconName: 'newspaper',
        children: [
          {
            title: '文章列表',
            routerName: 'MerchantArticleList'
          },
          {
            title: '新增文章',
            routerName: 'MerchantAddArticle'
          }
        ]
      },
      {
        title: '優惠卷',
        routerName: 'MerchantVoucher',
        iconName: 'money-check-alt'
      }
    ])
    onMounted(() => {
      emitter.on('ChangeCollapsed', () => {
        navState.collapse = !navState.collapse
      })
    })
    const pushTo = page => {
      router.push({ name: page })
    }
    const toggleMenu = (idx, routerName, children) => {
      if (children && !navState.collapse) {
        navState.extendchildren = !navState.extendchildren
      } else {
        router.push({ name: routerName })
      }
    }
    const toggleCollapsed = () => {
      emitter.emit('ChangeCollapsed')
    }
    return {
      toggleCollapsed,
      router,
      toggleMenu,
      list,
      pushTo,
      path,
      route,
      emitter,
      ...toRefs(navState)
    }
  }
}
</script>

<style lang="sass" scoped>
.backend-nav
  li
    position: relative
    padding: 10px
    margin: 1rem 0
    text-align: left
    a
      padding-left: 15px
.children-nav-hover
  display: block!important
.children-ui
  display: none
.children-ui-open
  display: block
.children-nav-hover
  z-index: 9999
  display: none
  position: absolute
  background: #092549
  top: 0
  left: 105%
  li
    padding: 10px
    padding-right: 50px
    a
      padding: 0
      color: #b9b9b9
.selectedNav
  background: #f7f7f7
  border-radius: 15px 0 0px 15px
  svg, a
    color: $black
.selectedNav span:nth-child(1)
  position: absolute
  top: -20px
  right: 0
  width: 20px
  height: 20px
  background: #f7f7f7
.selectedNav span:nth-child(1):before
  content: ''
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  border-bottom-right-radius: 20px
  background: #0B284E

.selectedNav span:nth-child(2)
  position: absolute
  bottom: -20px
  right: 0
  width: 20px
  height: 20px
  background: #ffff
.selectedNav span:nth-child(2):before
  content: ''
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  border-top-right-radius: 20px
  background: #0B284E

.content
  padding: 10px
  color: #fff
  cursor: pointer
.content:hover
  background: rgba(255, 255, 255, 0.2)

.ant-menu
  height: 100%
</style>
