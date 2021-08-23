import service from './request.js'
const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  '$1'
)
const headers = { authorization: token }
const user = process.env.VUE_APP_PATH
// 新增文章 api/:api_path/admin/article
export function AddArticile (data, path = user) {
  return service.request({
    method: 'post',
    headers,
    url: `api/${path}/admin/article`,
    data: { data }
  })
}
// 編輯文章 api/:api_path/admin/article/:id
export function EditArticile (data, path = user) {
  return service.request({
    method: 'put',
    headers,
    url: `api/${path}/admin/article/${data.id}`,
    data: { data }
  })
}
// 刪除文章 api/:api_path/admin/article/:id
export function DeletArticile (ID, path = user) {
  return service.request({
    method: 'delete',
    headers,
    url: `api/${path}/admin/article/${ID}`
  })
}
// 取得單一文章 api/:api_path/admin/article/:id
export function GetMArticile (ID, path = user) {
  return service.request({
    method: 'get',
    headers,
    url: `api/${path}/admin/article/${ID}`
  })
}

// 取得文章列表 api/:api_path/admin/articles?page=:page
export function GetArticiles (page, path = user) {
  return service.request({
    method: 'get',
    headers,
    url: `api/${path}/admin/articles`,
    params: { page }
  })
}
