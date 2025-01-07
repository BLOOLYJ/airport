<template>
  <div class="services-container">
    <!-- 服务导航 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="餐食服务" name="meal">
        <div class="tab-icon"><i class="el-icon-dish"></i></div>
      </el-tab-pane>
      <el-tab-pane label="行李服务" name="baggage">
        <div class="tab-icon"><i class="el-icon-suitcase"></i></div>
      </el-tab-pane>
      <el-tab-pane label="保险服务" name="insurance">
        <div class="tab-icon"><i class="el-icon-umbrella"></i></div>
      </el-tab-pane>
      <el-tab-pane label="贵宾服务" name="vip">
        <div class="tab-icon"><i class="el-icon-trophy"></i></div>
      </el-tab-pane>
    </el-tabs>

    <!-- 服务内容区域 -->
    <div class="service-content">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <!-- 服务概览卡片 -->
    <el-row :gutter="20" v-if="showServiceCards">
      <!-- 餐食服务 -->
      <el-col :span="6">
        <el-card shadow="hover" class="service-card">
          <div class="service-icon">
            <i class="el-icon-dish"></i>
          </div>
          <div class="service-info">
            <h3>餐食服务</h3>
            <p>提供多样化的航空餐食选择，让您的旅程更加愉悦。</p>
            <ul class="service-features">
              <li>中西式餐点</li>
              <li>特色餐食</li>
              <li>提前预订</li>
            </ul>
            <el-button type="primary" @click="navigateToService('meal')">
              了解更多
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 行李服务 -->
      <el-col :span="6">
        <el-card shadow="hover" class="service-card">
          <div class="service-icon">
            <i class="el-icon-suitcase"></i>
          </div>
          <div class="service-info">
            <h3>行李服务</h3>
            <p>提供便捷的行李托运和额外行李购买服务。</p>
            <ul class="service-features">
              <li>在线托运</li>
              <li>额外行李</li>
              <li>特殊行李</li>
            </ul>
            <el-button type="primary" @click="navigateToService('baggage')">
              了解更多
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 保险服务 -->
      <el-col :span="6">
        <el-card shadow="hover" class="service-card">
          <div class="service-icon">
            <i class="el-icon-umbrella"></i>
          </div>
          <div class="service-info">
            <h3>保险服务</h3>
            <p>为您的旅程提供全方位的保障。</p>
            <ul class="service-features">
              <li>航空意外险</li>
              <li>行李保险</li>
              <li>延误保险</li>
            </ul>
            <el-button type="primary" @click="navigateToService('insurance')">
              了解更多
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- VIP服务 -->
      <el-col :span="6">
        <el-card shadow="hover" class="service-card">
          <div class="service-icon">
            <i class="el-icon-trophy"></i>
          </div>
          <div class="service-info">
            <h3>贵宾服务</h3>
            <p>享受专属的贵宾服务，让您的旅程更加舒适。</p>
            <ul class="service-features">
              <li>贵宾休息室</li>
              <li>专人服务</li>
              <li>快速通道</li>
            </ul>
            <el-button type="primary" @click="navigateToService('vip')">
              了解更多
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ServicesPage',
  data() {
    return {
      activeTab: 'meal',
      showServiceCards: true
    }
  },
  created() {
    // 根据当前路由设置激活的标签
    const path = this.$route.path
    const service = path.split('/').pop()
    if (service && this.services.find(s => s.id === service)) {
      this.activeTab = service
      this.showServiceCards = false
    }
  },
  watch: {
    // 监听路由变化
    '$route'(to) {
      const service = to.path.split('/').pop()
      if (service && this.services.find(s => s.id === service)) {
        this.activeTab = service
        this.showServiceCards = false
      } else {
        this.showServiceCards = true
      }
    }
  },
  methods: {
    handleTabClick(tab) {
      this.navigateToService(tab.name)
    },
    navigateToService(serviceId) {
      this.$router.push(`/services/${serviceId}`)
    }
  },
  computed: {
    services() {
      return [
        {
          id: 'meal',
          title: '餐食服务',
          icon: 'el-icon-dish',
          description: '提供多样化的航空餐食选择，让您的旅程更加愉悦。',
          features: ['中西式餐点', '特色餐食', '提前预订']
        },
        {
          id: 'baggage',
          title: '行李服务',
          icon: 'el-icon-suitcase',
          description: '提供便捷的行李托运和额外行李购买服务。',
          features: ['在线托运', '额外行李', '特殊行李']
        },
        {
          id: 'insurance',
          title: '保险服务',
          icon: 'el-icon-umbrella',
          description: '为您的旅程提供全方位的保障。',
          features: ['航空意外险', '行李保险', '延误保险']
        },
        {
          id: 'vip',
          title: '贵宾服务',
          icon: 'el-icon-trophy',
          description: '享受专属的贵宾服务，让您的旅程更加舒适。',
          features: ['贵宾休息室', '专人服务', '快速通道']
        }
      ]
    }
  }
}
</script>

<style scoped>
.services-container {
  padding: 20px;
}

.service-content {
  margin: 20px 0;
  min-height: 400px;
}

.service-card {
  height: 100%;
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.service-icon {
  text-align: center;
  margin-bottom: 20px;
}

.service-icon i {
  font-size: 48px;
  color: #409EFF;
}

.service-info {
  text-align: center;
}

.service-info h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #303133;
}

.service-info p {
  margin: 0 0 15px;
  color: #606266;
  font-size: 14px;
  height: 40px;
  overflow: hidden;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}

.service-features li {
  color: #909399;
  font-size: 14px;
  margin: 5px 0;
}

.tab-icon {
  display: inline-block;
  margin-right: 5px;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 标签样式 */
:deep(.el-tabs__nav) {
  display: flex;
  width: 100%;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}

:deep(.el-tabs__active-bar) {
  background-color: #409EFF;
}
</style> 