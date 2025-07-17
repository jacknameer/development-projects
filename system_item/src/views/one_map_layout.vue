<template>
  <div class="map_wrapper">
    <!-- 左侧的折叠图层面板 -->
    <div class="floating-layer-panel">
      <!-- 标题 -->
      <div class="panel-title-bar">可展示图层列表</div>
      
      <!-- 滚动容器 -->
      <div class="layer-tree-scroll-container">
  
        <!-- 根节点 (第一级) -->
        <div v-for="level1_item in layerTreeData" :key="level1_item.value" class="level-1-item">
          <!-- 第一级标题 -->
          <div class="item-header" @click="level1_item.expanded = !level1_item.expanded">
            <el-icon class="expand-icon" :class="{ 'is-expanded': level1_item.expanded }">
              <ArrowRight />
            </el-icon>
            <span>{{ level1_item.label }}</span>
          </div>
          
          <!-- 第二级容器 -->
          <div v-if="level1_item.expanded" class="children-container level-2-container">
            <div v-for="level2_item in level1_item.children" :key="level2_item.value" class="level-2-item">
              <!-- 第二级标题 -->
              <div class="item-header" @click="level2_item.expanded = !level2_item.expanded">
                <el-icon class="expand-icon" :class="{ 'is-expanded': level2_item.expanded }">
                  <ArrowRight />
                </el-icon>
                <span>{{ level2_item.label }}</span>
              </div>
              
              <!-- 第三级容器 -->
              <div v-if="level2_item.expanded" class="children-container level-3-container">
                <!-- 循环渲染第三级项目 -->
                <div v-for="level3_item in level2_item.children" :key="level3_item.value" class="level-3-item-wrapper">
                  
                  <!-- 判断第三级是父节点还是叶子节点 -->
                  <!-- 如果有 children，则渲染为可展开的标题 -->
                  <div v-if="level3_item.children" class="item-header" @click="level3_item.expanded = !level3_item.expanded">
                    <el-icon class="expand-icon" :class="{ 'is-expanded': level3_item.expanded }">
                      <ArrowRight />
                    </el-icon>
                    <span>{{ level3_item.label }}</span>
                  </div>
                  
                  <!-- 如果没有 children，则渲染为普通的勾选项 -->
                  <div v-else class="level-3-item">
                    <el-checkbox v-model="level3_item.selected" :label="level3_item.label" :value="level3_item.value" />
                  </div>

                  <!-- 第四级容器 (新增部分) -->
                  <!-- 条件：第三级必须有 children 并且处于展开状态 -->
                  <div v-if="level3_item.children && level3_item.expanded" class="children-container level-4-container">
                    <div v-for="level4_item in level3_item.children" :key="level4_item.value" class="level-4-item">
                      <!-- 第四级是最终的可勾选项 -->
                      <el-checkbox v-model="level4_item.selected" :label="level4_item.label" :value="level4_item.value" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 右上角的功能区 (这部分保持不变) -->
    <div class="top-right-wrapper">
      
      <!-- 1. 切换按钮 -->
      <div class="top-right-size-control">
        <el-radio-group v-model="sizeControl">
          <el-radio-button label="符号化渲染" />
          <el-radio-button label="数据文件上传" />
          <el-radio-button label="数据统计" />
        </el-radio-group>
      </div>

      <!-- 2. 共享的内容面板 -->
      <div class="floating-panel top-right">

        <!-- 2.1 符号化渲染 -->
        <div v-if="sizeControl === '符号化渲染'" class="symbol-editor-panel">
          <div class="panel-header">
            <span class="title">符号化渲染</span>
          </div>
          <div class="form-content">
            <SymbolRender></SymbolRender>
          </div>
        </div>

        <!-- 2.2 数据文件上传 -->
        <div v-else-if="sizeControl === '数据文件上传'" class="data-upload-panel">
          <div class="panel-header">
            <span class="title">数据文件上传</span>
          </div>
          <div class="form-content">
            <FileUpload></FileUpload>
          </div>
        </div>

        <!-- 2.3 数据统计 -->
        <div v-else-if="sizeControl === '数据统计'" class="data-stats-panel">
          <div class="panel-header">
            <span class="title">数据统计</span>
          </div>
          <div class="form-content">
            <Data_c></Data_c>
          </div>
        </div>

      </div>
    </div>
    
    <!-- 地图容器 (保持不变) -->
    <div id="map" class="map"></div>
  </div>
