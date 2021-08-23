import Swal from 'sweetalert2'
import { Toast } from '@/utils/UseSwal'
import axios from 'axios'
import store from '@/store'
import myThis from '@/main'
const BASEURL = process.env.VUE_APP_API
const service = axios.create({
  baseURL: BASEURL
  // timeout: 6000
})
// 請求攔截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 響應攔截器
service.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.success) return response
    // status非200情況
    if (Array.isArray(data.message)) {
      myThis.$alert.show(data.message)
      setTimeout(() => {
        myThis.$alert.hide()
      }, 3000)
    } else {
      Toast.fire({ icon: 'error', title: data.message })
    }
    return null
  },
  (error) => {
    store.commit('SET_LOADING', false)
    Array.isArray(error.message)
      ? myThis.$alert.show(error.message)
      : Swal.fire(error.message)
    return Promise.reject(error)
  }
)
export default service
