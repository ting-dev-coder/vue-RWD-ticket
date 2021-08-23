import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import './router/cookiePerimt'
import VCalendar from 'v-calendar'
import Swal from '@/utils/UseSwal'
import load from './components/alert/index'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import { library } from '@fortawesome/fontawesome-svg-core'
import 'ant-design-vue/dist/antd.css'
import 'bootstrap'
import {
  faSpinner,
  faCartPlus,
  faStar,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faShoppingCart,
  faTicketAlt,
  faHome,
  faBars,
  faChevronRight,
  faChevronLeft,
  faShippingFast,
  faPlus,
  faDolly,
  faNewspaper,
  faMoneyCheckAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'

import 'aos/dist/aos.css'
Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
// 設定預設語系
setLocale('zh_TW')
library.add(faSpinner)
library.add(faCartPlus)
library.add(faStar)
library.add(faLongArrowAltLeft)
library.add(faLongArrowAltRight)
library.add(faChevronRight)
library.add(faShoppingCart)
library.add(faTicketAlt)
library.add(faHome)
library.add(faBars)
library.add(faPlus)
library.add(faShippingFast)
library.add(faDolly)
library.add(faNewspaper)
library.add(faMoneyCheckAlt)
library.add(faChevronLeft)
library.add(faTrashAlt)

const myThis = createApp(App)
  .use(store)
  .use(Swal)
  .use(router)
  .use(load)
  .use(VCalendar, {})
  .use(Antd)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('Form', Form)
  .component('Field', Field)
  .component('ErrorMessage', ErrorMessage)
  .mount('#app')

export default myThis
