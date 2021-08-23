<template>
  <div class="backend-header d-flex justify-content-between">
    <font-awesome-icon
      icon="bars"
      class="text-white fs-3 m-2"
      @click="toggleCollapsed"
    />
    <div class="pe-4">
      <router-link to="/shopping/home" class="text-primary">
        回到前台
      </router-link>
      <span class="text-muted">/ </span>
      <a src="#" class="btn text-white " @click.prevent="onLogoutClick">登出</a>
    </div>
  </div>
  <a-modal
    width="10rem"
    v-model:visible="logoutPrompt"
    :visible="false"
    :closable="false"
    centered
    :footer="null"
    :bodyStyle="{
      height: '8rem',
      'text-align': 'center',
      padding: 0,
      'padding-top': '2rem'
    }"
  >
    <a-spin size="large" />
    <p class="mt-2 text-center">登出中...</p>
  </a-modal>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { Logout } from '@/API/Login'
import emitter from '@/utils/Bus'

export default {
  setup () {
    const router = useRouter()
    const store = useStore()

    const logoutPrompt = ref(false)
    const toggleCollapsed = () => {
      emitter.emit('ChangeCollapsed')
    }
    const onLogoutClick = () => {
      logoutPrompt.value = true
      Logout().then(res => {
        if (!res) return
        store.commit('SET_TOKEN', { token: '', expired: '' })
        logoutPrompt.value = false
        router.push({ name: 'Login' })
      })
    }
    return { toggleCollapsed, onLogoutClick, logoutPrompt }
  }
}
</script>

<style lang="sass" scoped>
.backend-header
  height: 40px
  line-height: 40px
  background: #0C294F
</style>
