<template>
  <div class="notification-list">
    <template v-if="notifications.length">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification-item"
        :class="{ 'is-read': notification.read }">
        <div class="notification-content">
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.content }}</p>
          <span class="notification-time">{{ notification.time }}</span>
        </div>
        <div class="notification-actions">
          <el-button 
            type="text" 
            size="mini"
            @click="markAsRead(notification)"
            v-if="!notification.read">
            标记已读
          </el-button>
        </div>
      </div>
    </template>
    <div v-else class="empty-state">
      暂无通知
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationList',
  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    markAsRead(notification) {
      this.$emit('mark-read', notification.id)
      notification.read = true
    }
  }
}
</script>

<style scoped>
.notification-list {
  min-height: 200px;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #EBEEF5;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #F5F7FA;
}

.notification-item.is-read {
  opacity: 0.7;
}

.notification-content h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #303133;
}

.notification-content p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.notification-actions {
  margin-top: 8px;
  text-align: right;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 30px 0;
}
</style> 