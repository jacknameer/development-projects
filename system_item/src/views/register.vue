<template>
    <div class="login-container">
      <el-card class="login-card">
        <div class="logo">
          <h2>平台注册</h2>
        </div>
        <el-form :model="form" :rules="rules" ref="formRef" status-icon label-position="left" label-width="100px">
          <!-- 邮箱输入框：添加 width: 100% -->
          <el-form-item label="Your email" prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="name@company.com"
              style="width: 100%" 
            ></el-input>
          </el-form-item>
          <!-- 密码输入框：添加 width: 100% -->
          <el-form-item label="Password" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              show-password
              style="width: 100%"  
            ></el-input>
          </el-form-item>
          <!-- 确认密码输入框：添加 width: 100% -->
          <el-form-item label="Confirm password" prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              show-password
              style="width: 100%"  
            ></el-input>
          </el-form-item>
          <!-- 其他部分保持不变 -->
          <el-form-item>
            <el-checkbox v-model="form.terms">I accept the Terms and Conditions</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" class="submit-btn">Create an account</el-button>
          </el-form-item>
          <p class="login-link">Already have an account? <a href="#">Login here</a></p>
        </el-form>
      </el-card>
    </div>
  </template>


<script setup>
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElCard } from 'element-plus';
import { ref,onMounted,computed,reactive } from 'vue'

const formRef = ref(null);
    const form = reactive({
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    });

    const rules = {
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
        { type: 'email', message: 'Please input correct email', trigger: 'blur' }
      ],
      password: [
        { required: true, message: 'Please input password', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm password', trigger: 'blur' },
        { validator: (rule, value, callback) => {
          if (value !== form.password) {
            callback(new Error('Passwords do not match'));
          } else {
            callback();
          }
        }, trigger: 'blur' }
      ],
      terms: [
        { validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Please accept terms and conditions'));
          } else {
            callback();
          }
        }, trigger: 'change' }
      ]
    };

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          console.log('Form submitted:', form);
          // Add your submit logic here
        }
      });
    };
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a202c;
  color: #e2e8f0;
  background-image: url("../assets/login_backimg.png");
  background-size: cover;
}

.login-card {
  width: 400px;
  background-color: #2d3748;
  border: none;
  border-radius: 10px;
  border: #e2e8f0 1px solid;
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

.logo img {
  width: 40px;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  color: #60a5fa;
}

h3 {
  text-align: center;
  color: #e2e8f0;
  margin-bottom: 20px;
}

.el-input__inner {
  background-color: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

.el-button--primary {
  width: 100%;
  background-color: #60a5fa;
  border-color: #60a5fa;
}

.el-button--primary:hover {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.login-link {
  text-align: center;
  color: #a0aec0;
}

.login-link a {
  color: #60a5fa;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>