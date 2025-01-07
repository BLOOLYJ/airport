<template>
  <div class="user-profile" v-loading="loading">
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      style="margin-bottom: 20px;">
    </el-alert>

    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :span="8">
        <el-card class="user-card">
          <div class="user-header">
            <el-avatar :size="100" :src="userInfo.avatar">
              {{ userInfo.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <h2>{{ userInfo.username }}</h2>
            <p>{{ userInfo.email }}</p>
          </div>
          <el-divider></el-divider>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.totalFlights }}</div>
              <div class="stat-label">总航班数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.totalMiles }}</div>
              <div class="stat-label">总里程(km)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.memberLevel }}</div>
              <div class="stat-label">会员等级</div>
            </div>
          </div>
        </el-card>

        <!-- 会员权益卡片 -->
        <el-card class="member-card" style="margin-top: 20px">
          <div slot="header">
            <span>会员权益</span>
          </div>
          <div class="member-benefits">
            <div class="benefit-item">
              <i class="el-icon-star-on"></i>
              <span>优先值机</span>
            </div>
            <div class="benefit-item">
              <i class="el-icon-suitcase"></i>
              <span>额外行李额</span>
            </div>
            <div class="benefit-item">
              <i class="el-icon-trophy"></i>
              <span>贵宾休息室</span>
            </div>
            <div class="benefit-item">
              <i class="el-icon-medal"></i>
              <span>优先登机</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧信息编辑表单 -->
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>个人信息设置</span>
          </div>
          
          <el-form 
            :model="form" 
            :rules="rules"
            ref="form" 
            label-width="100px"
            class="profile-form">
            
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName"></el-input>
            </el-form-item>

            <el-form-item label="证件类型">
              <el-select v-model="form.idType" style="width: 100%">
                <el-option label="身份证" value="idCard"></el-option>
                <el-option label="护照" value="passport"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="证件号码" prop="idNumber">
              <el-input v-model="form.idNumber"></el-input>
            </el-form-item>

            <el-form-item label="常用地址">
              <el-input type="textarea" v-model="form.address"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="loading">保存修改</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 修改密码部分 -->
          <el-divider content-position="left">修改密码</el-divider>
          <el-form 
            :model="passwordForm" 
            :rules="passwordRules"
            ref="passwordForm" 
            label-width="100px">
            
            <el-form-item label="原密码" prop="oldPassword">
              <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="passwordForm.newPassword"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="changePassword" :loading="loading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UserProfilePage',
  data() {
    // 密码确认验证
    const validatePass = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      error: null,
      userInfo: {
        username: '',
        email: '',
        avatar: '',
        totalFlights: 0,
        totalMiles: 0,
        memberLevel: ''
      },
      form: {
        username: '',
        email: '',
        phone: '',
        realName: '',
        idType: 'idCard',
        idNumber: '',
        address: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ]
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadUserData()
  },
  methods: {
    async loadUserData() {
      try {
        this.loading = true
        this.error = null
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟获取用户数据
        const userData = {
          username: 'demo_user',
          email: 'demo@example.com',
          phone: '13800138000',
          realName: '张三',
          idType: 'idCard',
          idNumber: '110101199001011234',
          address: '北京市朝阳区xxx街道',
          avatar: '',
          totalFlights: 12,
          totalMiles: 15000,
          memberLevel: '金卡会员'
        }
        
        this.userInfo = {
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          totalFlights: userData.totalFlights,
          totalMiles: userData.totalMiles,
          memberLevel: userData.memberLevel
        }
        
        this.form = {
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          realName: userData.realName,
          idType: userData.idType,
          idNumber: userData.idNumber,
          address: userData.address
        }
      } catch (err) {
        this.error = '加载用户数据失败'
        this.$message.error(this.error)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.loading = true
          // 模拟保存
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.$message.success('保存成功')
          await this.loadUserData()
        }
      } catch (err) {
        this.$message.error('保存失败')
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.loadUserData()
    },
    async changePassword() {
      try {
        const valid = await this.$refs.passwordForm.validate()
        if (valid) {
          this.loading = true
          // 模拟修改密码
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.$message.success('密码修改成功')
          this.$refs.passwordForm.resetFields()
        }
      } catch (err) {
        this.$message.error('密码修改失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.user-card {
  text-align: center;
}

.user-header {
  padding: 20px 0;
}

.user-header h2 {
  margin: 10px 0 5px;
}

.user-header p {
  color: #909399;
  margin: 0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.member-card {
  margin-top: 20px;
}

.member-benefits {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.benefit-item i {
  font-size: 20px;
  color: #409EFF;
  margin-right: 10px;
}

.benefit-item span {
  color: #606266;
  font-size: 14px;
}
</style> 