</template>

<script setup lang="ts">
// 引入子组件
import SymbolRender from '@/components/SymbolRender.vue';
import FileUpload from '@/components/FileUpload.vue';
import  Data_c from '@/components/Statistics.vue'; 

import { ref,onMounted,computed,reactive } from 'vue'
// 2. 新增：引入图标和 Element Plus 组件

import { CopyDocument, Close,ArrowRight } from '@element-plus/icons-vue';
import { ElRadioGroup, ElRadioButton } from 'element-plus'; // (可选) 显式引入，通常自动引入也能工作
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { RouterView } from 'vue-router';





// 1. 新增：为切换按钮创建一个响应式变量，默认值为 'default'
const sizeControl = ref('符号化渲染');


// 表格的示例数据
const tableData = reactive([
  { name: '默认符号', value: 'Default' },
  // 可以在这里添加更多数据行
]);

// 创建一个类似于kqgis的下拉树
// / 3. 新增：三级折叠列表的数据结构
const layerTreeData = ref([
  {
    label: '中国',
    value: 'base-geo',
    expanded: false, // 控制第一级展开
    children: [
      {
        label: '湖北省',
        value: 'admin-division',
        expanded: false, // 控制第二级展开
        children: [
          { label: '当阳市', 
          value: 'country-border', 
          selected: false ,
          expanded: false, // 控制第三级展开
          children:[
            {
              label: '湖北当阳市一号测量区域',
              value: 'xx',
              expanded: false,
              selected: true,
            }
          ]
        },
        ],
      },
    ],
  },
  
]);



// 我的天地图的密钥
const SkyMap_key="6ae7ecacd50dfc97f805e753f68823f3"

onMounted(()=>{

  const imgLayer = new TileLayer({
  source: new XYZ({
    url: `https://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${SkyMap_key}`
  })
  })
  const imgLabelLayer = new TileLayer({
  source: new XYZ({
    url: `https://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${SkyMap_key}`
  })
  })
  
  const map=new Map({
    target: 'map',
    layers: [imgLayer, imgLabelLayer],
    view:new View({
      center:fromLonLat([116.391,39.907]), // 北京
      zoom:10,
    }),
    controls: [],
  })

})




</script>

<style scoped>
/* ======================================== */
/* 1. 基础布局容器 */
/* ======================================== */
.map_wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: visible;
  border-radius: 15px;
}

.map {
  width: 100%;
  height: 100%;
}

