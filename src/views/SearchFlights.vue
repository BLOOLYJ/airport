<template>
  <div class="search-container">
    <el-card class="search-filter">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-select
            v-model="searchForm.from"
            filterable
            placeholder="出发城市">
            <el-option
              v-for="city in cities"
              :key="city"
              :label="city"
              :value="city">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.to"
            filterable
            placeholder="到达城市">
            <el-option
              v-for="city in cities"
              :key="city"
              :label="city"
              :value="city">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading" style="margin-top: 20px">
      <div slot="header">
        <span>航班列表</span>
        <el-radio-group v-model="sortBy" size="small" style="margin-left: 20px">
          <el-radio-button label="price">按价格排序</el-radio-button>
          <el-radio-button label="time">按时间排序</el-radio-button>
        </el-radio-group>
      </div>

      <el-table :data="sortedFlights" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="flight-detail">
              <el-form-item label="航空公司">
                <span>{{ props.row.airline }}</span>
              </el-form-item>
              <el-form-item label="机型">
                <span>{{ props.row.aircraft }}</span>
              </el-form-item>
              <el-form-item label="餐食">
                <span>{{ props.row.meal }}</span>
              </el-form-item>
              <el-form-item label="准点率">
                <el-progress :percentage="props.row.punctuality"></el-progress>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
        <el-table-column label="航线" width="250">
          <template slot-scope="scope">
            <div class="flight-route">
              <span class="city">{{ scope.row.from }}</span>
              <span class="arrow">→</span>
              <span class="city">{{ scope.row.to }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="300">
          <template slot-scope="scope">
            <div class="flight-time">
              <div>
                <span class="time">{{ scope.row.departureTime }}</span>
                <span class="terminal">T{{ scope.row.departureTerminal }}</span>
              </div>
              <div class="duration">{{ scope.row.duration }}分钟</div>
              <div>
                <span class="time">{{ scope.row.arrivalTime }}</span>
                <span class="terminal">T{{ scope.row.arrivalTerminal }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="150">
          <template slot-scope="scope">
            <div class="price">
              <span class="amount">¥{{ scope.row.price }}</span>
              <el-tag size="mini" v-if="scope.row.discount" type="danger">{{ scope.row.discount }}折</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewDetail(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SearchFlights',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        date: new Date()
      },
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      sortBy: 'time',
      cities: ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      flights: [
        {
          id: 1,
          flightNo: 'CA1234',
          from: '北京',
          to: '上海',
          departureTime: '08:00',
          arrivalTime: '10:00',
          departureTerminal: '2',
          arrivalTerminal: '1',
          duration: 120,
          price: 1200,
          discount: 8.5,
          airline: '中国国际航空',
          aircraft: 'B737-800',
          meal: '有',
          punctuality: 95
        },
        {
          id: 2,
          flightNo: 'MU5678',
          from: '北京',
          to: '上海',
          departureTime: '09:30',
          arrivalTime: '11:30',
          departureTerminal: '3',
          arrivalTerminal: '2',
          duration: 120,
          price: 980,
          discount: 7.5,
          airline: '东方航空',
          aircraft: 'A320',
          meal: '有',
          punctuality: 92
        },
        {
          id: 3,
          flightNo: 'CZ3456',
          from: '北京',
          to: '上海',
          departureTime: '11:00',
          arrivalTime: '13:00',
          departureTerminal: '2',
          arrivalTerminal: '1',
          duration: 120,
          price: 1500,
          airline: '南方航空',
          aircraft: 'B787',
          meal: '有',
          punctuality: 88
        }
      ]
    }
  },
  computed: {
    sortedFlights() {
      return [...this.flights].sort((a, b) => {
        if (this.sortBy === 'price') {
          return a.price - b.price
        } else {
          return a.departureTime.localeCompare(b.departureTime)
        }
      })
    }
  },
  methods: {
    handleSearch() {
      this.loading = true
      // 模拟API调用
      setTimeout(() => {
        // 根据实际搜索条件过滤航班
        this.flights = this.flights.filter(flight => {
          return (!this.searchForm.from || flight.from === this.searchForm.from) &&
                 (!this.searchForm.to || flight.to === this.searchForm.to)
        })
        this.loading = false
      }, 1000)
    },
    resetSearch() {
      this.searchForm = {
        from: '',
        to: '',
        date: new Date()
      }
      this.handleSearch()
    },
    viewDetail(flight) {
      this.$router.push({
        name: 'FlightDetail',
        params: { id: flight.id }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleSearch()
    }
  },
  created() {
    // 获取URL参数并自动搜索
    const query = this.$route.query
    if (query.from) this.searchForm.from = query.from
    if (query.to) this.searchForm.to = query.to
    if (query.date) this.searchForm.date = new Date(query.date)
    this.handleSearch()
  }
}
</script>

<style scoped>
.search-container {
  padding: 20px;
}

.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow {
  color: #909399;
  margin: 0 10px;
}

.flight-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 16px;
  font-weight: bold;
}

.terminal {
  font-size: 12px;
  color: #909399;
  margin-left: 5px;
}

.duration {
  font-size: 12px;
  color: #909399;
  margin: 5px 0;
}

.price {
  display: flex;
  align-items: center;
}

.amount {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
  margin-right: 10px;
}

.flight-detail {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 