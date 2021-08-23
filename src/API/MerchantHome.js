import service from './request.js'
const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  '$1'
)
const headers = { authorization: token }
const user = process.env.VUE_APP_PATH
// api/:api_path/admin/products/all
export function GetAllProducts (path = user) {
  return service.request({
    method: 'get',
    headers,
    url: `api/${path}/admin/products/all`
  })
}
