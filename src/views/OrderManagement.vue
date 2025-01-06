<template>
  <div class="order-management" v-loading="loading">
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      style="margin-bottom: 20px;">
    </el-alert>

    <!-- 订单统计卡片 -->
    <el-row :gutter="20" class="statistics" v-if="!error">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="el-icon-tickets"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.total }}</div>
              <div class="stat-label">总订单</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon pending">
              <i class="el-icon-time"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.pending }}</div>
              <div class="stat-label">待支付</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="el-icon-check"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon cancelled">
              <i class="el-icon-close"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.cancelled }}</div>
              <div class="stat-label">已取消</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单搜索和筛选 -->
    <el-card class="filter-section" v-if="!error">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="订单号">
          <el-input v-model="filterForm.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="航班号">
          <el-input v-model="filterForm.flightNo" placeholder="航班号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" placeholder="全部状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待支付" value="pending"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单列表 -->
    <el-card v-if="!error">
      <div v-if="orders.length === 0 && !loading" class="empty-state">
        <i class="el-icon-document"></i>
        <p>暂无订单数据</p>
      </div>

      <el-table
        v-else
        :data="orders"
        style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
        <el-table-column label="航线信息">
          <template slot-scope="scope">
            {{ scope.row.from }} → {{ scope.row.to }}
          </template>
        </el-table-column>
        <el-table-column prop="departureTime" label="起飞时间" width="180"></el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.status === 'pending'"
              @click="handlePay(scope.row)">支付</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.status === 'pending'"
              @click="handleCancel(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="orders.length > 0">
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

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="50%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="航班号">{{ currentOrder.flightNo }}</el-descriptions-item>
        <el-descriptions-item label="航班日期">{{ currentOrder.departureTime }}</el-descriptions-item>
        <el-descriptions-item label="出发城市">{{ currentOrder.from }}</el-descriptions-item>
        <el-descriptions-item label="到达城市">{{ currentOrder.to }}</el-descriptions-item>
        <el-descriptions-item label="乘客姓名">{{ currentOrder.passengerName }}</el-descriptions-item>
        <el-descriptions-item label="证件号码">{{ currentOrder.idNumber }}</el-descriptions-item>
        <el-descriptions-item label="座位类型">{{ currentOrder.seatClass }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentOrder.price }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ getStatusText(currentOrder.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderManagementPage',
  data() {
    return {
      // 统计数据
      statistics: {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0
      },
      // 筛选表单
      filterForm: {
        orderNo: '',
        flightNo: '',
        status: '',
        dateRange: []
      },
      // 订单列表
      orders: [],
      loading: false,
      error: null,
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 详情对话框
      dialogVisible: false,
      currentOrder: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      try {
        this.loading = true
        await Promise.all([
          this.fetchStatistics(),
          this.fetchOrders()
        ])
      } catch (err) {
        this.error = err.message
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },
    // 获取统计数据
    async fetchStatistics() {
      // 模拟数据
      return new Promise(resolve => {
        setTimeout(() => {
          this.statistics = {
            total: 125,
            pending: 15,
            completed: 98,
            cancelled: 12
          }
          resolve()
        }, 500)
      })
    },
    // 获取订单列表
    async fetchOrders() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            this.orders = Array(10).fill().map((_, index) => ({
              orderNo: `ORD${String(index + 1).padStart(6, '0')}`,
              flightNo: 'CA1234',
              from: '北京',
              to: '上海',
              departureTime: '2024-03-20 08:00',
              price: 1200,
              status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
              createTime: '2024-03-19 14:30',
              passengerName: '张三',
              idNumber: '110101199001011234',
              seatClass: '经济舱'
            }))
            this.total = 125
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 1000)
      })
    },
    // 状态相关方法
    getStatusType(status) {
      const types = {
        pending: 'warning',
        completed: 'success',
        cancelled: 'info'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        pending: '待支付',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || status
    },
    // 搜索和重置
    handleSearch() {
      this.currentPage = 1
      this.fetchOrders()
    },
    resetFilter() {
      this.$refs.filterForm?.resetFields()
      this.handleSearch()
    },
    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchOrders()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchOrders()
    },
    // 操作方法
    handleDetail(row) {
      this.currentOrder = row
      this.dialogVisible = true
    },
    handlePay(row) {
      this.$confirm('确认支付订单 ' + row.orderNo + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('支付成功')
        this.fetchOrders()
      })
    },
    handleCancel(row) {
      this.$confirm('确认取消订单 ' + row.orderNo + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('订单已取消')
        this.fetchOrders()
      })
    }
  }
}
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 10px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.stat-card {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon i {
  font-size: 24px;
}

.stat-icon.pending {
  background-color: #E6A23C;
}

.stat-icon.completed {
  background-color: #67C23A;
}

.stat-icon.cancelled {
  background-color: #909399;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.filter-section {
  margin: 20px 0;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 