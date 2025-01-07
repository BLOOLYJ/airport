<template>
  <div class="flight-detail">
    <el-card v-loading="loading">
      <div slot="header">
        <span>航班详情</span>
        <el-button 
          style="float: right; padding: 3px 0" 
          type="text"
          @click="$router.go(-1)">
          返回
        </el-button>
      </div>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon>
      </el-alert>

      <!-- 航班信息 -->
      <el-row :gutter="20" v-if="flight && !error">
        <el-col :span="16">
          <!-- 航班基本信息 -->
          <div class="flight-info">
            <div class="flight-route">
              <div class="city">
                <h2>{{ flight.from }}</h2>
                <p>{{ flight.departureTime }}</p>
                <p>{{ flight.departureAirport }}</p>
              </div>
              <div class="flight-duration">
                <el-divider direction="horizontal">
                  <img src="@/assets/images/airlines/icon-plane.png" class="flight-icon" alt="航班图标">
                  {{ flight.duration }}
                </el-divider>
                <div>航班号：{{ flight.flightNo }}</div>
              </div>
              <div class="city">
                <h2>{{ flight.to }}</h2>
                <p>{{ flight.arrivalTime }}</p>
                <p>{{ flight.arrivalAirport }}</p>
              </div>
            </div>

            <!-- 航班详细信息 -->
            <el-descriptions class="margin-top" title="航班信息" :column="2" border>
              <el-descriptions-item label="航空公司">
                <img :src="require(`@/assets/images/airlines/airline-${flight.airline}.png`)" class="airline-logo" :alt="flight.airline">
                {{ flight.airline }}
              </el-descriptions-item>
              <el-descriptions-item label="机型">{{ flight.aircraft }}</el-descriptions-item>
              <el-descriptions-item label="准点率">{{ flight.onTimeRate }}</el-descriptions-item>
              <el-descriptions-item label="餐食">{{ flight.meal ? '提供' : '不提供' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>

        <!-- 价格和预订部分 -->
        <el-col :span="8">
          <div class="booking-card">
            <h3>价格详情</h3>
            <div class="price">
              <span class="currency">¥</span>
              <span class="amount">{{ flight.price }}</span>
            </div>
            
            <div class="ticket-type" v-if="flight.availableSeats > 0">
              <el-radio-group v-model="selectedClass">
                <el-radio label="economy">经济舱</el-radio>
                <el-radio label="business">商务舱</el-radio>
              </el-radio-group>
            </div>

            <div class="seat-info">
              剩余座位: {{ flight.availableSeats }}
            </div>

            <el-button 
              type="primary" 
              style="width: 100%; margin-top: 20px"
              :disabled="flight.availableSeats === 0"
              @click="handleBooking">
              {{ flight.availableSeats > 0 ? '立即预订' : '已售罄' }}
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <el-skeleton :rows="6" animated />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FlightDetailPage',
  data() {
    return {
      flight: null,
      selectedClass: 'economy',
      loading: true,
      error: null
    }
  },
  created() {
    this.loadFlightDetail()
  },
  methods: {
    loadFlightDetail() {
      // 模拟获取航班详情数据
      this.loading = true
      this.error = null
      
      setTimeout(() => {
        try {
          const flightId = this.$route.params.id
          if (!flightId) {
            throw new Error('航班ID不存在')
          }

          this.flight = {
            id: flightId,
            flightNo: 'CA1234',
            from: '北京',
            to: '上海',
            departureTime: '2024-03-20 08:00',
            arrivalTime: '2024-03-20 10:00',
            departureAirport: '首都国际机场 T3',
            arrivalAirport: '浦东国际机场 T2',
            duration: '2小时',
            airline: '中国国际航空',
            aircraft: 'Boeing 737-800',
            onTimeRate: '95%',
            meal: true,
            price: 1200,
            availableSeats: 45
          }
        } catch (err) {
          this.error = err.message
          this.$message.error(err.message)
        } finally {
          this.loading = false
        }
      }, 1000)
    },
    handleBooking() {
      if (!this.$store.getters.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push({
          name: 'LoginRegister',
          query: { redirect: this.$route.fullPath }
        })
        return
      }

      // 模拟订票逻辑
      this.$confirm('确认预订该航班?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('预订成功！')
        this.$router.push('/orders')
      }).catch(() => {
        this.$message.info('已取消预订')
      })
    }
  }
}
</script>

<style scoped>
.flight-detail {
  padding: 20px;
}

.flight-route {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.city {
  text-align: center;
  flex: 1;
}

.city h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.city p {
  margin: 5px 0;
  color: #606266;
}

.flight-duration {
  flex: 1;
  text-align: center;
}

.booking-card {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.price {
  text-align: center;
  margin: 20px 0;
}

.currency {
  font-size: 20px;
  color: #f56c6c;
}

.amount {
  font-size: 36px;
  font-weight: bold;
  color: #f56c6c;
}

.ticket-type {
  margin: 20px 0;
}

.seat-info {
  text-align: center;
  color: #606266;
  margin: 10px 0;
}

.loading {
  padding: 20px;
}

.flight-icon {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.airline-logo {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  vertical-align: middle;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.flight-route {
  background-image: linear-gradient(to right, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.2));
  background-size: cover;
  background-position: center;
  color: #303133;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.flight-route::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent);
  background-size: 4px 4px;
  opacity: 0.3;
}

.city h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #303133;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style> 