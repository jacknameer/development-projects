<template>
    <div class="account-info-container">
      <el-card class="size">
        <template #header>
          <div class="card-header">
            <span>账号信息</span>
          </div>
        </template>
  
        <!-- 1. 基本信息 -->
        <div class="section">
          <div class="section-title">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
          <el-row :gutter="20" align="middle" class="basic-info">
            <el-col :span="4">
              <el-avatar :size="80" :icon="UserFilled" />
            </el-col>
            <el-col :span="20">
              <div class="info-item">
                <span>用户名：{{ userInfo.username }}</span>
                <el-icon class="copy-icon" @click="copyToClipboard(userInfo.username)"><CopyDocument /></el-icon>
              </div>
              <div class="info-item">
                <span>用户ID：{{ userInfo.userId }}</span>
                <el-icon class="copy-icon" @click="copyToClipboard(userInfo.userId)"><CopyDocument /></el-icon>
              </div>
              <div class="info-item">
                <span>注册时间：{{ userInfo.registerTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
  
        <el-divider />
  
        <!-- 2. 安全信息 -->
        <div class="section">
          <div class="section-title">
            <el-icon><Shield /></el-icon>
            <span>安全信息</span>
          </div>
          <el-descriptions :column="1" border class="info-descriptions">
            <el-descriptions-item label="手机账号">
              {{ userInfo.phone }}
              <template #extra><el-link type="primary">修改</el-link></template>
            </el-descriptions-item>
            <el-descriptions-item label="登录密码">
              <span class="password">••••••••</span>
              <template #extra><el-link type="primary">修改</el-link></template>
            </el-descriptions-item>
            <el-descriptions-item label="电子邮箱">
              {{ userInfo.email }}
              <template #extra><el-link type="primary">修改</el-link></template>
            </el-descriptions-item>
            <el-descriptions-item label="用户类别">
              <el-tag type="success" size="small">普通用户</el-tag>
              <template #extra><el-link type="primary">解绑</el-link></template>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="实名认证">
              <el-tag type="info" size="small">未实名</el-tag>
              <template #extra><el-link type="primary">去认证</el-link></template>
            </el-descriptions-item> -->
            
          </el-descriptions>
        </div>
  
        <el-divider />
        <div class="danger-zone">
            <el-button 
                type="danger" 
                size="large" 
                class="custom-danger-button"
                    >
                退出登录
            </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { User, UserFilled, CopyDocument,Link } from '@element-plus/icons-vue';
  
  // 模拟用户数据
  const userInfo = reactive({
    username: 'LY03890',
    userId: 'user13998863',
    registerTime: '2025-04-21 14:30:54',
    phone: '181****5685',
    email: 'zx****@163.com',
    inviteLink: 'https://console.lanyun.net/#/register?promoterCode=ff527bu588',
  });
  
  // 复制到剪贴板功能
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      ElMessage.success('复制成功！');
    } catch (err) {
      ElMessage.error('复制失败');
      console.error('Failed to copy: ', err);
    }
  };
  </script>
  
  <style scoped>
  .size {
    height: 91vh;
  }
  .account-info-container {
    padding: 20px;
    background-color: #f5f7fa; /* 模拟页面背景色 */
  }
  
  .card-header {
    font-weight: bold;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 20px;
  }
  
  .section-title .el-icon {
    margin-right: 8px;
  }
  
  .basic-info .info-item {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  
  .copy-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #909399;
  }
  .copy-icon:hover {
    color: #409eff;
  }
  
  /* 覆盖 el-descriptions 的样式，使其更像截图 */
  /* .info-descriptions { */
    /* 如果你想移除边框，可以取消下面的注释 */
    /* --el-descriptions-border-color: transparent; */
  /* } */
  
  /* 为descriptions item的label和content设置固定宽度，以保证对齐 */
  :deep(.el-descriptions__label) {
    width: 120px; /* 根据需要调整标签宽度 */
    color: #909399;
  }
  
  :deep(.el-descriptions__content) {
    color: #606266;
  }
  
  .password {
    letter-spacing: 0.15em;
  }
  
  /* 邀请链接部分，使输入框和链接对齐 */
  :deep(.el-descriptions-item__content) {
      display: flex;
      align-items: center;
  }
  :deep(.el-descriptions-item__content .el-input) {
      flex-grow: 1;
      margin-right: 12px;
  }
  /* 危险操作区容器的样式 */
.danger-zone {
  display: flex; /* 启用 Flexbox */
  justify-content: center; /* 水平居中 */
  margin-top: 30px; /* 与上方内容留出一些间距 */
  margin-bottom: 20px;
}

/* 自定义危险按钮的大小 */
.custom-danger-button {
  padding: 12px 40px; /* 调整内边距，让按钮更宽 */
  font-size: 16px; /* 调大字体 */
  font-weight: 500;
}
  </style>