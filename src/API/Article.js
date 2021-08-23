import service from './request.js'

const user = process.env.VUE_APP_PATH

// /api/:api_path/articles?page=:page

export function GetArticiles (path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/articles`
  })
}
// api/:api_path/article/:id
export function GetArticile (ID, path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/article/${ID}`
  })
}
