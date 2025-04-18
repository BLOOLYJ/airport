const { defineConfig } = require('@vue/cli-service')
// 暂时注释掉这行，直到安装了这个依赖
// const CompressionPlugin = require('compression-webpack-plugin')

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
  },
  // 添加webpack配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 暂时注释掉压缩插件的使用
      /*
      config.plugins.push(
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      )
      */
      
      // 优化分包策略部分可以保留
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                return `vendor.${packageName.replace('@', '')}`
              }
            },
            commons: {
              name: 'chunk-commons',
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            },
            elementUI: {
              name: 'chunk-elementUI',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              priority: 10
            }
          }
        }
      }
    }
  },
  // CSS配置
  css: {
    // 是否提取css到单独的文件
    extract: process.env.NODE_ENV === 'production',
    // 开启CSS source maps
    sourceMap: process.env.NODE_ENV !== 'production',
    // CSS预处理器配置
    loaderOptions: {
      sass: {
        // 全局变量 - 如果文件不存在，先注释掉
        additionalData: `
          @import "@/assets/styles/variables.scss";
          // @import "@/assets/styles/mixins.scss"; // 这个文件可能还不存在
        `
      }
    }
  },
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
