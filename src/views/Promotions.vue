<template>
  <div class="promotions-container">
    <!-- 促销banner -->
    <el-carousel :interval="4000" type="card" height="300px" class="promotion-banner">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <img :src="banner.image" class="banner-image">
        <div class="banner-content">
          <h2>{{ banner.title }}</h2>
          <p>{{ banner.description }}</p>
          <el-button type="primary" @click="viewPromotion(banner)">
            立即查看
          </el-button>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 促销活动列表 -->
    <el-row :gutter="20" class="promotion-list">
      <el-col :span="8" v-for="promotion in promotions" :key="promotion.id">
        <el-card shadow="hover" class="promotion-card">
          <img :src="promotion.image" class="promotion-image">
          <div class="promotion-info">
            <div class="promotion-tag" v-if="promotion.tag">
              <el-tag :type="promotion.tagType">{{ promotion.tag }}</el-tag>
            </div>
            <h3>{{ promotion.title }}</h3>
            <p>{{ promotion.description }}</p>
            <div class="promotion-meta">
              <span class="validity">有效期至：{{ promotion.endDate }}</span>
              <el-button type="text" @click="viewPromotion(promotion)">
                查看详情
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 促销详情对话框 -->
    <el-dialog
      :title="selectedPromotion ? selectedPromotion.title : ''"
      :visible.sync="dialogVisible"
      width="50%">
      <div v-if="selectedPromotion" class="promotion-detail">
        <el-image 
          :src="selectedPromotion.image" 
          fit="cover"
          class="detail-image">
        </el-image>
        <div class="detail-content">
          <p class="detail-description">{{ selectedPromotion.description }}</p>
          <div class="detail-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="活动时间">
                {{ selectedPromotion.startDate }} 至 {{ selectedPromotion.endDate }}
              </el-descriptions-item>
              <el-descriptions-item label="使用条件">
                {{ selectedPromotion.conditions }}
              </el-descriptions-item>
              <el-descriptions-item label="适用航线">
                {{ selectedPromotion.routes }}
              </el-descriptions-item>
              <el-descriptions-item label="优惠力度">
                {{ selectedPromotion.discount }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="detail-notice">
            <h4>活动说明</h4>
            <ul>
              <li v-for="(notice, index) in selectedPromotion.notices" :key="index">
                {{ notice }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleUsePromotion">
          立即使用
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PromotionsPage',
  data() {
    return {
      dialogVisible: false,
      selectedPromotion: null,
      banners: [
        {
          id: 1,
          title: '春节特惠',
          description: '春节机票优惠',
          image: require('@/assets/images/airlines/banner1.jpg')
        },
        {
          id: 2,
          title: '商务舱折扣',
          description: '尊享商务舱体验',
          image: require('@/assets/images/airlines/banner2.jpg')
        },
        {
          id: 3,
          title: '暑期亲子游',
          description: '带孩子探索世界',
          image: require('@/assets/images/airlines/banner3.jpg')
        }
      ],
      promotions: [
        {
          id: 1,
          title: '暑期特惠',
          description: '暑期航线全面优惠，最高立减1000元',
          image: require('@/assets/images/airlines/banner1.jpg'),
          tag: '热门',
          tagType: 'danger',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          conditions: '单笔订单满3000元可用',
          routes: '国内所有航线',
          discount: '最高立减1000元',
          notices: [
            '优惠不可与其他优惠同时使用',
            '每个用户限用一次',
            '具体优惠以实际下单为准'
          ]
        },
        {
          id: 2,
          title: '商务舱升级',
          description: '经济舱升级商务舱，享受优质服务',
          image: require('@/assets/images/airlines/banner2.jpg'),
          tag: '特惠',
          tagType: 'success',
          startDate: '2024-03-01',
          endDate: '2024-12-31',
          conditions: '适用于指定航线的经济舱机票',
          routes: '部分商务航线',
          discount: '商务舱优惠价升级',
          notices: [
            '需提前7天预订',
            '升级需视座位情况而定',
            '不适用于团队票'
          ]
        },
        {
          id: 3,
          title: '周末欢乐游',
          description: '周末航线特惠，双人同行优惠更多',
          image: require('@/assets/images/airlines/banner3.jpg'),
          tag: '限时',
          tagType: 'warning',
          startDate: '2024-03-01',
          endDate: '2024-06-30',
          conditions: '周五至周日出发航班',
          routes: '国内热门旅游航线',
          discount: '双人同行95折',
          notices: [
            '需同时预订去程和返程',
            '提前14天预订最优惠',
            '节假日可能不适用'
          ]
        }
      ]
    }
  },
  methods: {
    viewPromotion(promotion) {
      this.selectedPromotion = promotion
      this.dialogVisible = true
    },
    handleUsePromotion() {
      this.$router.push({
        path: '/search',
        query: {
          promotion: this.selectedPromotion.id
        }
      })
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.promotions-container {
  padding: 20px;
}

.promotion-banner {
  margin-bottom: 40px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.el-carousel__item:hover .banner-image {
  transform: scale(1.05);
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  transition: all 0.3s ease;
}

.el-carousel__item:hover .banner-content {
  padding-bottom: 40px;
}

.banner-content h2 {
  margin: 0 0 10px;
  font-size: 28px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-content p {
  margin: 0 0 15px;
  font-size: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.promotion-list {
  margin-top: 20px;
}

.promotion-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  overflow: hidden;
  border-radius: 8px;
}

.promotion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.promotion-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.promotion-card:hover .promotion-image {
  transform: scale(1.05);
}

.promotion-info {
  padding: 15px;
}

.promotion-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.promotion-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.promotion-info p {
  margin: 0 0 15px;
  color: #606266;
  font-size: 14px;
}

.promotion-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.validity {
  color: #909399;
  font-size: 12px;
}

.detail-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.detail-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5));
  pointer-events: none;
}

.detail-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 20px;
}

.detail-notice {
  margin-top: 20px;
}

.detail-notice h4 {
  color: #303133;
  margin-bottom: 10px;
}

.detail-notice ul {
  padding-left: 20px;
  color: #606266;
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
</style> 