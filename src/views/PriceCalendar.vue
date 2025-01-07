<template>
  <div class="price-calendar">
    <!-- 搜索条件 -->
    <el-card class="search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="出发城市">
          <el-autocomplete
            v-model="searchForm.from"
            :fetch-suggestions="queryCity"
            placeholder="请输入出发城市"
            @select="handleFromSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="到达城市">
          <el-autocomplete
            v-model="searchForm.to"
            :fetch-suggestions="queryCity"
            placeholder="请输入到达城市"
            @select="handleToSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
            v-model="searchForm.month"
            type="month"
            placeholder="选择月份"
            @change="handleMonthChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchPrices">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 价格日历 -->
    <el-card class="calendar-box" v-loading="loading">
      <div class="calendar-header">
        <h3>{{ currentMonthText }}价格日历</h3>
        <div class="calendar-nav">
          <el-button-group>
            <el-button 
              icon="el-icon-arrow-left" 
              size="small"
              @click="previousMonth">
              上个月
            </el-button>
            <el-button 
              size="small"
              @click="currentMonth">
              本月
            </el-button>
            <el-button 
              icon="el-icon-arrow-right" 
              size="small"
              @click="nextMonth">
              下个月
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="calendar-grid">
        <!-- 星期表头 -->
        <div class="calendar-weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <!-- 日历格子 -->
        <div class="calendar-days">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="day-cell"
            :class="{
              'other-month': !day.currentMonth,
              'today': day.isToday,
              'has-flights': day.lowestPrice
            }"
            @click="day.currentMonth && handleDayClick(day)">
            <div class="day-number">{{ day.dayNumber }}</div>
            <div v-if="day.lowestPrice" class="price-info">
              <span class="price">¥{{ day.lowestPrice }}</span>
              <small v-if="day.priceType === 'discount'" class="discount">特惠</small>
            </div>
            <div v-else-if="day.currentMonth" class="no-flight">
              暂无航班
            </div>
          </div>
        </div>
      </div>

      <!-- 图例说明 -->
      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-color normal"></span>
          <span>正常价格</span>
        </div>
        <div class="legend-item">
          <span class="legend-color discount"></span>
          <span>特惠价格</span>
        </div>
        <div class="legend-item">
          <span class="legend-color today"></span>
          <span>今日</span>
        </div>
      </div>
    </el-card>

    <!-- 当日航班列表对话框 -->
    <el-dialog
      :title="selectedDate ? `${selectedDate} 航班列表` : '航班列表'"
      :visible.sync="flightDialogVisible"
      width="70%">
      <el-table :data="selectedFlights" v-loading="flightsLoading">
        <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
        <el-table-column prop="departureTime" label="起飞时间" width="180"></el-table-column>
        <el-table-column prop="arrivalTime" label="到达时间" width="180"></el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template slot-scope="scope">
            <span :class="{ 'discount-price': scope.row.isDiscount }">
              ¥{{ scope.row.price }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="seats" label="剩余座位" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              size="small"
              @click="bookFlight(scope.row)">
              预订
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PriceCalendar',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        month: new Date()
      },
      loading: false,
      flightsLoading: false,
      flightDialogVisible: false,
      selectedDate: '',
      selectedFlights: [],
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      cities: [
        { value: '北京', address: 'PEK' },
        { value: '上海', address: 'SHA' },
        { value: '广州', address: 'CAN' },
        { value: '深圳', address: 'SZX' }
      ]
    }
  },
  computed: {
    currentMonthText() {
      const date = this.searchForm.month
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    },
    calendarDays() {
      // 生成日历数据
      const date = this.searchForm.month
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      const days = []
      const today = new Date()

      // 添加上月剩余日期
      const prevMonthDays = firstDay.getDay()
      const prevMonth = new Date(year, month, 0)
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        days.push({
          dayNumber: prevMonth.getDate() - i,
          currentMonth: false,
          isToday: false
        })
      }

      // 添加本月日期
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const isToday = year === today.getFullYear() && 
                       month === today.getMonth() && 
                       i === today.getDate()
        
        // 模拟价格数据
        const lowestPrice = Math.random() > 0.2 ? 
          Math.floor(Math.random() * 1000 + 500) : 0
        
        days.push({
          dayNumber: i,
          currentMonth: true,
          isToday,
          lowestPrice,
          priceType: Math.random() > 0.7 ? 'discount' : 'normal'
        })
      }

      // 添加下月开始日期
      const nextDays = 42 - days.length
      for (let i = 1; i <= nextDays; i++) {
        days.push({
          dayNumber: i,
          currentMonth: false,
          isToday: false
        })
      }

      return days
    }
  },
  methods: {
    queryCity(queryString, cb) {
      const results = queryString ? 
        this.cities.filter(city => 
          city.value.toLowerCase().includes(queryString.toLowerCase())
        ) : 
        this.cities
      cb(results)
    },
    handleFromSelect(item) {
      this.searchForm.from = item.value
    },
    handleToSelect(item) {
      this.searchForm.to = item.value
    },
    handleMonthChange(date) {
      this.searchForm.month = date
      this.searchPrices()
    },
    searchPrices() {
      if (!this.searchForm.from || !this.searchForm.to) {
        this.$message.warning('请选择出发城市和到达城市')
        return
      }
      
      this.loading = true
      // 模拟API调用
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    previousMonth() {
      const date = new Date(this.searchForm.month)
      date.setMonth(date.getMonth() - 1)
      this.searchForm.month = date
      this.searchPrices()
    },
    currentMonth() {
      this.searchForm.month = new Date()
      this.searchPrices()
    },
    nextMonth() {
      const date = new Date(this.searchForm.month)
      date.setMonth(date.getMonth() + 1)
      this.searchForm.month = date
      this.searchPrices()
    },
    handleDayClick(day) {
      if (!day.lowestPrice) return
      
      this.selectedDate = `${this.currentMonthText}${day.dayNumber}日`
      this.flightDialogVisible = true
      this.flightsLoading = true

      // 模拟加载航班数据
      setTimeout(() => {
        this.selectedFlights = Array(5).fill().map((_, index) => ({
          flightNo: `CA${1234 + index}`,
          departureTime: `${this.selectedDate} ${8 + index}:00`,
          arrivalTime: `${this.selectedDate} ${10 + index}:00`,
          price: day.lowestPrice + Math.floor(Math.random() * 200),
          isDiscount: Math.random() > 0.7,
          seats: Math.floor(Math.random() * 50)
        }))
        this.flightsLoading = false
      }, 500)
    },
    bookFlight(flight) {
      this.$router.push({
        name: 'FlightDetail',
        params: { id: flight.flightNo },
        query: {
          date: this.selectedDate,
          from: this.searchForm.from,
          to: this.searchForm.to
        }
      })
    }
  }
}
</script>

<style scoped>
.price-calendar {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.calendar-box {
  min-height: 600px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
}

.calendar-grid {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
}

.weekday {
  padding: 12px;
  text-align: center;
  color: #606266;
  font-weight: bold;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  cursor: pointer;
  transition: all 0.3s;
}

.day-cell:hover {
  background-color: #F5F7FA;
}

.day-cell.other-month {
  background-color: #FAFAFA;
  color: #C0C4CC;
  cursor: default;
}

.day-cell.today {
  background-color: #ECF5FF;
}

.day-number {
  font-size: 16px;
  margin-bottom: 8px;
}

.price-info {
  text-align: center;
}

.price {
  color: #F56C6C;
  font-weight: bold;
}

.discount {
  display: inline-block;
  margin-left: 4px;
  padding: 2px 4px;
  background-color: #F56C6C;
  color: white;
  border-radius: 2px;
  font-size: 12px;
}

.no-flight {
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  border-radius: 2px;
}

.legend-color.normal {
  background-color: #F56C6C;
}

.legend-color.discount {
  background-color: #E6A23C;
}

.legend-color.today {
  background-color: #ECF5FF;
  border: 1px solid #409EFF;
}

.discount-price {
  color: #E6A23C;
}
</style> 