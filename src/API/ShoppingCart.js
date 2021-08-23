import service from './request.js'

const user = process.env.VUE_APP_PATH

// api/:api_path/products/all
export function GetAllProduct (page, path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/products/all`
  })
}
// 獲取列表 /api/:api_path/products?page=:page
export function GetProductData (page, path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/products`,
    params: { page }
  })
}
// 獲取單一品項 /api/:api_path/product/:id
export function GetSingleProduct (ID, path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/product/${ID}`
  })
}
// 加入購物車 /api/:api_path/cart
export function AddCart (data, path = user) {
  return service.request({
    method: 'post',
    url: `api/${path}/cart`,
    data: { data },
    self_loading: true
  })
}
// 更新購物車 /api/:api_path/cart/:id
export function UpdateCart (data, path = user) {
  return service.request({
    method: 'put',
    url: `api/${path}/cart/${data.product_id}`,
    data: { data }
  })
}
// 獲取購物車列表 /api/:api_path/cart
export function GetCartData (path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/cart`
  })
}
// 刪除某一筆購物車資料 /api/:api_path/cart/:id
export function DelSingleProduct (ID, path = user) {
  return service.request({
    method: 'delete',
    url: `api/${path}/cart/${ID}`
  })
}
// 刪除全部購物車 /api/:api_path/carts
export function DelProducts (path = user) {
  return service.request({
    method: 'delete',
    url: `api/${path}/carts`
  })
}
// 結帳付款 /api/:api_path/order
export function Order (data, path = user) {
  return service.request({
    method: 'post',
    url: `api/${path}/order`,
    data: { data }
  })
}
// 結帳付款 /api/:api_path/order/:order_id

export function ConfirmOrder (ID, path = user) {
  return service.request({
    method: 'get',
    url: `api/${path}/order/${ID}`
  })
}
// `/api/:api_path/pay/${this.order.id}`;
export function Checkout (ID, path = user) {
  return service.request({
    method: 'post',
    url: `api/${path}/pay/${ID}`
  })
}
// /api/:api_path/coupon
export function CheckoCoupon (data, path = user) {
  return service.request({
    method: 'post',
    url: `api/${path}/coupon`,
    data: { data }
  })
}
