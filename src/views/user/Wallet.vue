<template>
  <div class="wallet-container">
    <el-card class="wallet-card">
      <div slot="header">
        <h2>我的钱包</h2>
      </div>

      <!-- 账户余额 -->
      <div class="balance-section">
        <div class="balance-info">
          <div class="balance-label">账户余额</div>
          <div class="balance-amount">¥{{ balance.toFixed(2) }}</div>
        </div>
        <el-button type="primary" @click="showRechargeDialog">充值</el-button>
      </div>

      <!-- 交易记录 -->
      <div class="transaction-section">
        <div class="section-header">
          <h3>交易记录</h3>
          <el-radio-group v-model="transactionType" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="recharge">充值</el-radio-button>
            <el-radio-button label="consume">消费</el-radio-button>
            <el-radio-button label="refund">退款</el-radio-button>
          </el-radio-group>
        </div>

        <el-table :data="filteredTransactions" stripe style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="type" label="类型" width="100">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额">
            <template slot-scope="scope">
              <span :class="{ 'income': scope.row.type === 'recharge' || scope.row.type === 'refund' }">
                {{ scope.row.type === 'consume' ? '-' : '+' }}¥{{ scope.row.amount.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 充值对话框 -->
    <el-dialog title="账户充值" :visible.sync="rechargeDialogVisible" width="400px">
      <el-form :model="rechargeForm" :rules="rechargeRules" ref="rechargeForm" label-width="80px">
        <el-form-item label="充值金额" prop="amount">
          <el-input-number 
            v-model="rechargeForm.amount" 
            :min="100" 
            :max="50000"
            :step="100"
            controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-radio-group v-model="rechargeForm.paymentMethod">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="unionpay">银联</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rechargeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge">确认充值</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserWallet',
  data() {
    return {
      balance: 2580.50,
      transactionType: 'all',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rechargeDialogVisible: false,
      rechargeForm: {
        amount: 1000,
        paymentMethod: 'alipay'
      },
      rechargeRules: {
        amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          { type: 'number', min: 100, max: 50000, message: '充值金额必须在100-50000之间', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      transactions: [
        {
          date: '2024-03-20 15:30',
          type: 'recharge',
          amount: 1000,
          description: '账户充值',
          status: '成功'
        },
        {
          date: '2024-03-19 14:20',
          type: 'consume',
          amount: 799,
          description: '机票购买 - CA1234',
          status: '成功'
        },
        {
          date: '2024-03-18 10:15',
          type: 'refund',
          amount: 650,
          description: '退票退款 - MU5678',
          status: '成功'
        }
      ]
    }
  },
  computed: {
    filteredTransactions() {
      if (this.transactionType === 'all') {
        return this.transactions
      }
      return this.transactions.filter(t => t.type === this.transactionType)
    }
  },
  methods: {
    getTagType(type) {
      const types = {
        recharge: 'success',
        consume: 'danger',
        refund: 'warning'
      }
      return types[type]
    },
    getTypeLabel(type) {
      const labels = {
        recharge: '充值',
        consume: '消费',
        refund: '退款'
      }
      return labels[type]
    },
    getStatusType(status) {
      return status === '成功' ? 'success' : 'info'
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // TODO: 加载对应页的数据
    },
    showRechargeDialog() {
      this.rechargeDialogVisible = true
    },
    handleRecharge() {
      this.$refs.rechargeForm.validate((valid) => {
        if (valid) {
          // TODO: 实现充值逻辑
          this.$message.success('充值请求已提交，请在新窗口完成支付')
          this.rechargeDialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.wallet-container {
  padding: 20px;
}

.wallet-card {
  max-width: 1000px;
  margin: 0 auto;
}

.balance-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.transaction-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

.income {
  color: #67C23A;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 