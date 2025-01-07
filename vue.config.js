const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/airport/'  // 这里必须和您的仓库名一致
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
