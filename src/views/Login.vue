<template>
  <div class="illustration" />
  <div class="login-form-container w-75 w-md-50 w-lg-25">
    <h1 class="text-primary py-2 bg-dark  rounded-top fs-4">
      千喜年售票- 商家登入
    </h1>
    <form
      class="login-form-wrap rounded-bottom px-3 px-lg-2  px-xl-5 py-4"
      id="login_form"
      @submit.prevent="onLoginClick"
    >
      <div class="username-wrap mb-3">
        <input
          class="rounded-3 fs-7 text-dark"
          type="text"
          required
          autofocus
          v-model.trim="input.email"
        />
        <label class="label" for="Email">Email</label>
      </div>
      <div class="password-wrap mb-3">
        <input
          class="rounded-3"
          type="password"
          id="password"
          v-model.trim="input.password"
          required
        />
        <label class="label" for="Password">Password</label>
      </div>
      <div class="d-flex justify-content-between flex-column flex-md-row">
        <router-link
          to="/shopping/home"
          class="text-white btn mb-3 btn-dark fs-6"
        >
          <font-awesome-icon icon="long-arrow-alt-left" />
          返回前台
        </router-link>
        <button id="login" class="btn btn-primary gray mb-3 fs-6" type="button" @click="onLoginClick">
          登入後台
          <font-awesome-icon icon="long-arrow-alt-right" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>

import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { Login } from '@/API/Login'

export default {
  setup () {
    const router = useRouter()
    const store = useStore()
    const input = reactive({
      email: '',
      password: ''
    })
    const onLoginClick = () => {
      if (input.email === '' || input.password === '') return
      const requestData = {
        username: input.email,
        password: input.password
      }
      Login(requestData)
        .then(res => {
          if (!res) return
          const { token, expired } = res.data
          store.commit('SET_TOKEN', { token, expired })
          router.push({ name: 'MerchantHome' })
        })
        .catch(error => {
          console.log(error)
        })
    }
    return { onLoginClick, input }
  }
}
</script>

<style lang="sass" scoped>
.illustration
  width: 100%
  height: 100vh
  background: url(~@imgs/bcg.jpg) no-repeat
  background-size: cover
.username-wrap, .password-wrap
  position: relative

.login-form-container
  z-index: 2021
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  .login-form-wrap
    box-sizing: border-box
    position: relative
    box-shadow: 0 5px 10px 0 #4b473b
  & input
    padding-top: 20px
    padding-left: 10px
    width: 100%
    height: 50px
    background: #ffbd5a
  label
    position: absolute
    top: 0
    left: 10px
    line-height: 50px
    font-size: 1.125rem
    transition: 0.2s ease all

.login-form-wrap::after
  content: ''
  z-index: -1
  position: absolute
  width: 100%
  height: 100%
  top: 0px
  left: 0px
  backdrop-filter: blur(3px)
  background-color: rgba(0, 0, 0 , .15)
.login-form-wrap
  input:not(:focus):valid ~ label, input:focus ~ label
    line-height: 20px
    font-size: 0.75rem
</style>
