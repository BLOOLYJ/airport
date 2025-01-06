import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index.vue'
import Services from '@/views/Services.vue'
import MealService from '@/views/services/MealService.vue'
import BaggageService from '@/views/services/BaggageService.vue'
import InsuranceService from '@/views/services/InsuranceService.vue'
import VipService from '@/views/services/VipService.vue'
import Promotions from '@/views/Promotions.vue'
import SearchFlights from '@/views/SearchFlights.vue'
import Schedule from '@/views/Schedule.vue'
import PriceCalendar from '@/views/PriceCalendar.vue'
import FlightDetail from '@/views/FlightDetail.vue'
import LoginRegister from '@/views/LoginRegister.vue'
import UserProfile from '@/views/UserProfile.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import UserWallet from '@/views/user/Wallet.vue'
import UserFavorites from '@/views/user/Favorites.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/search',
    name: 'SearchFlights',
    component: SearchFlights
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/price-calendar',
    name: 'PriceCalendar',
    component: PriceCalendar
  },
  {
    path: '/flight/:id',
    name: 'FlightDetail',
    component: FlightDetail
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
    redirect: '/services/meal',
    children: [
      {
        path: 'meal',
        name: 'MealService',
        component: MealService
      },
      {
        path: 'baggage',
        name: 'BaggageService',
        component: BaggageService
      },
      {
        path: 'insurance',
        name: 'InsuranceService',
        component: InsuranceService
      },
      {
        path: 'vip',
        name: 'VipService',
        component: VipService
      }
    ]
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: Promotions
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: LoginRegister
  },
  {
    path: '/user',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderManagement',
    component: OrderManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'UserWallet',
    component: UserWallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'UserFavorites',
    component: UserFavorites,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果需要登录权限，检查是否已登录
    if (!router.app.$store?.getters?.isLoggedIn) {
      // 未登录则跳转到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
