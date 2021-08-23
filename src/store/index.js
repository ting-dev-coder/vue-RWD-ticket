import { createStore } from 'vuex'

export default createStore({
  state: {
    token: '',
    laoding: false
  },
  mutations: {
    SET_TOKEN (state, data) {
      document.cookie = `hexToken=${data.token}; expires=${new Date(data.expired)}`
      state.token = data.token
    },
    SET_LOADING (state, data) {
      state.laoding = data
    }
  },
  actions: {
  },
  modules: {
  }
})
