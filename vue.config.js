const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/airport/'
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '航空订票系统'
    }
  }
})
