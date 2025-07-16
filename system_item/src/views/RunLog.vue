<template>
    <div class="security-log-container">
      <h1>系统运行日志</h1>
  
      <!-- Toolbar -->
      <el-row :gutter="16" class="toolbar">
        <el-col :span="18">
          <el-input
            v-model="searchText"
            placeholder="Search audit logs"
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :span="6">
          <el-dropdown split-button type="success">
            <el-icon class="el-icon--left"><Download /></el-icon>
            Export
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Export as JSON</el-dropdown-item>
                <el-dropdown-item>Export as CSV</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
  
      <!-- Log List Title -->
      <h3 class="recent-events-title">Recent events</h3>
  
      <!-- Log Timeline -->
      <el-timeline class="log-timeline">
        <el-timeline-item
          v-for="log in filteredLogs"
          :key="log.id"
          hide-timestamp
        >
          <!-- Custom Dot for Avatar -->
          <template #dot>
            <el-avatar :src="log.actor.avatarUrl" />
          </template>
          
          <!-- Log Content -->
          <div class="log-item-content">
            <div class="log-header">
              <span class="actor">{{ log.actor.name }}</span> – <strong class="action">{{ log.action }}</strong>
            </div>
            <div class="log-description">
              {{ log.description }}
            </div>
            <div class="log-meta">
              <span>{{ log.ip }}</span>
              <span v-if="log.location">, {{ log.location }}</span>
              <span>{{ log.timestamp }}</span>
              <el-dropdown trigger="click" class="more-actions">
                <el-button text bg circle :icon="MoreFilled"></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>View details</el-dropdown-item>
                    <el-dropdown-item>Copy info</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { Search, Download, MoreFilled } from '@element-plus/icons-vue';
  
  // 1. 模拟的日志数据
  const searchText = ref('');
  const logs = ref([
    {
      id: 1,
      actor: { name: 'jacknameer', avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
      action: '修改密码',
      description: '描述性信息，描述操作',
      ip: '85.237.206.105',
      location: '用户类型',
      timestamp: '2025713'
    },
    {
      id: 2,
      actor: { name: 'jacknameer', avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
      action: '账户注册、执行了变化检测功能',
      description: '描述性信息，描述操作',
      ip: '66.90.98.10',
      location: '用户类型',
      timestamp: '2025713'
    },
    {
      id: 3,
      actor: { name: 'GitHub System', avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
      action: '执行了林地提取功能',
      description: '描述性信息，描述操作',
      ip: '127.0.0.1',
      location: '用户类型',
      timestamp: '2025713'
    },
      {
      id: 4,
      actor: { name: 'jacknameer', avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
      action: '执行了变化检测功能',
      description: '描述性信息，描述操作',
      ip: '66.90.98.10',
      location: '用户类型',
      timestamp: '2025713'
    },
  ]);
  
  // 2. 实现简单的搜索功能
  const filteredLogs = computed(() => {
    if (!searchText.value) {
      return logs.value;
    }
    const lowerCaseSearch = searchText.value.toLowerCase();
    return logs.value.filter(log => 
      Object.values(log).some(value => 
        String(value).toLowerCase().includes(lowerCaseSearch)
      ) || log.actor.name.toLowerCase().includes(lowerCaseSearch)
    );
  });
  </script>
  
  <style scoped>
  /* 3. 添加样式，复刻 GitHub 的外观 */
  .security-log-container {
    background-color: #0d1117;
    color: #c9d1d9;
    padding: 24px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }
  
  h1 {
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 16px;
    color: #f0f6fc;
  }
  
  .toolbar {
    margin-bottom: 24px;
  }
  
  /* 覆盖 Element Plus 输入框的默认样式以匹配暗黑主题 */
  :deep(.el-input__wrapper) {
    background-color: #010409;
    box-shadow: none;
    border: 1px solid #30363d;
  }
  :deep(.el-input__inner) {
    color: #c9d1d9;
  }
  /* 导出按钮 */
  :deep(.el-button--success) {
      --el-button-bg-color: #238636;
      --el-button-border-color: #2ea043;
      --el-button-hover-bg-color: #2ea44f;
      --el-button-hover-border-color: #3fb958;
  }
  
  .recent-events-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #f0f6fc;
    border-bottom: 1px solid #21262d;
    padding-bottom: 8px;
  }
  
  .log-timeline {
    padding-left: 0; /* 移除 el-timeline 的默认内边距 */
  }
  
  /* 隐藏时间戳列，因为我们把时间放在内容里了 */
  :deep(.el-timeline-item__timestamp) {
    display: none;
  }
  
  /* 自定义时间线节点和线条 */
  :deep(.el-timeline-item__wrapper) {
    padding-left: 50px; /* 给头像留出空间 */
    top: -8px; /* 微调对齐 */
  }
  :deep(.el-timeline-item__dot) {
    background: transparent; /* 隐藏默认的点 */
    left: 0;
    z-index: 1;
  }
  :deep(.el-timeline-item__tail) {
    left: 19px; /* 使线条与头像中心对齐 */
    border-left: 2px solid #21262d;
  }
  
  .log-item-content {
    padding: 8px 0 16px;
    border-bottom: 1px solid #21262d;
  }
  :deep(.el-timeline-item:last-child .log-item-content) {
      border-bottom: none; /* 最后一个条目不需要底部分割线 */
  }
  
  .log-header {
    font-size: 14px;
    margin-bottom: 4px;
  }
  .actor {
    color: #58a6ff;
    font-weight: 500;
    cursor: pointer;
  }
  .actor:hover {
    text-decoration: underline;
  }
  .action {
    color: #f0f6fc;
  }
  
  .log-description {
    font-size: 14px;
    margin-bottom: 8px;
    color: #c9d1d9;
  }
  
  .log-meta {
    font-size: 12px;
    color: #8b949e;
    display: flex;
    align-items: center;
  }
  
  .more-actions {
    margin-left: 12px;
  }
  /* "..." 按钮 */
  :deep(.el-button.is-text.is-bg) {
    --el-button-text-color: #8b949e;
    --el-button-hover-text-color: #58a6ff;
    background-color: #21262d60;
  }
  :deep(.el-button.is-text.is-bg:hover) {
    background-color: #30363d;
  }
  </style>