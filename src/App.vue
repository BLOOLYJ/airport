<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav-menu></nav-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        © 2024 机票信息管理系统
      </el-footer>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  padding: 0;
  height: auto !important;
}

.el-footer {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
