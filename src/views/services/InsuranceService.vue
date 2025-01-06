<template>
  <div class="insurance-service">
    <!-- 保险产品介绍 -->
    <el-card class="insurance-intro">
      <div slot="header">
        <h3>航空保险服务</h3>
      </div>
      
      <!-- 保险产品轮播 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="intro-content">
            <h4>为什么选择我们的保险服务？</h4>
            <div class="feature-grid">
              <div class="feature-item" v-for="feature in features" :key="feature.id">
                <i :class="feature.icon"></i>
                <div class="feature-text">
                  <h5>{{ feature.title }}</h5>
                  <p>{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-carousel height="250px" indicator-position="outside">
            <el-carousel-item v-for="item in carouselItems" :key="item.id">
              <div class="carousel-content" :style="{ backgroundColor: item.bgColor }">
                <i :class="item.icon"></i>
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-card>

    <!-- 保险产品列表 -->
    <el-card class="insurance-products">
      <div slot="header">
        <div class="header-flex">
          <h3>保险产品</h3>
          <el-radio-group v-model="tripType" size="small">
            <el-radio-button label="domestic">国内航线</el-radio-button>
            <el-radio-button label="international">国际航线</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="8" v-for="product in insuranceProducts" :key="product.id">
          <div class="product-card" :class="{ 'recommended': product.recommended }">
            <div class="product-header" :style="{ backgroundColor: product.headerColor }">
              <h4>{{ product.name }}</h4>
              <div class="price-tag">
                ¥<span class="price">{{ product.price }}</span>/人
              </div>
              <el-tag 
                v-if="product.recommended" 
                type="warning" 
                class="recommend-tag">
                推荐
              </el-tag>
            </div>
            <div class="product-content">
              <div class="coverage-list">
                <div 
                  v-for="(coverage, index) in product.coverage" 
                  :key="index"
                  class="coverage-item">
                  <i class="el-icon-check"></i>
                  <span>{{ coverage.item }}</span>
                  <span class="coverage-amount">{{ coverage.amount }}</span>
                </div>
              </div>
              <div class="product-features">
                <el-tag 
                  v-for="tag in product.features" 
                  :key="tag"
                  size="small"
                  effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
              <el-button 
                type="primary" 
                class="purchase-btn"
                :class="{ 'is-recommended': product.recommended }"
                @click="selectInsurance(product)">
                立即投保
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 理赔指南 -->
    <el-card class="claims-guide">
      <div slot="header">
        <h3>理赔指南</h3>
      </div>

      <el-steps :active="1" align-center>
        <el-step 
          v-for="step in claimSteps" 
          :key="step.id"
          :title="step.title"
          :description="step.description"
          :icon="step.icon">
        </el-step>
      </el-steps>

      <div class="claims-contact">
        <h4>紧急联系方式</h4>
        <el-row :gutter="20">
          <el-col :span="8" v-for="contact in emergencyContacts" :key="contact.type">
            <div class="contact-card">
              <i :class="contact.icon"></i>
              <div class="contact-info">
                <h5>{{ contact.type }}</h5>
                <p>{{ contact.value }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 投保确认对话框 -->
    <el-dialog
      title="确认投保信息"
      :visible.sync="dialogVisible"
      width="40%">
      <div v-if="selectedProduct" class="confirm-content">
        <div class="confirm-header">
          <h4>{{ selectedProduct.name }}</h4>
          <div class="confirm-price">
            ¥<span class="price">{{ selectedProduct.price }}</span>/人
          </div>
        </div>

        <el-form :model="insuranceForm" label-width="100px" class="confirm-form">
          <el-form-item label="航班号" required>
            <el-input v-model="insuranceForm.flightNo"></el-input>
          </el-form-item>
          <el-form-item label="投保人数">
            <el-input-number 
              v-model="insuranceForm.passengers" 
              :min="1" 
              :max="9">
            </el-input-number>
          </el-form-item>
          <el-form-item label="总保费">
            <span class="total-premium">
              ¥{{ totalPremium }}
            </span>
          </el-form-item>
        </el-form>

        <div class="terms-check">
          <el-checkbox v-model="insuranceForm.agreement">
            我已阅读并同意
            <el-link type="primary" @click="showTerms">《保险条款》</el-link>
          </el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmPurchase"
          :disabled="!insuranceForm.agreement">
          确认投保
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InsuranceService',
  data() {
    return {
      tripType: 'domestic',
      dialogVisible: false,
      selectedProduct: null,
      insuranceForm: {
        flightNo: '',
        passengers: 1,
        agreement: false
      },
      features: [
        {
          id: 1,
          icon: 'el-icon-umbrella',
          title: '全面保障',
          description: '覆盖航班延误、行李损失等多种情况'
        },
        {
          id: 2,
          icon: 'el-icon-money',
          title: '极速理赔',
          description: '线上理赔，最快24小时到账'
        },
        {
          id: 3,
          icon: 'el-icon-service',
          title: '7*24小时服务',
          description: '全天候理赔服务支持'
        },
        {
          id: 4,
          icon: 'el-icon-medal',
          title: '优质保障',
          description: '与国际知名保险公司合作'
        }
      ],
      carouselItems: [
        {
          id: 1,
          icon: 'el-icon-umbrella',
          title: '航班延误险',
          description: '最高赔付1000元',
          bgColor: '#409EFF'
        },
        {
          id: 2,
          icon: 'el-icon-suitcase',
          title: '行李保险',
          description: '最高赔付8000元',
          bgColor: '#67C23A'
        },
        {
          id: 3,
          icon: 'el-icon-first-aid-kit',
          title: '医疗保险',
          description: '最高赔付50万元',
          bgColor: '#E6A23C'
        }
      ],
      insuranceProducts: [
        {
          id: 1,
          name: '基础保障计划',
          price: 30,
          headerColor: '#409EFF',
          coverage: [
            { item: '航班延误', amount: '最高赔付500元' },
            { item: '行李延误', amount: '最高赔付300元' },
            { item: '意外医疗', amount: '最高10万元' }
          ],
          features: ['性价比高', '理赔简单'],
          recommended: false
        },
        {
          id: 2,
          name: '优享保障计划',
          price: 68,
          headerColor: '#67C23A',
          coverage: [
            { item: '航班延误', amount: '最高赔付1000元' },
            { item: '行李延误', amount: '最高赔付800元' },
            { item: '意外医疗', amount: '最高30万元' }
          ],
          features: ['保障全面', '理赔优先'],
          recommended: true
        },
        {
          id: 3,
          name: '尊享保障计划',
          price: 128,
          headerColor: '#E6A23C',
          coverage: [
            { item: '航班延误', amount: '最高赔付2000元' },
            { item: '行李延误', amount: '最高赔付1500元' },
            { item: '意外医疗', amount: '最高50万元' }
          ],
          features: ['高额保障', 'VIP服务'],
          recommended: false
        }
      ],
      claimSteps: [
        {
          id: 1,
          title: '收集材料',
          description: '准备理赔所需证明材料',
          icon: 'el-icon-document'
        },
        {
          id: 2,
          title: '提交申请',
          description: '线上或线下提交理赔申请',
          icon: 'el-icon-upload'
        },
        {
          id: 3,
          title: '审核处理',
          description: '1-3个工作日完成审核',
          icon: 'el-icon-check'
        },
        {
          id: 4,
          title: '赔付到账',
          description: '审核通过后1个工作日内到账',
          icon: 'el-icon-money'
        }
      ],
      emergencyContacts: [
        {
          type: '理赔热线',
          value: '400-888-8888',
          icon: 'el-icon-phone'
        },
        {
          type: '在线客服',
          value: '7*24小时在线',
          icon: 'el-icon-service'
        },
        {
          type: '邮件支持',
          value: 'claims@example.com',
          icon: 'el-icon-message'
        }
      ]
    }
  },
  computed: {
    totalPremium() {
      if (!this.selectedProduct) return 0
      return this.selectedProduct.price * this.insuranceForm.passengers
    }
  },
  methods: {
    selectInsurance(product) {
      this.selectedProduct = product
      this.dialogVisible = true
    },
    showTerms() {
      // 显示保险条款
      this.$alert('这里是保险条款的详细内容...', '保险条款', {
        confirmButtonText: '确定',
      })
    },
    confirmPurchase() {
      if (!this.insuranceForm.flightNo) {
        this.$message.warning('请输入航班号')
        return
      }
      this.$confirm('确认购买保险？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟购买请求
        setTimeout(() => {
          this.$message.success('投保成功！')
          this.dialogVisible = false
        }, 1000)
      })
    },
    confirmBooking() {
      if (!this.agreement) {
        this.$message.warning('请先同意服务条款')
        return
      }
      
      this.$confirm('确认购买保险？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('保险购买成功！')
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.insurance-service {
  padding: 20px;
}

.insurance-intro, .insurance-products, .claims-guide {
  margin-bottom: 20px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.feature-item i {
  font-size: 24px;
  color: #409EFF;
  margin-right: 10px;
}

.feature-text h5 {
  margin: 0 0 5px;
}

.feature-text p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.carousel-content {
  height: 100%;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.carousel-content i {
  font-size: 40px;
  margin-bottom: 10px;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-card {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.product-card.recommended {
  border: 2px solid #E6A23C;
}

.product-header {
  color: white;
  padding: 20px;
  border-radius: 4px 4px 0 0;
  position: relative;
}

.product-header h4 {
  margin: 0;
}

.price-tag {
  font-size: 24px;
  margin-top: 10px;
}

.price {
  font-size: 36px;
  font-weight: bold;
}

.recommend-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.product-content {
  padding: 20px;
}

.coverage-list {
  margin-bottom: 20px;
}

.coverage-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.coverage-item i {
  color: #67C23A;
  margin-right: 5px;
}

.coverage-amount {
  margin-left: auto;
  color: #F56C6C;
}

.product-features {
  margin-bottom: 20px;
}

.product-features .el-tag {
  margin-right: 5px;
}

.purchase-btn {
  width: 100%;
}

.purchase-btn.is-recommended {
  background-color: #E6A23C;
  border-color: #E6A23C;
}

.claims-contact {
  margin-top: 40px;
}

.contact-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.contact-card i {
  font-size: 30px;
  color: #409EFF;
  margin-right: 15px;
}

.contact-info h5 {
  margin: 0 0 5px;
}

.contact-info p {
  margin: 0;
  color: #606266;
}

.confirm-content {
  padding: 20px;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.confirm-header h4 {
  margin: 0;
}

.total-premium {
  font-size: 24px;
  color: #F56C6C;
  font-weight: bold;
}

.terms-check {
  margin-top: 20px;
}
</style> 