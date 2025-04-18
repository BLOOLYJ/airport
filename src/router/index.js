import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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

// 路由懒加载
const IndexComponent = () => import(/* webpackChunkName: "home-page" */ '@/views/Index.vue')
const ScheduleComponent = () => import(/* webpackChunkName: "schedule" */ '@/views/Schedule.vue')
const ServicesComponent = () => import(/* webpackChunkName: "services" */ '@/views/Services.vue')
const UserProfileComponent = () => import(/* webpackChunkName: "user" */ '@/views/UserProfile.vue')
const FavoritesComponent = () => import(/* webpackChunkName: "user" */ '@/views/user/Favorites.vue')

// 懒加载服务相关页面
const MealServiceComponent = () => import(/* webpackChunkName: "service-meal" */ '@/views/services/MealService.vue')
const InsuranceServiceComponent = () => import(/* webpackChunkName: "service-insurance" */ '@/views/services/InsuranceService.vue')
const VipServiceComponent = () => import(/* webpackChunkName: "service-vip" */ '@/views/services/VipService.vue')

// 添加旅游数据统计页面
const TourismStats = () => import(/* webpackChunkName: "tourism-stats", webpackPrefetch: true */ '@/views/TourismStats.vue')

const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexComponent,
    meta: { title: '首页' }
  },
  {
    path: '/search',
    name: 'SearchFlights',
    component: SearchFlights
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: ScheduleComponent,
    meta: { title: '航班时刻表' }
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
    component: ServicesComponent,
    redirect: '/services/meal',
    children: [
      {
        path: 'meal',
        name: 'MealService',
        component: MealServiceComponent,
        meta: { title: '餐食服务' }
      },
      {
        path: 'baggage',
        name: 'BaggageService',
        component: BaggageService
      },
      {
        path: 'insurance',
        name: 'InsuranceService',
        component: InsuranceServiceComponent,
        meta: { title: '保险服务' }
      },
      {
        path: 'vip',
        name: 'VipService',
        component: VipServiceComponent,
        meta: { title: '贵宾服务' }
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
    component: UserProfileComponent,
    meta: { requiresAuth: true, title: '用户中心' }
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
    name: 'Favorites',
    component: FavoritesComponent,
    meta: { requiresAuth: true, title: '我的收藏' }
  },
  {
    path: '/tourism-stats',
    name: 'TourismStats',
    component: TourismStats,
    meta: { title: '旅游数据统计' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 进度条配置
NProgress.configure({ 
  showSpinner: false
})

// 路由守卫添加进度条和权限验证
router.beforeEach((to, from, next) => {
  NProgress.start()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 航空订票系统` : '航空订票系统'
  
  // 检查权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isLoggedIn = router.app.$store?.getters.isLoggedIn
    if (!isLoggedIn) {
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

router.afterEach(() => {
  NProgress.done()
})

export default router
