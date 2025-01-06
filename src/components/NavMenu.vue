<template>
  <div class="nav-container">
    <el-menu 
      :default-active="activeIndex" 
      mode="horizontal" 
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      
      <!-- Logo区域 -->
      <div class="logo-container">
        <img src="@/assets/images/airlines/logo.png" alt="Logo" class="logo">
        <span class="logo-text">机票管理系统</span>
      </div>

      <!-- 主导航菜单 -->
      <el-menu-item index="/">首页</el-menu-item>
      
      <el-submenu index="flights">
        <template slot="title">航班服务</template>
        <el-menu-item index="/search">航班搜索</el-menu-item>
        <el-menu-item index="/schedule">航班时刻表</el-menu-item>
        <el-menu-item index="/price-calendar">价格日历</el-menu-item>
      </el-submenu>

      <el-submenu index="services">
        <template slot="title">增值服务</template>
        <el-menu-item index="/services/meal">
          <i class="el-icon-food"></i>
          航空餐食
        </el-menu-item>
        <el-menu-item index="/services/baggage">
          <i class="el-icon-suitcase"></i>
          行李服务
        </el-menu-item>
        <el-menu-item index="/services/insurance">
          <i class="el-icon-umbrella"></i>
          航空保险
        </el-menu-item>
        <el-menu-item index="/services/vip">
          <i class="el-icon-trophy"></i>
          贵宾服务
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="/promotions">特惠活动</el-menu-item>
      
      <!-- 右侧菜单 -->
      <div class="nav-right">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            placeholder="搜索航班/目的地"
            prefix-icon="el-icon-search"
            v-model="searchQuery"
            @keyup.enter.native="handleSearch"
            size="small">
          </el-input>
        </div>

        <!-- 通知中心 -->
        <el-badge :value="notificationCount" class="notification-badge">
          <el-button type="text" @click="showNotifications">
            <i class="el-icon-bell"></i>
          </el-button>
        </el-badge>

        <!-- 用户菜单 -->
        <template v-if="!isLoggedIn">
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" size="small" @click="$router.push('/login?tab=register')">注册</el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleCommand">
            <span class="user-profile">
              <el-avatar :size="32" :src="userAvatar">{{ username.charAt(0) }}</el-avatar>
              <span class="username">{{ username }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">
                <i class="el-icon-user"></i> 个人中心
              </el-dropdown-item>
              <el-dropdown-item command="orders">
                <i class="el-icon-tickets"></i> 我的订单
              </el-dropdown-item>
              <el-dropdown-item command="wallet">
                <i class="el-icon-wallet"></i> 我的钱包
              </el-dropdown-item>
              <el-dropdown-item command="favorites">
                <i class="el-icon-star-off"></i> 收藏航线
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="el-icon-switch-button"></i> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </el-menu>

    <!-- 通知抽屉 -->
    <el-drawer
      title="通知中心"
      :visible.sync="notificationDrawer"
      direction="rtl"
      size="300px">
      <div class="notification-tabs">
        <el-tabs v-model="activeNotificationTab">
          <el-tab-pane label="系统通知" name="system">
            <notification-list :notifications="systemNotifications" />
          </el-tab-pane>
          <el-tab-pane label="订单通知" name="order">
            <notification-list :notifications="orderNotifications" />
          </el-tab-pane>
          <el-tab-pane label="促销通知" name="promotion">
            <notification-list :notifications="promotionNotifications" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import NotificationList from './NotificationList.vue'

export default {
  name: 'NavMenu',
  components: {
    NotificationList
  },
  data() {
    return {
      activeIndex: '/',
      searchQuery: '',
      notificationCount: 3,
      notificationDrawer: false,
      activeNotificationTab: 'system',
      userAvatar: '',
      systemNotifications: [
        { id: 1, title: '系统维护通知', content: '系统将于今晚22:00进行维护升级', time: '2024-03-20 15:00', read: false },
        { id: 2, title: '账号安全提醒', content: '建议您定期修改密码', time: '2024-03-19 10:00', read: true }
      ],
      orderNotifications: [
        { id: 3, title: '订单支付提醒', content: '您有一笔订单待支付', time: '2024-03-20 14:30', read: false },
        { id: 4, title: '航班提醒', content: '您的航班CA1234将于明天起飞', time: '2024-03-20 09:00', read: false }
      ],
      promotionNotifications: [
        { id: 5, title: '特惠机票', content: '北京-上海航线特惠', time: '2024-03-19 16:00', read: true }
      ]
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    username() {
      return this.$store.state.user?.username || '用户'
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/search',
          query: { keyword: this.searchQuery }
        })
      }
    },
    showNotifications() {
      this.notificationDrawer = true
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/user')
          break
        case 'orders':
          this.$router.push('/orders')
          break
        case 'wallet':
          this.$router.push('/wallet')
          break
        case 'favorites':
          this.$router.push('/favorites')
          break
        case 'logout':
          this.$store.dispatch('logout')
          this.$router.push('/')
          this.$message.success('已退出登录')
          break
      }
    }
  }
}
</script>

<style scoped>
.nav-container {
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.logo-container {
  float: left;
  display: flex;
  align-items: center;
  height: 60px;
  margin-right: 20px;
  padding: 0 20px;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.nav-right {
  float: right;
  display: flex;
  align-items: center;
  height: 60px;
  margin-right: 20px;
}

.search-box {
  margin-right: 20px;
  width: 200px;
}

.notification-badge {
  margin: 0 20px;
}

.notification-badge .el-button {
  color: #fff;
  font-size: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff;
}

.username {
  margin-left: 8px;
}

.notification-tabs {
  padding: 20px;
}

/* 覆盖Element UI的一些默认样式 */
.el-menu--horizontal > .el-menu-item {
  height: 60px;
  line-height: 60px;
}

.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 60px;
  line-height: 60px;
}
</style> 