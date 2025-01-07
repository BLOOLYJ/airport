import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    flights: [],
    orders: []
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_USER(state) {
      state.user = null
      state.token = ''
      localStorage.removeItem('token')
    },
    SET_FLIGHTS(state, flights) {
      state.flights = flights
    },
    SET_ORDERS(state, orders) {
      state.orders = orders
    }
  },
  
  actions: {
    login({ commit }, credentials) {
      // 模拟登录
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: 1,
            username: credentials.username,
            email: 'user@example.com'
          }
          commit('SET_USER', mockUser)
          commit('SET_TOKEN', 'mock-token')
          resolve(mockUser)
        }, 1000)
      })
    },
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  },
  
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user,
    getFlights: state => state.flights,
    getOrders: state => state.orders
  }
}) 