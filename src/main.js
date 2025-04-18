import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 配置axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '/api'
axios.defaults.timeout = 10000

// 请求拦截器 - 添加token
axios.interceptors.request.use(
  config => {
    const token = store.state.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 统一错误处理
axios.interceptors.response.use(
  response => response,
  error => {
    const { status, data } = error.response || {}
    
    if (status === 401) {
      // 未授权，清除token并跳转到登录页
      store.dispatch('logout')
      router.push('/login')
      Vue.prototype.$message.error('会话已过期，请重新登录')
    } else if (status === 403) {
      Vue.prototype.$message.error('没有操作权限')
    } else if (status === 404) {
      Vue.prototype.$message.error('请求的资源不存在')
    } else if (status === 500) {
      Vue.prototype.$message.error('服务器错误，请稍后再试')
    } else {
      Vue.prototype.$message.error(data?.message || '网络错误，请稍后再试')
    }
    
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

// 全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err)
  Vue.prototype.$message.error('系统出现错误，请刷新页面或联系客服')
}

// 全局注册过滤器
Vue.filter('dateFormat', (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(d.getDate()).padStart(2, '0'))
    .replace('HH', String(d.getHours()).padStart(2, '0'))
    .replace('mm', String(d.getMinutes()).padStart(2, '0'))
    .replace('ss', String(d.getSeconds()).padStart(2, '0'))
})

// 价格格式化
Vue.filter('currency', (value, symbol = '¥', decimals = 0) => {
  if (!value) return `${symbol}0`
  const formattedValue = Number(value).toFixed(decimals)
  return `${symbol}${formattedValue}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
