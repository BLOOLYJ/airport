<template>
  <div class="home-page" v-loading="loading">
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      style="margin-bottom: 20px;">
    </el-alert>

    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="400px" class="banner">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <el-image 
          :src="item.image" 
          :alt="item.title" 
          class="banner-image"
          fit="cover"
          lazy>
          <div slot="placeholder" class="image-placeholder">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="banner-content">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <el-button type="primary" @click="handleBannerClick(item)">
            {{ item.buttonText }}
          </el-button>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 快速预订 -->
    <el-card class="quick-book">
      <div slot="header">
        <h3>快速预订</h3>
      </div>
      <el-form :model="bookingForm" :rules="bookingRules" ref="bookingForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="出发城市" prop="departure">
              <el-select 
                v-model="bookingForm.departure" 
                filterable 
                placeholder="请选择">
                <el-option 
                  v-for="city in cities" 
                  :key="city" 
                  :label="city" 
                  :value="city">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到达城市" prop="arrival">
              <el-select 
                v-model="bookingForm.arrival" 
                filterable 
                placeholder="请选择">
                <el-option 
                  v-for="city in cities" 
                  :key="city" 
                  :label="city" 
                  :value="city">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出发日期" prop="date">
              <el-date-picker 
                v-model="bookingForm.date" 
                type="date" 
                placeholder="选择日期"
                :picker-options="dateOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="searching">
            <i class="el-icon-search"></i> 搜索航班
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 热门目的地 -->
    <div class="destinations">
      <div class="section-header">
        <h3 class="section-title">热门目的地</h3>
        <el-radio-group v-model="destinationType" size="small">
          <el-radio-button label="domestic">国内</el-radio-button>
          <el-radio-button label="international">国际</el-radio-button>
        </el-radio-group>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="6" v-for="(dest, index) in filteredDestinations" :key="index">
          <el-card :body-style="{ padding: '0px' }" class="destination-card">
            <div class="destination-image-wrapper">
              <img :src="dest.image" class="destination-image">
              <div class="destination-tag" v-if="dest.tag">
                <el-tag :type="dest.tagType">{{ dest.tag }}</el-tag>
              </div>
            </div>
            <div class="destination-info">
              <h4>{{ dest.city }}</h4>
              <p>{{ dest.description }}</p>
              <div class="price-info">
                <div class="price-section">
                  <span class="price">¥{{ dest.price }}</span>
                  <span class="price-label">起</span>
                </div>
                <el-button size="small" type="primary" @click="handleViewDestination(dest)">
                  查看详情
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 特色服务 -->
    <div class="features">
      <h3 class="section-title">特色服务</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="feature in features" :key="feature.id">
          <div class="feature-card">
            <i :class="feature.icon"></i>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 旅行资讯 -->
    <div class="travel-info">
      <h3 class="section-title">旅行资讯</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="article in articles" :key="article.id">
          <el-card class="article-card">
            <img :src="article.image" class="article-image">
            <div class="article-content">
              <h4>{{ article.title }}</h4>
              <p>{{ article.summary }}</p>
              <div class="article-meta">
                <span>{{ article.date }}</span>
                <el-button type="text" @click="handleReadArticle(article)">
                  阅读更多
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      loading: false,
      error: null,
      searching: false,
      destinationType: 'domestic',
      banners: [
        {
          title: '春季特惠',
          description: '早春特惠，最高优惠50%',
          image: require('@/assets/images/airlines/banner1.jpg'),
          buttonText: '立即抢购',
          link: '/promotions/spring'
        },
        {
          title: '商务舱体验',
          description: '尊享商务舱服务',
          image: require('@/assets/images/airlines/banner2.jpg'),
          buttonText: '了解更多',
          link: '/services/vip'
        },
        {
          title: '国际航线',
          description: '探索世界的翅膀',
          image: require('@/assets/images/airlines/banner3.jpg'),
          buttonText: '查看航线',
          link: '/routes/international'
        }
      ],
      bookingForm: {
        departure: '',
        arrival: '',
        date: ''
      },
      bookingRules: {
        departure: [
          { required: true, message: '请选择出发城市', trigger: 'change' }
        ],
        arrival: [
          { required: true, message: '请选择到达城市', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择出发日期', trigger: 'change' }
        ]
      },
      dateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      cities: ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', 
               '南京', '重庆', '青岛', '厦门', '昆明', '西双版纳', '三亚'],
      destinations: [
        {
          city: '三亚',
          description: '阳光海滩度假胜地',
          price: '899',
          image: require('@/assets/images/airlines/city-sanya.jpg'),
          tag: '热门',
          tagType: 'danger',
          type: 'domestic'
        },
        {
          city: '西安',
          description: '古都文化之旅',
          price: '699',
          image: require('@/assets/images/airlines/city-xian.jpg'),
          tag: '特惠',
          tagType: 'success',
          type: 'domestic'
        },
        {
          city: '杭州',
          description: '人间天堂',
          price: '599',
          image: require('@/assets/images/airlines/city-hangzhou.jpg'),
          type: 'domestic'
        },
        {
          city: '成都',
          description: '美食天堂熊猫城',
          price: '499',
          image: require('@/assets/images/airlines/city-chengdu.jpg'),
          tag: '推荐',
          tagType: 'warning',
          type: 'domestic'
        },
        {
          city: '深圳',
          description: '现代科技之都',
          price: '799',
          image: require('@/assets/images/airlines/city-shenzhen.jpg'),
          tag: '热门',
          tagType: 'danger',
          type: 'domestic'
        },
        {
          city: '广州',
          description: '粤式风情',
          price: '699',
          image: require('@/assets/images/airlines/city-guangzhou.jpg'),
          type: 'domestic'
        },
        {
          city: '上海',
          description: '魔都魅力',
          price: '899',
          image: require('@/assets/images/airlines/city-shanghai.jpg'),
          tag: '特惠',
          tagType: 'success',
          type: 'domestic'
        },
        {
          city: '北京',
          description: '古都风韵',
          price: '999',
          image: require('@/assets/images/airlines/city-beijing.jpg'),
          type: 'domestic'
        }
      ],
      features: [
        {
          id: 1,
          icon: 'el-icon-time',
          title: '准点率保障',
          description: '航班准点率行业领先'
        },
        {
          id: 2,
          icon: 'el-icon-star-on',
          title: '优质服务',
          description: '全程无忧贴心服务'
        },
        {
          id: 3,
          icon: 'el-icon-money',
          title: '价格优势',
          description: '提供最优惠的价格'
        },
        {
          id: 4,
          icon: 'el-icon-medal',
          title: '会员特权',
          description: '专属优惠尊享服务'
        }
      ],
      articles: [
        {
          id: 1,
          title: '2024年最值得去的10个目的地',
          summary: '探索世界最美丽的角落，感受不同的文化与风情...',
          image: require('@/assets/1.jpg'),
          date: '2024-03-01'
        },
        {
          id: 2,
          title: '如何获得最佳飞行体验',
          summary: '资深旅行者分享的实用建议，让您的旅程更加舒适...',
          image: require('@/assets/1.jpg'),
          date: '2024-02-28'
        },
        {
          id: 3,
          title: '春季旅行最佳攻略',
          summary: '春暖花开，带您领略最美的春季风光...',
          image: require('@/assets/1.jpg'),
          date: '2024-02-25'
        }
      ]
    }
  },
  computed: {
    filteredDestinations() {
      return this.destinations.filter(dest => dest.type === this.destinationType)
    }
  },
  methods: {
    async handleSearch() {
      try {
        const valid = await this.$refs.bookingForm.validate()
        if (valid) {
          this.searching = true
          // 模拟搜索延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.$router.push({
            path: '/search',
            query: {
              from: this.bookingForm.departure,
              to: this.bookingForm.arrival,
              date: this.bookingForm.date
            }
          })
        }
      } catch (err) {
        this.$message.error('请完善搜索信息')
      } finally {
        this.searching = false
      }
    },
    resetForm() {
      this.$refs.bookingForm.resetFields()
    },
    handleBannerClick(banner) {
      this.$router.push(banner.link)
    },
    handleViewDestination(dest) {
      this.$router.push({
        path: '/search',
        query: {
          to: dest.city
        }
      })
    },
    handleReadArticle(article) {
      // TODO: 实现文章详情页面跳转
      this.$message({
        message: `即将为您展示文章：${article.title}`,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.banner {
  margin-bottom: 30px;
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
  bottom: 20px;
  left: 20px;
  right: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.banner-content h2 {
  margin: 0;
  font-size: 28px;
}

.banner-content p {
  margin: 10px 0 20px;
  font-size: 16px;
}

.quick-book {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 30px 0 20px;
  font-size: 24px;
  color: #303133;
}

.destination-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.destination-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.destination-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.destination-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.4));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.destination-card:hover .destination-image::after {
  opacity: 1;
}

.destination-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.destination-info {
  padding: 14px;
}

.destination-info h4 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.destination-info p {
  font-size: 14px;
  color: #909399;
  margin: 10px 0;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-section {
  display: flex;
  align-items: baseline;
}

.price {
  color: #F56C6C;
  font-size: 24px;
  font-weight: bold;
}

.price-label {
  color: #909399;
  font-size: 14px;
  margin-left: 4px;
}

.features {
  margin: 40px 0;
}

.feature-card {
  text-align: center;
  padding: 30px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.feature-card i {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
}

.feature-card h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.feature-card p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.article-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-content {
  padding: 15px;
}

.article-content h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.article-content p {
  margin: 0 0 15px;
  color: #606266;
  font-size: 14px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 14px;
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

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}

.image-placeholder i {
  font-size: 40px;
  color: #909399;
}
</style> 