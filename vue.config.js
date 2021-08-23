const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
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