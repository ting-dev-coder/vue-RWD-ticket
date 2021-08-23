import { createApp, reactive } from 'vue'

import alert from './Alert'

const msg = reactive({
  show: false
})

const $alert = createApp(alert, { msg }).mount(document.createElement('div'))
const load = {
  show (text) { // 控制顯示loadning的方法
    msg.show = true
    msg.list = text
    document.body.appendChild($alert.$el)
  },
  hide () { // 控制隱藏loadning的方法
    msg.show = false
  }
}

export default {
  install (app) {
    app.config.globalProperties.$alert = load
  }
}
