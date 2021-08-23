// import router from './index'
import Swal from 'sweetalert2'
const whiteRouter = ['/login', '/shoppingCart']

export const userAuthGuard = (to, from, next) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
  if (whiteRouter.indexOf(to.path) === -1 && !token) {
    Swal.fire({ title: '尚未登入', icon: 'error' })
    next('/login')
  } else next()
}
