<template>
  <div class="meal-service">
    <!-- 餐食介绍 -->
    <el-card class="intro-card">
      <div slot="header">
        <h3>航空餐食服务</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <p class="intro-text">
            我们提供多样化的航空餐食选择，让您的旅程更加愉悦。您可以在预订航班时选择心仪的餐食，
            也可以在起飞前24小时内更改您的餐食选择。
          </p>
          <div class="feature-list">
            <h4>特色服务</h4>
            <el-row :gutter="20">
              <el-col :span="8" v-for="feature in features" :key="feature.title">
                <div class="feature-item">
                  <i :class="feature.icon"></i>
                  <h5>{{ feature.title }}</h5>
                  <p>{{ feature.desc }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <el-carousel height="200px">
            <el-carousel-item v-for="item in carouselItems" :key="item.id">
              <img :src="item.image" :alt="item.title" class="carousel-image">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-card>

    <!-- 餐食选择 -->
    <el-card class="meal-selection">
      <div slot="header">
        <div class="header-content">
          <h3>餐食预订</h3>
          <el-radio-group v-model="mealClass" size="small">
            <el-radio-button label="economy">经济舱</el-radio-button>
            <el-radio-button label="business">商务舱</el-radio-button>
            <el-radio-button label="first">头等舱</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="中式餐点" name="chinese">
          <el-row :gutter="20">
            <el-col :span="8" v-for="meal in chineseMeals" :key="meal.id">
              <div class="meal-card">
                <img :src="meal.image" :alt="meal.name" class="meal-image">
                <div class="meal-info">
                  <h4>{{ meal.name }}</h4>
                  <p>{{ meal.description }}</p>
                  <div class="meal-price">
                    <span class="price">¥{{ meal.price }}</span>
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="selectMeal(meal)">
                      选择
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="西式餐点" name="western">
          <el-row :gutter="20">
            <el-col :span="8" v-for="meal in westernMeals" :key="meal.id">
              <div class="meal-card">
                <img :src="meal.image" :alt="meal.name" class="meal-image">
                <div class="meal-info">
                  <h4>{{ meal.name }}</h4>
                  <p>{{ meal.description }}</p>
                  <div class="meal-price">
                    <span class="price">¥{{ meal.price }}</span>
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="selectMeal(meal)">
                      选择
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="特殊餐点" name="special">
          <el-row :gutter="20">
            <el-col :span="8" v-for="meal in specialMeals" :key="meal.id">
              <div class="meal-card">
                <img :src="meal.image" :alt="meal.name" class="meal-image">
                <div class="meal-info">
                  <h4>{{ meal.name }}</h4>
                  <p>{{ meal.description }}</p>
                  <div class="meal-tags">
                    <el-tag 
                      v-for="tag in meal.tags" 
                      :key="tag"
                      size="small"
                      :type="getTagType(tag)">
                      {{ tag }}
                    </el-tag>
                  </div>
                  <div class="meal-price">
                    <span class="price">¥{{ meal.price }}</span>
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="selectMeal(meal)">
                      选择
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 订餐说明 -->
    <el-card class="meal-notice">
      <div slot="header">
        <h3>订餐须知</h3>
      </div>
      <el-collapse v-model="activeNotices">
        <el-collapse-item 
          v-for="notice in notices" 
          :key="notice.id" 
          :title="notice.title"
          :name="notice.id">
          <div v-html="notice.content"></div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 选择确认对话框 -->
    <el-dialog
      title="确认餐食选择"
      :visible.sync="dialogVisible"
      width="30%">
      <div v-if="selectedMeal">
        <div class="confirm-meal">
          <img :src="selectedMeal.image" :alt="selectedMeal.name" class="confirm-image">
          <div class="confirm-info">
            <h4>{{ selectedMeal.name }}</h4>
            <p>{{ selectedMeal.description }}</p>
            <div class="confirm-price">
              价格：<span class="price">¥{{ selectedMeal.price }}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmMeal">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MealService',
  data() {
    return {
      mealClass: 'economy',
      activeTab: 'chinese',
      activeNotices: ['1'],
      dialogVisible: false,
      selectedMeal: null,
      features: [
        {
          icon: 'el-icon-dish',
          title: '多样选择',
          desc: '提供中西式多种餐食选择'
        },
        {
          icon: 'el-icon-timer',
          title: '提前预订',
          desc: '最晚起飞前24小时可预订'
        },
        {
          icon: 'el-icon-star-on',
          title: '特殊餐食',
          desc: '提供素食、清真等特殊餐食'
        }
      ],
      carouselItems: [
        {
          id: 1,
          image: require('@/assets/images/airlines/service-meal1.jpg'),
          title: '精选餐食'
        },
        {
          id: 2, 
          image: require('@/assets/images/airlines/service-meal2.jpg'),
          title: '商务餐食'
        },
        {
          id: 3,
          image: require('@/assets/images/airlines/service-lounge1.jpg'), 
          title: '特色餐点'
        }
      ],
      chineseMeals: [
        {
          id: 1,
          name: '宫保鸡丁套餐',
          description: '经典川式口味，搭配时蔬及米饭',
          price: 68,
          image: require('@/assets/images/airlines/service-meal1.jpg')
        },
        // ... 更多中式餐点
      ],
      westernMeals: [
        {
          id: 1,
          name: '牛排意面套餐',
          description: '澳洲进口牛排配意大利面',
          price: 88,
          image: require('@/assets/images/airlines/service-meal2.jpg')
        },
        // ... 更多西式餐点
      ],
      specialMeals: [
        {
          id: 1,
          name: '素食套餐',
          description: '纯素食材，健康美味',
          price: 58,
          image: require('@/assets/images/airlines/service-meal1.jpg'),
          tags: ['素食', '低卡']
        },
        // ... 更多特殊餐点
      ],
      notices: [
        {
          id: '1',
          title: '预订时间',
          content: '请在航班起飞前24小时完成预订'
        },
        {
          id: '2',
          title: '餐食说明',
          content: '所有餐食均为现做，可能与图片有细微差异'
        },
        {
          id: '3',
          title: '退改规则',
          content: '起飞前12小时可免费取消或更改餐食选择'
        }
      ]
    }
  },
  methods: {
    getTagType(tag) {
      const types = {
        '素食': 'success',
        '低卡': 'info',
        '清真': 'warning'
      }
      return types[tag] || ''
    },
    selectMeal(meal) {
      this.selectedMeal = meal
      this.dialogVisible = true
    },
    confirmMeal() {
      this.$message.success('餐食预订成功！')
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.meal-service {
  padding: 20px;
}

.intro-card {
  margin-bottom: 20px;
}

.intro-text {
  line-height: 1.6;
  color: #606266;
}

.feature-list {
  margin-top: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-item i {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-item:hover i {
  transform: scale(1.1);
  color: #66b1ff;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.el-carousel__item:hover .carousel-image {
  transform: scale(1.05);
}

.meal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.meal-card:hover .meal-image {
  transform: scale(1.05);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.image-slot i {
  font-size: 30px;
}

.confirm-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.confirm-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.3));
  pointer-events: none;
}

.meal-card {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  margin-bottom: 20px;
  transition: all 0.3s;
  overflow: hidden;
}

.meal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.meal-card:hover .meal-image {
  transform: scale(1.05);
}

.meal-info {
  padding: 15px;
}

.meal-info h4 {
  margin: 0 0 10px;
}

.meal-info p {
  color: #606266;
  margin: 0 0 10px;
}

.meal-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.price {
  color: #F56C6C;
  font-size: 20px;
  font-weight: bold;
}

.meal-tags {
  margin: 10px 0;
}

.meal-tags .el-tag {
  margin-right: 5px;
}

.confirm-meal {
  display: flex;
  align-items: start;
}

.confirm-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.confirm-info h4 {
  margin: 0 0 10px;
}

.confirm-price {
  margin-top: 10px;
}
</style> 