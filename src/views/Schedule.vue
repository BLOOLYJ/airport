<template>
  <div class="schedule-page" v-loading="loading">
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      style="margin-bottom: 20px;">
    </el-alert>

    <!-- 搜索条件 -->
    <el-card class="search-card">
      <div slot="header">
        <h3>航班时刻查询</h3>
      </div>
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="100px" :inline="true">
        <el-form-item label="出发城市" prop="departure">
          <el-select 
            v-model="searchForm.departure" 
            filterable 
            placeholder="请选择"
            style="width: 160px;">
            <el-option 
              v-for="city in cities" 
              :key="city" 
              :label="city" 
              :value="city">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到达城市" prop="arrival">
          <el-select 
            v-model="searchForm.arrival" 
            filterable 
            placeholder="请选择"
            style="width: 160px;">
            <el-option 
              v-for="city in cities" 
              :key="city" 
              :label="city" 
              :value="city">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="航班日期" prop="date">
          <el-date-picker 
            v-model="searchForm.date" 
            type="date" 
            placeholder="选择日期"
            :picker-options="dateOptions"
            style="width: 160px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="searching">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 航班列表 -->
    <el-card v-if="flights.length > 0" class="flight-list">
      <div slot="header" class="list-header">
        <span>航班列表</span>
        <div class="header-actions">
          <el-radio-group v-model="sortBy" size="small" @change="handleSort">
            <el-radio-button label="departure_time">起飞时间</el-radio-button>
            <el-radio-button label="duration">飞行时长</el-radio-button>
            <el-radio-button label="price">价格</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table
        :data="sortedFlights"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column label="航班号" prop="flightNo" width="120">
          <template slot-scope="scope">
            <span class="flight-no">{{ scope.row.flightNo }}</span>
            <el-tag 
              size="mini" 
              :type="scope.row.status === '准点' ? 'success' : 'warning'"
              style="margin-left: 5px">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间信息" width="300">
          <template slot-scope="scope">
            <div class="time-info">
              <div class="departure">
                <span class="time">{{ scope.row.departureTime }}</span>
                <span class="city">{{ scope.row.departure }}</span>
              </div>
              <div class="duration">
                <div class="line"></div>
                <span>{{ scope.row.duration }}</span>
                <div class="line"></div>
              </div>
              <div class="arrival">
                <span class="time">{{ scope.row.arrivalTime }}</span>
                <span class="city">{{ scope.row.arrival }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="机型" prop="aircraft" width="120">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200"
              trigger="hover">
              <div class="aircraft-info">
                <p><i class="el-icon-info"></i> {{ scope.row.aircraftInfo }}</p>
                <p><i class="el-icon-s-cooperation"></i> 座位数：{{ scope.row.seats }}</p>
              </div>
              <span slot="reference">{{ scope.row.aircraft }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="餐食" width="100">
          <template slot-scope="scope">
            <i 
              :class="scope.row.meal ? 'el-icon-food success' : 'el-icon-close'"
              :style="{ color: scope.row.meal ? '#67C23A' : '#909399' }">
            </i>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="150">
          <template slot-scope="scope">
            <div class="price-info">
              <span class="price">¥{{ scope.row.price }}</span>
              <el-tag 
                v-if="scope.row.discount" 
                size="mini" 
                type="danger">
                {{ scope.row.discount }}折
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              size="mini" 
              @click="handleBook(scope.row)">
              预订
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 无数据提示 -->
    <el-empty
      v-else-if="!loading && searched"
      description="暂无符合条件的航班"
      :image-size="200">
      <el-button type="primary" @click="resetForm">重新查询</el-button>
    </el-empty>
  </div>
</template>

<script>
export default {
  name: 'SchedulePage',
  data() {
    return {
      loading: false,
      error: null,
      searching: false,
      searched: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      sortBy: 'departure_time',
      searchForm: {
        departure: '',
        arrival: '',
        date: ''
      },
      searchRules: {
        departure: [
          { required: true, message: '请选择出发城市', trigger: 'change' }
        ],
        arrival: [
          { required: true, message: '请选择到达城市', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择航班日期', trigger: 'change' }
        ]
      },
      dateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      cities: ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', 
               '南京', '重庆', '青岛', '厦门', '昆明', '西双版纳', '三亚'],
      flights: []
    }
  },
  computed: {
    sortedFlights() {
      const flights = [...this.flights]
      switch (this.sortBy) {
        case 'departure_time':
          return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
        case 'duration':
          return flights.sort((a, b) => this.getDurationMinutes(a.duration) - this.getDurationMinutes(b.duration))
        case 'price':
          return flights.sort((a, b) => a.price - b.price)
        default:
          return flights
      }
    }
  },
  created() {
    // 从URL参数中获取初始搜索条件
    const { from, to, date } = this.$route.query
    if (from && to) {
      this.searchForm.departure = from
      this.searchForm.arrival = to
      if (date) {
        this.searchForm.date = new Date(date)
        this.handleSearch()
      }
    }
  },
  methods: {
    async handleSearch() {
      try {
        const valid = await this.$refs.searchForm.validate()
        if (valid) {
          this.searching = true
          this.loading = true
          this.error = null
          
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 模拟航班数据
          this.flights = [
            {
              flightNo: 'MU5100',
              departure: this.searchForm.departure,
              arrival: this.searchForm.arrival,
              departureTime: '07:30',
              arrivalTime: '09:45',
              duration: '2小时15分',
              aircraft: 'B737-800',
              aircraftInfo: '波音737-800客机',
              seats: 164,
              meal: true,
              price: 780,
              discount: 8.5,
              status: '准点'
            },
            {
              flightNo: 'CZ3901',
              departure: this.searchForm.departure,
              arrival: this.searchForm.arrival,
              departureTime: '08:45',
              arrivalTime: '11:00',
              duration: '2小时15分',
              aircraft: 'A320neo',
              aircraftInfo: '空客A320neo客机',
              seats: 186,
              meal: true,
              price: 820,
              status: '准点'
            },
            {
              flightNo: 'CA1234',
              departure: this.searchForm.departure,
              arrival: this.searchForm.arrival,
              departureTime: '10:30',
              arrivalTime: '12:45',
              duration: '2小时15分',
              aircraft: 'A321',
              aircraftInfo: '空客A321客机',
              seats: 196,
              meal: true,
              price: 920,
              discount: 9.0,
              status: '延误'
            }
          ]
          
          this.total = this.flights.length
          this.searched = true
          
          // 更新URL参数
          this.$router.push({
            query: {
              from: this.searchForm.departure,
              to: this.searchForm.arrival,
              date: this.searchForm.date
            }
          })
        }
      } catch (err) {
        this.error = '查询航班失败'
        this.$message.error(this.error)
      } finally {
        this.searching = false
        this.loading = false
      }
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.flights = []
      this.searched = false
      this.$router.push({ query: {} })
    },
    handleSort() {
      // 排序逻辑已在computed中实现
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // TODO: 实现分页加载
    },
    handleBook(flight) {
      this.$router.push({
        path: '/booking',
        query: {
          flightNo: flight.flightNo,
          date: this.searchForm.date
        }
      })
    },
    getDurationMinutes(duration) {
      const match = duration.match(/(\d+)小时(\d+)分/)
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2])
      }
      return 0
    },
    tableRowClassName({ row }) {
      if (row.status === '延误') {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style scoped>
.schedule-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flight-no {
  font-weight: bold;
}

.time-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.departure, .arrival {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.city {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.duration {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 12px;
  padding: 0 10px;
}

.line {
  width: 50px;
  height: 1px;
  background: #DCDFE6;
  margin: 0 5px;
}

.price-info {
  display: flex;
  align-items: center;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #F56C6C;
  margin-right: 5px;
}

.aircraft-info p {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.aircraft-info i {
  margin-right: 5px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 自定义表格行样式 */
:deep(.warning-row) {
  background: #fdf6ec;
}

.success {
  color: #67C23A;
}
</style>
