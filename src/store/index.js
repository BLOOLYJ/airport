import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

// 持久化存储的token和用户信息
const TOKEN_KEY = 'airport_token'
const USER_KEY = 'airport_user'

export default new Vuex.Store({
  state: {
    token: Cookies.get(TOKEN_KEY) || '',
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    loading: false,
    recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]')
  },
  getters: {
    isLoggedIn: state => !!state.token,
    username: state => state.user?.username || '',
    userAvatar: state => state.user?.avatar || '',
    userId: state => state.user?.id,
    memberLevel: state => state.user?.memberLevel || '普通用户'
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    ADD_RECENT_SEARCH(state, search) {
      // 防止重复添加相同搜索
      const exists = state.recentSearches.some(
        s => s.departure === search.departure && s.arrival === search.arrival
      )
      
      if (!exists) {
        // 最多保存5个搜索记录
        if (state.recentSearches.length >= 5) {
          state.recentSearches.pop()
        }
        state.recentSearches.unshift({
          ...search,
          timestamp: new Date().toISOString()
        })
        localStorage.setItem('recent_searches', JSON.stringify(state.recentSearches))
      }
    },
    CLEAR_RECENT_SEARCHES(state) {
      state.recentSearches = []
      localStorage.removeItem('recent_searches')
    }
  },
  actions: {
    login({ commit }, credentials) {
      commit('SET_LOADING', true)
      
      // 模拟API请求
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // 假设这是从API获取的用户数据
            const token = 'fake-jwt-token'
            const user = {
              id: 1,
              username: credentials.username,
              email: 'user@example.com',
              avatar: '',
              memberLevel: '银卡会员',
              totalFlights: 12,
              totalMiles: 15680
            }
            
            // 保存到cookies和localStorage
            Cookies.set(TOKEN_KEY, token, { expires: 7 })
            localStorage.setItem(USER_KEY, JSON.stringify(user))
            
            // 更新状态
            commit('SET_TOKEN', token)
            commit('SET_USER', user)
            resolve(user)
          } catch (error) {
            reject(error)
          } finally {
            commit('SET_LOADING', false)
          }
        }, 1000)
      })
    },
    logout({ commit }) {
      // 清除token和用户信息
      Cookies.remove(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      commit('SET_TOKEN', '')
      commit('SET_USER', null)
      
      return Promise.resolve()
    }
  }
}) 