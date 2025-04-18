<template>
  <div class="tourism-stats-container">
    <el-card class="stats-card" v-loading="loading">
      <div slot="header">
        <h2>永庆坊旅游数据统计</h2>
      </div>
      
      <!-- 1. 热门消费地与人气景点 -->
      <div class="section">
        <h3>1. 热门消费地与人气景点高度集聚</h3>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div ref="hotspotsPieChart" class="chart"></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="stats-list">
              <el-card v-for="(item, index) in hotspots" :key="index" class="stat-item">
                <div class="stat-rank">TOP {{ item.rank }}</div>
                <div class="stat-icon"><i :class="item.icon"></i></div>
                <div class="stat-content">
                  <h4>{{ item.name }}</h4>
                  <p class="stat-value">人气占比: {{ item.value }}%</p>
                  <p class="stat-desc">{{ item.description }}</p>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 2. 各年龄段到访平均值 -->
      <div class="section">
        <h3>2. 热门景点各年龄段到访平均值</h3>
        <div ref="ageGroupsBarChart" class="chart"></div>
      </div>
      
      <!-- 3. 24岁以下访客到访占比 -->
      <div class="section">
        <h3>3. 24岁以下访客到访占比Top5景点</h3>
        <div ref="youngVisitorsChart" class="chart"></div>
      </div>
      
      <!-- 4. 24-45岁游客到访占比 -->
      <div class="section">
        <h3>4. 24-45岁游客到访占比Top5景点</h3>
        <div ref="middleAgeVisitorsChart" class="chart"></div>
      </div>
      
      <!-- 5. 45岁以上游客到访占比 -->
      <div class="section">
        <h3>5. 45岁以上游客到访占比Top5景点</h3>
        <div ref="seniorVisitorsChart" class="chart"></div>
      </div>
      
      <!-- 6. 热门景区停留时间游客占比 -->
      <div class="section">
        <h3>6. 热门景区停留时间游客占比</h3>
        <div ref="stayTimePieChart" class="chart"></div>
      </div>
      
      <!-- 7. 十一期间日均游客增长量对比五一期间 -->
      <div class="section">
        <h3>7. 十一期间日均游客增长量对比五一期间</h3>
        <div class="visitor-growth-container">
          <div ref="visitorGrowthChart" class="chart"></div>
          <div class="growth-highlight">
            <el-tag type="danger" size="large">增长率: 156%</el-tag>
            <p>主要因夜间经济与文化节庆拉动</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 使用本地安装的echarts
import * as echarts from 'echarts'

