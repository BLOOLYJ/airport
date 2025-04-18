<template>
  <div class="favorites-container">
    <el-card class="favorites-card" v-loading="loading">
      <div slot="header">
        <div class="header-content">
          <h2>我的收藏</h2>
          <div class="header-actions">
            <el-radio-group v-model="viewType" size="small">
              <el-radio-button label="card">卡片视图</el-radio-button>
              <el-radio-button label="list">列表视图</el-radio-button>
            </el-radio-group>
            <el-button 
              type="danger" 
              size="small" 
              icon="el-icon-delete"
              @click="clearAllFavorites"
              :disabled="favoriteRoutes.length === 0">
              清空收藏
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <el-empty 
        v-if="!loading && favoriteRoutes.length === 0"
        description="暂无收藏航线"
        :image-size="200">
        <el-button type="primary" @click="$router.push('/')">去首页看看</el-button>
      </el-empty>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        style="margin-bottom: 20px;">
      </el-alert>

      <!-- 卡片视图 -->
      <div v-if="viewType === 'card' && favoriteRoutes.length > 0" class="card-view">
        <el-row :gutter="20">
          <el-col 
            :xs="24" :sm="12" :md="8" 
            v-for="(route, index) in favoriteRoutes" 
            :key="index"
            class="card-col">
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
                  <span class="price">{{ route.lowestPrice | currency }}</span>
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
      <div v-else-if="viewType === 'list' && favoriteRoutes.length > 0" class="list-view">
        <el-table 
          :data="favoriteRoutes" 
          stripe 
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
          <el-table-column label="航线">
            <template slot-scope="scope">
              {{ scope.row.departure }} → {{ scope.row.arrival }}
            </template>
          </el-table-column>
          <el-table-column prop="schedule" label="班期" width="200"></el-table-column>
          <el-table-column prop="lowestPrice" label="最低价格" width="120">
            <template slot-scope="scope">
              {{ scope.row.lowestPrice | currency }}
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="收藏时间" width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleBook(scope.row)">预订</el-button>
              <el-button type="danger" size="mini" @click="handleRemoveFavorite(scope.row)">取消收藏</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="favoriteRoutes.length > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
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
      loading: false,
      error: null,
      favoriteRoutes: []
    }
  },
  created() {
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟数据，实际项目中应从API获取
        this.favoriteRoutes = [
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
        
        this.total = this.favoriteRoutes.length
      } catch (error) {
        this.error = '获取收藏列表失败，请稍后再试'
        console.error('获取收藏列表错误:', error)
      } finally {
        this.loading = false
      }
    },
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
        // 实际项目中应调用API删除收藏
        const index = this.favoriteRoutes.findIndex(item => item.id === route.id)
        if (index !== -1) {
          this.favoriteRoutes.splice(index, 1)
          this.total = this.favoriteRoutes.length
        }
        this.$message.success('已取消收藏')
      }).catch(() => {})
    },
    clearAllFavorites() {
      if (this.favoriteRoutes.length === 0) return
      
      this.$confirm('确定要清空所有收藏吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 实际项目中应调用API清空收藏
        this.favoriteRoutes = []
        this.total = 0
        this.$message.success('已清空所有收藏')
      }).catch(() => {})
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchFavorites() // 实际项目中应传入分页参数
    },
    tableRowClassName({row, rowIndex}) {
      // 可以根据数据状态添加不同的样式
      return ''
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-view {
  margin-top: 20px;
}

.card-col {
  margin-bottom: 20px;
}

.route-card {
  height: 100%;
  transition: all 0.3s;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.route-info {
  padding-bottom: 15px;
}

.cities {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.city {
  color: #303133;
}

.cities i {
  margin: 0 10px;
  color: #409EFF;
}

.flight-info {
  display: flex;
  justify-content: space-between;
  color: #606266;
  margin-bottom: 10px;
}

.price-info {
  text-align: center;
  margin-bottom: 15px;
}

.price {
  font-size: 24px;
  color: #F56C6C;
  font-weight: bold;
}

.price-label {
  font-size: 14px;
  color: #909399;
}

.card-actions {
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
  }
  
  .cities {
    font-size: 16px;
  }
  
  .price {
    font-size: 20px;
  }
}
</style> 