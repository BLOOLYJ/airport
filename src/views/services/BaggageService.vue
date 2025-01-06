<template>
  <div class="baggage-service">
    <el-card class="service-card">
      <div slot="header">
        <h2>行李服务</h2>
      </div>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="行李规则" name="rules">
          <div class="rules-content">
            <h3>基本行李限额</h3>
            <el-table :data="baggageRules" stripe>
              <el-table-column prop="class" label="舱位等级" width="180"></el-table-column>
              <el-table-column prop="weight" label="重量限制"></el-table-column>
              <el-table-column prop="pieces" label="件数限制"></el-table-column>
            </el-table>

            <h3 class="mt-4">特殊行李说明</h3>
            <el-collapse>
              <el-collapse-item title="运动器材" name="1">
                <div>高尔夫球具、滑雪装备等特殊运动器材需提前申请</div>
              </el-collapse-item>
              <el-collapse-item title="乐器" name="2">
                <div>大型乐器需要单独购买座位</div>
              </el-collapse-item>
              <el-collapse-item title="宠物运输" name="3">
                <div>宠物运输需提前48小时预约，并准备相关证件</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <el-tab-pane label="额外行李" name="extra">
          <div class="extra-content">
            <el-alert
              title="温馨提示"
              type="info"
              description="建议提前购买额外行李额度，机场现场购买价格会更高"
              show-icon
              :closable="false"
              class="mb-4">
            </el-alert>

            <el-table :data="extraBaggageFees" stripe>
              <el-table-column prop="weight" label="额外重量" width="180"></el-table-column>
              <el-table-column prop="priceAdvance" label="提前购买价格"></el-table-column>
              <el-table-column prop="priceAirport" label="机场购买价格"></el-table-column>
            </el-table>

            <el-button type="primary" class="mt-4" @click="handlePurchase">
              购买额外行李额度
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BaggageService',
  data() {
    return {
      activeTab: 'rules',
      baggageRules: [
        { class: '头等舱', weight: '40kg', pieces: '2件' },
        { class: '商务舱', weight: '30kg', pieces: '2件' },
        { class: '经济舱', weight: '20kg', pieces: '1件' }
      ],
      extraBaggageFees: [
        { weight: '5kg', priceAdvance: '¥200', priceAirport: '¥300' },
        { weight: '10kg', priceAdvance: '¥400', priceAirport: '¥600' },
        { weight: '15kg', priceAdvance: '¥600', priceAirport: '¥900' }
      ]
    }
  },
  methods: {
    handlePurchase() {
      this.$message({
        message: '请先登录后进行购买',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.baggage-service {
  padding: 20px;
}

.service-card {
  max-width: 1000px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.rules-content, .extra-content {
  padding: 20px 0;
}

h3 {
  margin-bottom: 20px;
  color: #303133;
}
</style> 