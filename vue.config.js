const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  devServer: {
    port: 8080, // 设置端口号
    host: '192.168.5.23', // ip
    disableHostCheck: true, // 是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查
    hotOnly: false, // 热更新
    https: false, // https:{type:Boolean}配置前缀
    open: false, // 配置自动启动浏览器
    proxy: null // 设置代理
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/ticket/' : '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
      .set('@imgs', resolve('src/assets/imgs'))
      .set('@components', resolve('src/components'))
    config.optimization.runtimeChunk('single')
  },
  css: {
    modules: false,
    loaderOptions: {
      sass: {
        prependData: '@import "./src/assets/styles/main";'
      }
    }
  }
}