export default {
  name: 'TourismStats',
  data() {
    return {
      loading: true,
      charts: [],
      hotspots: [
        {
          name: '非遗文化体验区（永庆坊西区）',
          description: '聚集广绣、广彩、醒狮等20+非遗工作室，提供DIY课程与展览',
          icon: 'el-icon-collection',
          value: 35,
          rank: 1
        },
        {
          name: '粤剧艺术博物馆',
          description: '全球最大粤剧主题馆，日均接待超万人次，夜间游客占比40%',
          icon: 'el-icon-film',
          value: 28,
          rank: 2
        },
        {
          name: '李小龙祖居与活字印刷体验馆',
          description: '历史建筑+互动体验，吸引家庭客群与年轻游客',
          icon: 'el-icon-house',
          value: 20,
          rank: 3
        },
        {
          name: '荔枝湾游船与水上花市',
          description: '融合岭南水乡风情，十一期间日均接待超2万人次',
          icon: 'el-icon-ship',
          value: 12,
          rank: 4
        },
        {
          name: '东区时尚消费区',
          description: '餐饮占比65%，夜间消费占营业额50%以上',
          icon: 'el-icon-shopping-bag',
          value: 5,
          rank: 5
        }
      ],
      ageGroups: [
        { age: '24岁以下', time: 2.5, preference: '偏好非遗体验与潮玩店铺' },
        { age: '24-45岁', time: 3.8, preference: '兼顾文化体验与餐饮消费' },
        { age: '45岁以上', time: 2.0, preference: '集中于粤剧博物馆与老字号美食' }
      ],
      youngVisitors: [
        { name: '东区潮玩市集', percentage: 35 },
        { name: '非遗手作体验课', percentage: 28 },
        { name: '网红月亮桥', percentage: 25 },
        { name: '荔枝湾游船', percentage: 20 },
        { name: '文创快闪店', percentage: 18 }
      ],
      middleAgeVisitors: [
        { name: '粤剧艺术博物馆', percentage: 42 },
        { name: '永庆食集', percentage: 38 },
        { name: '李小龙祖居', percentage: 30 },
        { name: '沙面岛联动景区', percentage: 25 },
        { name: 'UCCA非遗艺术展', percentage: 22 }
      ],
      seniorVisitors: [
        { name: '西关大屋建筑群', percentage: 45 },
        { name: '老字号餐饮', percentage: 40 },
        { name: '华光祖师诞巡游', percentage: 35 },
        { name: '仁威祖庙与文塔', percentage: 28 },
        { name: '非遗传承人工作室', percentage: 20 }
      ],
      stayTime: [
        { duration: '1小时以内', percentage: 15, description: '快速打卡拍照' },
        { duration: '1-2小时', percentage: 30, description: '餐饮+主景点游览' },
        { duration: '2-4小时', percentage: 45, description: '深度体验非遗+夜经济' },
        { duration: '4小时以上', percentage: 10, description: '含周边联动景区游览' }
      ],
      visitorGrowth: {
        mayDaily: { weekday: 3000, weekend: 5000 },
        octoberDaily: 128000,
        growthRate: 156
      }
    }
  },
  mounted() {
    this.initCharts().then(() => {
      this.loading = false
    }).catch(err => {
      console.error('初始化图表失败:', err)
      this.loading = false
      this.$message.error('加载图表失败，请刷新页面重试')
    })
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    this.charts.forEach(chart => {
      if (chart && typeof chart.dispose === 'function') {
        chart.dispose()
      }
    })
  },
  methods: {
    initCharts() {
      return new Promise((resolve, reject) => {
        try {
          this.$nextTick(() => {
            // 初始化各个图表
            this.initHotspotsPieChart()
            this.initAgeGroupsBarChart()
            this.initYoungVisitorsChart()
            this.initMiddleAgeVisitorsChart()
            this.initSeniorVisitorsChart()
            this.initStayTimePieChart()
            this.initVisitorGrowthChart()
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    
    // 热门景点饼图
    initHotspotsPieChart() {
      try {
        if (!this.$refs.hotspotsPieChart) {
          console.warn('热门景点图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.hotspotsPieChart)
        this.charts.push(chart)
        
        const option = {
          title: {
            text: '热门景点人气分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.hotspots.map(item => item.name)
          },
          series: [
            {
              name: '景点人气',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.hotspots.map(item => ({
                name: item.name,
                value: item.value
              })),
              label: {
                show: true,
                formatter: '{b}\n{c}%',
                position: 'outside'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化热门景点图表失败:', error)
      }
    },
    
    // 年龄组柱状图
    initAgeGroupsBarChart() {
      try {
        if (!this.$refs.ageGroupsBarChart) {
          console.warn('年龄分布图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.ageGroupsBarChart)
        this.charts.push(chart)
        
        const option = {
          title: {
            text: '不同年龄段游客停留时间',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              const data = params[0]
              const ageGroup = data.name
              const time = data.value
              const preference = data.data.preference
              return `${ageGroup}<br/>平均停留时间: ${time}小时<br/>偏好: ${preference}`
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.ageGroups.map(item => item.age)
          },
          yAxis: {
            type: 'value',
            name: '平均停留时间(小时)'
          },
          series: [
            {
              name: '停留时间',
              type: 'bar',
              barWidth: '60%',
              data: this.ageGroups.map(item => ({
                value: item.time,
                preference: item.preference
              })),
              itemStyle: {
                color: function(params) {
                  const colorList = ['#91cc75', '#5470c6', '#ee6666']
                  return colorList[params.dataIndex]
                }
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{c}小时'
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化年龄分布图表失败:', error)
      }
    },
    
    // 24岁以下游客图表 - 条形图
    initYoungVisitorsChart() {
      try {
        if (!this.$refs.youngVisitorsChart) {
          console.warn('年轻游客图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.youngVisitorsChart)
        this.charts.push(chart)
        
        // 按百分比降序排列
        const sortedData = [...this.youngVisitors].sort((a, b) => b.percentage - a.percentage)
        
        const option = {
          title: {
            text: '24岁以下年轻游客最喜爱景点',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}: {c}%'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '到访占比(%)',
            max: 50
          },
          yAxis: {
            type: 'category',
            data: sortedData.map(item => item.name),
            axisLabel: {
              rotate: 0,
              fontSize: 12
            }
          },
          series: [
            {
              name: '到访占比',
              type: 'bar',
              data: sortedData.map(item => item.percentage),
              itemStyle: {
                color: '#FF7F50'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化年轻游客图表失败:', error)
      }
    },

    // 24-45岁游客图表 - 条形图
    initMiddleAgeVisitorsChart() {
      try {
        if (!this.$refs.middleAgeVisitorsChart) {
          console.warn('中年游客图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.middleAgeVisitorsChart)
        this.charts.push(chart)
        
        // 按百分比降序排列
        const sortedData = [...this.middleAgeVisitors].sort((a, b) => b.percentage - a.percentage)
        
        const option = {
          title: {
            text: '24-45岁游客最喜爱景点',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}: {c}%'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '到访占比(%)',
            max: 50
          },
          yAxis: {
            type: 'category',
            data: sortedData.map(item => item.name),
            axisLabel: {
              rotate: 0,
              fontSize: 12
            }
          },
          series: [
            {
              name: '到访占比',
              type: 'bar',
              data: sortedData.map(item => item.percentage),
              itemStyle: {
                color: '#5470C6'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化中年游客图表失败:', error)
      }
    },

    // 45岁以上老年游客图表 - 条形图
    initSeniorVisitorsChart() {
      try {
        if (!this.$refs.seniorVisitorsChart) {
          console.warn('老年游客图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.seniorVisitorsChart)
        this.charts.push(chart)
        
        // 按百分比降序排列
        const sortedData = [...this.seniorVisitors].sort((a, b) => b.percentage - a.percentage)
        
        const option = {
          title: {
            text: '45岁以上游客最喜爱景点',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}: {c}%'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '到访占比(%)',
            max: 50
          },
          yAxis: {
            type: 'category',
            data: sortedData.map(item => item.name),
            axisLabel: {
              rotate: 0,
              fontSize: 12
            }
          },
          series: [
            {
              name: '到访占比',
              type: 'bar',
              data: sortedData.map(item => item.percentage),
              itemStyle: {
                color: '#91CC75'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化老年游客图表失败:', error)
      }
    },

    // 停留时间环形图
    initStayTimePieChart() {
      try {
        if (!this.$refs.stayTimePieChart) {
          console.warn('停留时间图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.stayTimePieChart)
        this.charts.push(chart)
        
        const option = {
          title: {
            text: '游客停留时间分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)<br/>{e}'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.stayTime.map(item => item.duration)
          },
          color: ['#91cc75', '#fac858', '#ee6666', '#73c0de'],
          series: [
            {
              name: '停留时间',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c}%',
                fontSize: 14
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: this.stayTime.map(item => ({
                value: item.percentage,
                name: item.duration,
                e: item.description
              }))
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化停留时间图表失败:', error)
      }
    },

    // 游客增长柱状图
    initVisitorGrowthChart() {
      try {
        if (!this.$refs.visitorGrowthChart) {
          console.warn('游客增长图表容器不存在')
          return
        }
        
        const chart = echarts.init(this.$refs.visitorGrowthChart)
        this.charts.push(chart)
        
        const option = {
          title: {
            text: '五一与十一游客量对比',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['五一期间', '十一期间'],
            bottom: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['工作日', '周末', '十一期间']
          },
          yAxis: {
            type: 'value',
            name: '日均游客量(人次)'
          },
          series: [
            {
              name: '五一期间',
              type: 'bar',
              data: [
                this.visitorGrowth.mayDaily.weekday,
                this.visitorGrowth.mayDaily.weekend,
                0
              ]
            },
            {
              name: '十一期间',
              type: 'bar',
              data: [
                0,
                0,
                this.visitorGrowth.octoberDaily
              ],
              itemStyle: {
                color: '#ee6666'
              },
              label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value.toLocaleString()
                  }
                  return ''
                }
              }
            }
          ]
        }
        
        chart.setOption(option)
      } catch (error) {
        console.error('初始化游客增长图表失败:', error)
      }
    },
    
    // 响应式调整图表大小
    resizeCharts() {
      this.charts.forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
          chart.resize()
        }
      })
    }
  }
}
</script>

<style scoped>
.tourism-stats-container {
  padding: 20px;
}

.stats-card {
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #EBEEF5;
}

.section h3 {
  margin-top: 30px;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
  font-size: 18px;
}

.chart {
  height: 400px;
  width: 100%;
}

.stats-list {
  padding-right: 10px;
}

.stat-item {
  display: flex;
  margin-bottom: 15px;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
  padding: 15px;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-rank {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #409EFF;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.stat-icon {
  font-size: 24px;
  color: #409EFF;
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.stat-content h4 {
  margin: 0 0 5px;
  font-size: 16px;
}

.stat-value {
  color: #409EFF;
  font-weight: bold;
  font-size: 16px;
  margin: 5px 0;
}

.stat-desc {
  color: #606266;
  font-size: 14px;
  margin-top: 5px;
}

.visitor-growth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.visitor-growth-container .chart {
  width: 100%;
  margin-bottom: 20px;
}

.growth-highlight {
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.growth-highlight .el-tag {
  font-size: 18px;
  padding: 10px 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 0 auto;
  display: inline-block;
}

.growth-highlight p {
  margin-top: 10px;
  color: #606266;
  font-size: 16px;
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .chart {
    height: 300px;
  }
}
</style> 