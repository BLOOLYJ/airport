<template>
  <div class="favorites-container">
    <el-card class="favorites-card">
      <div slot="header">
        <div class="header-content">
          <h2>我的收藏</h2>
          <el-radio-group v-model="viewType" size="small">
            <el-radio-button label="card">卡片视图</el-radio-button>
            <el-radio-button label="list">列表视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewType === 'card'" class="card-view">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(route, index) in favoriteRoutes" :key="index">
            <el-card class="route-card" shadow="hover">
              <div class="route-info">
                <div class="cities">
                  <span class="city">{{ route.departure }}</span>
                  <i class="el-icon-right"></i>
                  <span class="city">{{ route.arrival }}</span>
                </div>
                <div class="flight-info">
                  <span>{{ route.flightNo }}</span>
                  <span>{{ route.schedule }}</span>
                </div>
                <div class="price-info">
                  <span class="price">¥{{ route.lowestPrice }}</span>
                  <span class="price-label">起</span>
                </div>
              </div>
              <div class="card-actions">
                <el-button type="primary" size="small" @click="handleBook(route)">预订</el-button>
                <el-button type="text" size="small" @click="handleRemoveFavorite(route)">
                  <i class="el-icon-star-on"></i> 取消收藏
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <el-table :data="favoriteRoutes" stripe style="width: 100%">
          <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
          <el-table-column label="航线" width="250">
            <template slot-scope="scope">
              {{ scope.row.departure }} → {{ scope.row.arrival }}
            </template>
          </el-table-column>
          <el-table-column prop="schedule" label="班期" width="200"></el-table-column>
          <el-table-column prop="lowestPrice" label="最低价格" width="120">
            <template slot-scope="scope">
              ¥{{ scope.row.lowestPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="收藏时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleBook(scope.row)">预订</el-button>
              <el-button type="danger" size="small" @click="handleRemoveFavorite(scope.row)">取消收藏</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserFavorites',
  data() {
    return {
      viewType: 'card',
      currentPage: 1,
      pageSize: 9,
      total: 0,
      favoriteRoutes: [
        {
          id: 1,
          flightNo: 'CA1234',
          departure: '北京',
          arrival: '上海',
          schedule: '每日',
          lowestPrice: 580,
          addTime: '2024-03-20 15:30'
        },
        {
          id: 2,
          flightNo: 'MU5678',
          departure: '广州',
          arrival: '成都',
          schedule: '周一、周五',
          lowestPrice: 780,
          addTime: '2024-03-19 10:20'
        },
        {
          id: 3,
          flightNo: 'CZ3456',
          departure: '深圳',
          arrival: '西安',
          schedule: '周二、周四、周日',
          lowestPrice: 680,
          addTime: '2024-03-18 09:15'
        }
      ]
    }
  },
  methods: {
    handleBook(route) {
      this.$router.push({
        path: '/search',
        query: {
          from: route.departure,
          to: route.arrival
        }
      })
    },
    handleRemoveFavorite(route) {
      this.$confirm(`确定要取消收藏 ${route.departure} → ${route.arrival} 航线吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 实现取消收藏逻辑
        this.$message.success('已取消收藏')
      }).catch(() => {})
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // TODO: 加载对应页的数据
    }
  }
}
</script>

<style scoped>
.favorites-container {
  padding: 20px;
}

.favorites-card {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
}

.card-view {
  margin-top: 20px;
}

.route-card {
  margin-bottom: 20px;
}

.route-info {
  text-align: center;
  padding: 10px 0;
}

.cities {
  font-size: 18px;
  margin-bottom: 10px;
}

.city {
  font-weight: bold;
}

.el-icon-right {
  margin: 0 10px;
  color: #909399;
}

.flight-info {
  color: #606266;
  margin-bottom: 10px;
}

.flight-info span {
  margin: 0 10px;
}

.price-info {
  margin: 15px 0;
}

.price {
  font-size: 24px;
  color: #F56C6C;
  font-weight: bold;
}

.price-label {
  font-size: 14px;
  color: #909399;
  margin-left: 5px;
}

.card-actions {
  border-top: 1px solid #EBEEF5;
  padding-top: 10px;
  text-align: center;
}

.list-view {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 