/* ======================================== */
/* 2. 所有悬浮面板的通用定位 */
/* ======================================== */
.floating-panel {
  position: absolute;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

/* ======================================== */
/* 3. 左上角：筛选器面板 (无变化) */
/* ======================================== */
.floating-filters {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
  padding: 10px;
  background-color: rgba(30, 41, 59, 0.88);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  gap: 10px;
  width: 900px;
}

.filter-item {
  width: 170px;
}

/* 增强提示文字可见性 (无变化) */
:deep(.floating-filters .el-select.filter-item .el-input__wrapper) {
  background-color: rgba(60, 80, 110, 0.8) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

:deep(.floating-filters .el-select.filter-item .el-input__inner) {
  color: #e0e0e0 !important;
}

:deep(.floating-filters .el-select.filter-item .el-input__inner::placeholder) {
  color: #d1d5db !important;
  opacity: 1 !important;
}

:deep(.floating-filters .el-select.filter-item .el-select__caret) {
  color: #b0b0b0 !important;
}

:deep(.el-select-dropdown.el-popper) {
  background-color: rgba(44, 62, 80, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: rgba(71, 85, 105, 0.9) !important;
}

:deep(.el-select-dropdown__item.selected) {
  color: #409eff !important;
}

:deep(.el-select-dropdown__item) {
  color: #cfd8dc !important;
}


/* ======================================================== */
/* 4. 左侧三级折叠图层列表面板样式 (无变化)              */
/* ======================================================== */
.floating-layer-panel {
  position: absolute;
  top: 20px;
  left: 15px;
  z-index: 10;
  width: 280px;
  height: calc(100vh - 85px - 70px);
  max-height: 900px;
  background-color: rgba(30, 41, 59, 0.88);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
}
/* rgba(255, 255, 255, 0.2) */
.panel-title-bar {
  padding: 12px 15px;
  font-weight: 600;
  border-bottom: 1px solid white;
  flex-shrink: 0;
}

.layer-tree-scroll-container {
  padding: 10px;
  overflow-y: auto;
  flex-grow: 1;
  
}

.layer-tree-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.layer-tree-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.layer-tree-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.item-header {
  display: flex;
  align-items: center;
  padding: 8px 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  user-select: none;
}

.item-header:hover {
  background-color: rgba(71, 85, 105, 0.7);
}

.expand-icon {
  margin-right: 8px;
  transition: transform 0.2s ease;
}

.expand-icon.is-expanded {
  transform: rotate(90deg);
}

.children-container {
  padding-left: 20px;
}

.level-3-item {
  display: flex;
  align-items: center;
  padding: 4px 0 4px 24px;
}

:deep(.el-checkbox) {
  .el-checkbox__label {
    color: #cfd8dc !important;
    font-size: 14px;
    transition: color 0.2s;
  }
  .el-checkbox__label:hover {
    color: #ffffff !important;
  }
  .el-checkbox__inner {
    background-color: transparent;
    border-color: #909399;
    transition: border-color 0.2s, background-color 0.2s;
  }
  .el-checkbox__input:not(.is-checked):hover .el-checkbox__inner {
      border-color: #409EFF;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409EFF !important;
  }
}


/* ======================================== */
/* 5. 【关键修改区域】右上角布局与面板样式     */
/* ======================================== */

/* 新增：右上角总包装容器，负责定位 */
.top-right-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5px; /* 在按钮组和内容面板之间增加一点小间距 */
  width: 380px; /* 给整个容器一个固定的宽度 */
  
  
}



/* 修改：内容面板容器也不再需要独立定位和固定宽度 */
.top-right {
  position: relative; /* 改为相对定位，因为它现在在 flex 流中 */
  width: 100%; /* 撑满父容器的宽度 */
  max-height: calc(100vh - 75px); /* (60px_approximated_top + 15px_bottom_margin) */
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  /* box-shadow 和 border-radius 已在 .floating-panel 中定义 */
}

/* 新增：让按钮组撑满宽度并均分 */
:deep(.top-right-size-control .el-radio-group) {
  width: 100%;
  display: flex;
  border-radius: 6px; /* 【新增】设置圆角大小，可以根据喜好调整 */
  overflow: hidden;    /* 【关键】防止内部按钮的直角溢出，破坏圆角效果 */
}

:deep(.top-right-size-control .el-radio-button) {
  flex: 1; /* 让每个按钮平分宽度 */
}

:deep(.top-right-size-control .el-radio-button .el-radio-button__inner) {
  width: 100%;
  text-align: center;
}

/* 新增/修改：统一所有面板内容的布局，确保它们能填满容器 */
.symbol-editor-panel,
.data-upload-panel,
.data-stats-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* (以下为符号渲染面板内部样式，保持不变) */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
  background-color: rgba(30, 41, 59, 0.88);
}

.title,
.panel-title {
  font-weight: 600;
  color: #f2f3f5;
}

.form-content {
  padding: 15px;
  overflow-y: auto;
  flex-grow: 1;
  height: 75vh;
  border-radius: 6px;
  background-color: rgba(30, 41, 59, 0.88);
  
}

.el-form-item {
  margin-bottom: 15px;
}

.el-select {
  width: 100%;
}

.symbol-preview-section {
  display: flex;
  align-items: center;
  margin-left: 80px;
  margin-bottom: 15px;
}




.priority-checkbox {
  margin-bottom: 15px;
}





/* .panel-footer {
  text-align: right;
  padding: 10px 15px;
  border-top: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  flex-shrink: 0;
  border-radius: 6px;
} */

/* ======================================== */
/* 6. 左下角：图例面板 (无变化)               */
/* ======================================== */
.legend-color-1,
.legend-color-2 {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 3px;
}
.legend-color-1 { background-color: #409eff; }
.legend-color-2 { background-color: #f56c6c; }
</style>