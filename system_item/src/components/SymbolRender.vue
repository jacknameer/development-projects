<template>
<el-form :model="form" label-position="right" label-width="80px" class="main-form">
            <!-- 顶部标题栏 -->
            <div class="panel-header">
            </div>
            <!-- 核心表单区域 (恢复被注释的内容) -->
            <div class="form-content">
              <el-form-item label="渲染图层:" >
                <el-select v-model="form.renderType_layer" placeholder="请选择渲染图层">
                  <el-option label="图层1" value="laye1" />
                  <el-option label="图层2" value="laye2" />
                  <el-option label="图层3" value="laye3" />
                </el-select>
              </el-form-item>
              <el-form-item label="渲染类型:">
                <el-select v-model="form.renderType" placeholder="请选择渲染类型">
                  <el-option label="单一符号" value="single" />
                  <el-option label="分类渲染" value="category" />
                  <el-option label="分级渲染" value="graded" />
                </el-select>
              </el-form-item>
              <div class="symbol-preview-section">
                <div class="symbol-box-wrapper"><div class="symbol-box-preview"></div></div>
                
              </div>
              <!-- <el-checkbox v-model="form.usePriority" label="符号优先级" class="priority-checkbox" /> -->
              <el-table :data="tableData" border size="small" class="symbol-table">
                <el-table-column label="符号" width="60" align="center">
                  <template #default><div class="table-symbol-preview"></div></template>
                </el-table-column>
                <el-table-column prop="name" label="符号名称" />
                <!-- <el-table-column prop="value" label="-1-" /> -->
                <el-table-column label="" width="40" />
              </el-table>
            </div>
            <!-- 底部按钮栏 -->
            <div class="panel-footer">
              <el-button>重置</el-button>
              <el-button type="primary">应用</el-button>
            </div>
</el-form>
</template>
<script setup>
import { ref,onMounted,computed,reactive } from 'vue'
// 使用 reactive 创建一个集中的表单数据对象
const form = reactive({
  layerName: 'blockLength',
  renderType: 'single',
  usePriority: false,
  annotation: '',
  renderType_layer:'single'
});

</script>
<style scoped>

.panel-footer {
  text-align: center;
  padding: 10px 15px;
  /* border-top: 1px solid #fefefe; */
  background-color:rgba(30, 41, 59, 0.88);
  flex-shrink: 0;
  /* border-radius: 6px; */
}
.form-content {
  padding: 15px;
  background-color: rgba(30, 41, 59, 0.88);
  border-radius: 0px;
  flex-grow: 1;
  
}
</style>
