import { createRouter, createWebHashHistory } from 'vue-router'
import { userAuthGuard } from './cookiePerimt'
const Login = () => import('@views/Login.vue')
const Layout = () => import('@views/Layout/Fontend')
const Home = () => import('@views/Fontend/Home')
const Article = () => import('@views/Fontend/Article/Content')
const ArticleList = () => import('@views/Fontend/Article/List')
const Shopping = () => import('@views/Fontend/Shopping')
const CheckoutOrder = () => import('@views/Fontend/ShoppingCart/CheckoutOrder')
const BuyerInfo = () => import('@views/Fontend/ShoppingCart')
const PaymentComplete = () => import('@views/Fontend/PaymentComplete')
const ItemDetail = () => import('@views/Fontend/ItemDetail')
const CommonQuestions = () => import('@views/Fontend/CommonQuestions')
const MerchantLayout = () => import('@views/Layout/Backend')
const MerchantHome = () => import('@views/Backend/Home.vue')
const MerchantArticleList = () => import('@views/Backend/Article/List')
const MerchantAddArticle = () => import('@views/Backend/Article/NewArticle')
const MerchantArticle = () => import('@views/Backend/Article/Content')
const MerchantOrders = () => import('@views/Backend/Orders')
const MerchantProducts = () => import('@views/Backend/Products')
const MerchantVoucher = () => import('@views/Backend/Voucher')
const routes = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/merchant',
    name: 'Merchant',
    redirect: '/merchant/home',
    component: MerchantLayout,
    beforeEnter: (to, from, next) => {
      userAuthGuard(to, from, next)
    },
    children: [
      {
        path: 'home',
        name: 'MerchantHome',
        component: MerchantHome
      },
      {
        path: 'products',
        name: 'MerchantProducts',
        component: MerchantProducts
      },
      {
        path: 'article/add/:id?',
        name: 'MerchantAddArticle',
        component: MerchantAddArticle
      },
      {
        path: 'orders',
        name: 'MerchantOrders',
        component: MerchantOrders
      },
      {
        path: 'article/:id?',
        name: 'MerchantArticle',
        component: MerchantArticle
      },
      {
        path: 'article/list',
        name: 'MerchantArticleList',
        component: MerchantArticleList
      },
      {
        path: 'voucher',
        name: 'MerchantVoucher',
        component: MerchantVoucher
      }
    ]
  },
  {
    path: '/shopping',
    name: 'Shopping',
    redirect: '/shopping/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'Q&A',
        name: 'CommonQuestions',
        component: CommonQuestions
      },
      {
        path: 'order',
        name: 'Order',
        component: Shopping
      },
      {
        path: 'cart',
        name: 'Cart',
        component: BuyerInfo
      },
      {
        path: 'paymentComplete',
        name: 'PaymentComplete',
        component: PaymentComplete
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: Article
      },
      {
        path: 'article/list',
        name: 'ArticleList',
        component: ArticleList
      }
    ]
  },
  {
    path: '/item',
    name: 'ItemDetail',
    redirect: '/item/detail',
    component: Layout,
    children: [
      {
        path: 'detail',
        name: 'ItemDetail',
        component: ItemDetail
      }
    ]
  },
  {
    path: '/buyerInfo',
    name: 'BuyerInfo',
    component: BuyerInfo
  },
  {
    path: '/checkout',
    name: 'CheckoutOrder',
    redirect: '/checkout/order',
    component: Layout,
    children: [
      {
        path: 'order',
        name: 'oredr',
        component: CheckoutOrder
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    hidden: true,
    component: () => import('@views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    document.getElementById('app').scrollIntoView()
    return null
  }
})

export default router
