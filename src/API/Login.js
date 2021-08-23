import service from './request.js'
// 登入請求
export function Login (data) {
  return service.request({
    method: 'post',
    url: 'admin/signin',
    data
  })
}
export function Logout (data) {
  return service.request({
    method: 'post',
    url: '/logout'
  })
}
