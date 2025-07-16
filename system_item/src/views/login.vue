<template>
    <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <!-- <img src="flowbite-logo.png" alt="Flowbite Logo" class="login-logo" /> -->
        <h2>登录您的账户</h2>
      </div>
      <el-form :model="form" ref="loginForm" :rules="rules">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="name@company.com"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="••••••••"></el-input>
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <el-link type="primary" @click="forgotPassword">忘记密码？</el-link>
        </div>
        <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
        <div class="signup-text">
          还没有账户？<el-link type="primary" @click="goToSignup">注册</el-link>
        </div>
        <!-- <router-view></router-view> -->
      </el-form>
    </el-card>
  </div>
</template>
<script  setup>
import { ref,onMounted,computed,reactive } from 'vue'
import { useRouter } from 'vue-router'
// 获取路由实例
const router=useRouter()

const form = reactive({
      email: '',
      password: '',
      remember: false,
    });

    const rules = {
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    const handleLogin = () => {
      // 登录逻辑
      console.log('登录', form);
    };

    const forgotPassword = () => {
      // 忘记密码逻辑
      console.log('忘记密码');
    };

    const goToSignup = () => {
      // 跳转到注册页面
      router.push({name: 'register_user'});
    };
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a202c;
  background-image: url("../assets/login_backimg.png");
  background-size: cover;
}

.login-card {
  width: 400px;
  background-color: #2d3748;
  border-radius: 10px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo {
  width: 40px;
  margin-bottom: 10px;
}

h2 {
  color: #ffffff;
  font-size: 24px;
}

.el-form-item__label {
  color: #a0aec0;
}

.el-input__inner {
  background-color: #4a5568;
  border: none;
  color: #ffffff;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.el-checkbox__label {
  color: #a0aec0;
}

.login-button {
  width: 100%;
  background-color: #4299e1;
  border: none;
}

.signup-text {
  text-align: center;
  color: #a0aec0;
}

.el-link {
  color: #4299e1;
}
</style>