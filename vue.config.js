const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/airport/'  // 替换为你的仓库名
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
