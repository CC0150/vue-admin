<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-content">
      <el-form class="login-form" :rules="rules" ref="formRef" :model="loginForm" label-position="left" status-icon>
        <div class="form-header">
          <h1 class="form-title">智管通用后台管理系统</h1>
          <p class="form-subtitle">请登录您的账号继续访问</p>
        </div>

        <div class="form-body">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="请输入账号(admin)" class="login-input"
              size="large"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password :prefix-icon="Lock" type="password"
              placeholder="请输入密码(111111)" class="login-input" size="large"></el-input>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="userStore.rememberMe" size="large">记住密码</el-checkbox>
            <el-link type="primary" :underline="false" @click="handleResetPassword">忘记密码?</el-link>
          </div>

          <el-form-item>
            <el-button :loading="loading" class="login-btn" type="primary" size="large" @click="submit"
              :icon="ArrowRight">
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { User, Lock, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, type FormInstance } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { getCurrentTime } from '@/utils/time';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const loginForm = reactive({
  username: 'admin',
  password: '111111'
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
  ]
})

// 组件挂载时加载记住的凭据
onMounted(() => {
  // 从pinia加载记住的凭据
  const hasCredentials = userStore.loadRememberedCredentials();
  if (hasCredentials) {
    // 将pinia中的登录表单数据同步到本地表单
    loginForm.username = userStore.loginFormData.username;
    loginForm.password = userStore.loginFormData.password;
  }
});
// 处理忘记密码点击事件
const handleResetPassword = () => {
  ElNotification({
    title: '忘记密码',
    message: '请联系管理员重置密码',
    type: 'info'
  })
}

const submit = () => {
  loading.value = true
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 提交登录，使用pinia处理记住密码逻辑
        await userStore.userLogin(loginForm)

        const redirect = route.query.redirect as string
        router.push(redirect && redirect !== "/login" ? redirect : "/")
        ElNotification({
          title: `Hi，${getCurrentTime()}好！`,
          message: '欢迎来到智管后台管理系统',
          type: 'success'
        })

      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请输入正确的用户名和密码')
      loading.value = false
    }
  })
}
</script>

<style lang='scss' scoped>
.login-container {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/geometric_gradient_background.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.login-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 50%);
  opacity: 0.8;
  z-index: 1;
}

.login-content {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .login-content {
    max-width: 90%;
    margin: 0 auto;
    padding: 30px 25px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
}

.login-form {
  width: 85%;
  max-width: 360px;
  background: transparent;
  padding: 30px 0;
  animation: fadeInUp 0.5s ease-out;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.form-body {
  margin-top: 20px;
}

.login-input {
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
  }
}

:deep(.el-input__wrapper) {
  // 自定义Element Plus输入框样式
  border-radius: 8px;

  &:hover {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }

  &.is-focused {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #667eea;
  border-color: #667eea;
}

.login-btn {
  // 登录按钮样式优化
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: #667eea;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: #5a67d8;
  }

  &:active {
    transform: translateY(0);
  }
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 加载状态动画微调
:deep(.el-button__loading-icon) {
  margin-right: 8px;
}
</style>