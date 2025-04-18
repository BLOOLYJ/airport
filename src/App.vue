<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav-menu></nav-menu>
      </el-header>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <el-footer>
        <div class="footer-content">
          <div class="footer-links">
            <a href="/about">关于我们</a>
            <a href="/privacy">隐私政策</a>
            <a href="/terms">服务条款</a>
            <a href="/contact">联系我们</a>
          </div>
          <div class="copyright">
            © {{ new Date().getFullYear() }} 机票信息管理系统
          </div>
        </div>
      </el-footer>
      <!-- 返回顶部按钮 -->
      <el-backtop></el-backtop>
    </el-container>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu.vue'

export default {
  name: 'App',
  components: {
    NavMenu
  }
}
</script>

<style>
#app {
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  padding: 0;
  height: auto !important;
}

.el-main {
  min-height: calc(100vh - 60px - 60px); /* 考虑header和footer高度 */
  padding: 20px;
}

.el-footer {
  background-color: #f5f7fa;
  padding: 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a {
  color: #606266;
  margin: 0 10px;
  text-decoration: none;
}

.footer-links a:hover {
  color: #409EFF;
}

.copyright {
  color: #909399;
  font-size: 14px;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-main {
    padding: 10px;
  }
  
  .footer-links a {
    display: block;
    margin: 5px 0;
  }
}
</style>
