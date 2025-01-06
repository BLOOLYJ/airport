<template>
  <div class="vip-service">
    <!-- 贵宾服务介绍 -->
    <el-card class="vip-intro">
      <div class="intro-banner" :style="{ backgroundImage: `url(${require('@/assets/1.jpg')})` }">
        <div class="banner-content">
          <h2>尊享贵宾服务</h2>
          <p>享受从值机到登机的全程专属服务</p>
          <el-button type="warning" @click="scrollToPlans">
            查看会员等级
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 贵宾服务特权 -->
    <el-card class="vip-privileges">
      <div slot="header">
        <h3>贵宾特权</h3>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="6" v-for="privilege in privileges" :key="privilege.id">
          <div class="privilege-card">
            <div class="privilege-icon">
              <i :class="privilege.icon"></i>
            </div>
            <h4>{{ privilege.title }}</h4>
            <p>{{ privilege.description }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 会员等级计划 -->
    <el-card class="membership-plans" ref="plansSection">
      <div slot="header">
        <div class="header-flex">
          <h3>会员等级</h3>
          <el-radio-group v-model="planDuration" size="small">
            <el-radio-button label="monthly">月度会员</el-radio-button>
            <el-radio-button label="yearly">年度会员</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="8" v-for="plan in membershipPlans" :key="plan.id">
          <div class="plan-card" :class="{ 'featured': plan.featured }">
            <div class="plan-header" :style="{ backgroundColor: plan.color }">
              <div class="plan-badge" v-if="plan.featured">推荐</div>
              <h4>{{ plan.name }}</h4>
              <div class="plan-price">
                <span class="currency">¥</span>
                <span class="amount">{{ getPlanPrice(plan) }}</span>
                <span class="period">/{{ planDuration === 'monthly' ? '月' : '年' }}</span>
              </div>
            </div>
            
            <div class="plan-content">
              <ul class="benefits-list">
                <li v-for="(benefit, index) in plan.benefits" :key="index">
                  <i class="el-icon-check"></i>
                  {{ benefit }}
                </li>
              </ul>
              
              <el-button 
                :type="plan.featured ? 'warning' : 'primary'"
                class="subscribe-btn"
                @click="selectPlan(plan)">
                立即开通
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 贵宾厅位置 -->
    <el-card class="lounge-locations">
      <div slot="header">
        <h3>贵宾厅分布</h3>
      </div>

      <el-tabs v-model="activeCity" type="border-card">
        <el-tab-pane 
          v-for="city in loungeLocations" 
          :key="city.code"
          :label="city.name"
          :name="city.code">
          <div class="lounge-list">
            <div 
              v-for="lounge in city.lounges" 
              :key="lounge.id"
              class="lounge-item">
              <div class="lounge-info">
                <h4>{{ lounge.name }}</h4>
                <p>
                  <i class="el-icon-location"></i>
                  {{ lounge.location }}
                </p>
                <p>
                  <i class="el-icon-time"></i>
                  营业时间：{{ lounge.hours }}
                </p>
              </div>
              <div class="lounge-facilities">
                <el-tag 
                  v-for="facility in lounge.facilities" 
                  :key="facility"
                  size="small"
                  effect="plain">
                  {{ facility }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 开通确认对话框 -->
    <el-dialog
      title="确认开通会员"
      :visible.sync="dialogVisible"
      width="40%">
      <div v-if="selectedPlan" class="confirm-content">
        <div class="plan-summary">
          <h4>{{ selectedPlan.name }}</h4>
          <div class="summary-price">
            <span class="currency">¥</span>
            <span class="amount">{{ getPlanPrice(selectedPlan) }}</span>
            <span class="period">/{{ planDuration === 'monthly' ? '月' : '年' }}</span>
          </div>
        </div>

        <div class="payment-options">
          <h5>选择支付方式</h5>
          <el-radio-group v-model="paymentMethod">
            <el-radio label="wechat">
              <i class="payment-icon wechat"></i>
              微信支付
            </el-radio>
            <el-radio label="alipay">
              <i class="payment-icon alipay"></i>
              支付宝
            </el-radio>
          </el-radio-group>
        </div>

        <div class="terms-agreement">
          <el-checkbox v-model="agreement">
            我已阅读并同意
            <el-link type="primary" @click="showTerms">《会员服务条款》</el-link>
          </el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmSubscription"
          :disabled="!agreement || !paymentMethod">
          确认支付
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VipService',
  data() {
    return {
      planDuration: 'monthly',
      activeCity: 'PEK',
      dialogVisible: false,
      selectedPlan: null,
      paymentMethod: '',
      agreement: false,
      privileges: [
        {
          id: 1,
          icon: 'el-icon-s-custom',
          title: '专属值机柜台',
          description: '无需排队，快速办理值机手续'
        },
        {
          id: 2,
          icon: 'el-icon-coffee-cup',
          title: '贵宾休息室',
          description: '舒适环境，享用精致餐饮'
        },
        {
          id: 3,
          icon: 'el-icon-suitcase',
          title: '行李优先',
          description: '优先托运和领取行李'
        },
        {
          id: 4,
          icon: 'el-icon-guide',
          title: '专人引导',
          description: '全程专人引导服务'
        }
      ],
      membershipPlans: [
        {
          id: 'silver',
          name: '白银会员',
          color: '#909399',
          monthlyPrice: 299,
          yearlyPrice: 2999,
          benefits: [
            '专属值机柜台',
            '贵宾休息室使用2次/月',
            '行李优先托运',
            '累计积分1.2倍'
          ]
        },
        {
          id: 'gold',
          name: '黄金会员',
          color: '#E6A23C',
          featured: true,
          monthlyPrice: 599,
          yearlyPrice: 5999,
          benefits: [
            '专属值机柜台',
            '贵宾休息室不限次数',
            '行李优先托运',
            '专人引导服务',
            '累计积分1.5倍',
            '免费升舱机会1次/月'
          ]
        },
        {
          id: 'platinum',
          name: '白金会员',
          color: '#409EFF',
          monthlyPrice: 999,
          yearlyPrice: 9999,
          benefits: [
            '专属值机柜台',
            '贵宾休息室不限次数',
            '行李优先托运',
            '专人引导服务',
            '累计积分2倍',
            '免费升舱机会2次/月',
            '指定航班保位服务'
          ]
        }
      ],
      loungeLocations: [
        {
          code: 'PEK',
          name: '北京首都国际机场',
          lounges: [
            {
              id: 'pek-t3',
              name: 'T3航站楼贵宾厅',
              location: 'T3-C区域，安检后',
              hours: '06:00-22:00',
              facilities: ['淋浴间', '商务中心', '休息区', '餐饮服务']
            },
            {
              id: 'pek-t2',
              name: 'T2航站楼贵宾厅',
              location: 'T2-D区域，安检后',
              hours: '全天24小时',
              facilities: ['休息区', '餐饮服务', '按摩服务']
            }
          ]
        },
        // ... 其他城市贵宾厅信息
      ]
    }
  },
  methods: {
    scrollToPlans() {
      this.$refs.plansSection.$el.scrollIntoView({ 
        behavior: 'smooth' 
      })
    },
    getPlanPrice(plan) {
      return this.planDuration === 'monthly' 
        ? plan.monthlyPrice 
        : plan.yearlyPrice
    },
    selectPlan(plan) {
      this.selectedPlan = plan
      this.dialogVisible = true
    },
    showTerms() {
      // 显示会员服务条款
    },
    confirmSubscription() {
      this.$confirm('确认开通会员服务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟支付过程
        this.$message({
          type: 'success',
          message: '会员开通成功！',
          duration: 2000
        })
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.vip-service {
  padding: 20px;
}

.vip-intro, .vip-privileges, .membership-plans, .lounge-locations {
  margin-bottom: 20px;
}

.intro-banner {
  background: linear-gradient(135deg, #1c1c1c 0%, #4a4a4a 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 4px;
  text-align: center;
}

.banner-content h2 {
  font-size: 36px;
  margin: 0 0 20px;
}

.privilege-card {
  text-align: center;
  padding: 30px 20px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  transition: all 0.3s;
}

.privilege-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.privilege-icon {
  font-size: 40px;
  color: #E6A23C;
  margin-bottom: 20px;
}

.plan-card {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.plan-card.featured {
  transform: scale(1.05);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.plan-header {
  color: white;
  padding: 30px 20px;
  text-align: center;
  position: relative;
}

.plan-badge {
  position: absolute;
  top: 20px;
  right: -30px;
  background: #F56C6C;
  color: white;
  padding: 5px 30px;
  transform: rotate(45deg);
}

.plan-price {
  margin-top: 20px;
}

.currency {
  font-size: 20px;
  vertical-align: top;
}

.amount {
  font-size: 36px;
  font-weight: bold;
}

.period {
  font-size: 14px;
}

.benefits-list {
  list-style: none;
  padding: 20px;
  margin: 0;
}

.benefits-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.benefits-list li i {
  color: #67C23A;
  margin-right: 10px;
}

.subscribe-btn {
  width: calc(100% - 40px);
  margin: 0 20px 20px;
}

.lounge-item {
  padding: 20px;
  border-bottom: 1px solid #EBEEF5;
}

.lounge-item:last-child {
  border-bottom: none;
}

.lounge-info h4 {
  margin: 0 0 10px;
}

.lounge-info p {
  margin: 5px 0;
  color: #606266;
}

.lounge-info i {
  margin-right: 5px;
}

.lounge-facilities {
  margin-top: 10px;
}

.lounge-facilities .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.payment-options {
  margin: 20px 0;
}

.payment-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}

.terms-agreement {
  margin-top: 20px;
}
</style> 