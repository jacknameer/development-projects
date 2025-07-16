<template>
  <div class="map_wrapper">
    <!-- 下拉面板 -->
    <div class="floating-filters">
      <el-select v-model="filter1" placeholder="国家" clearable class="filter-item">
        <el-option label="中国" value="a"></el-option>
        <el-option label="美国" value="b"></el-option>
      </el-select>

      <el-select v-model="filter2" placeholder="省区" clearable class="filter-item">
        <el-option label="湖北省" value="x"></el-option>
        <el-option label="云南省" value="y"></el-option>
      </el-select>

      <!-- <el-select v-model="filter3" placeholder="市区" clearable class="filter-item">
        <el-option label="武汉市" value="1"></el-option>
        <el-option label="昆明市" value="2"></el-option>
      </el-select> -->

      <el-select v-model="filter4" placeholder="功能" clearable class="filter-item">
        <el-option label="变化检测" :value="true"></el-option>
        <el-option label="道路提取" :value="false"></el-option>
      </el-select>
      <el-select v-model="filter5" placeholder="模型" clearable class="filter-item">
        <el-option label="模型1" :value="true"></el-option>
        <el-option label="模型2" :value="false"></el-option>
      </el-select>
    </div>
    <!-- 1. 修改：这里是新的三级折叠图层面板 -->
    <div class="floating-layer-panel">
      <!-- 标题 -->
      <div class="panel-title-bar">图层列表</div>

      <!-- 滚动容器 -->
      <div class="layer-tree-scroll-container">
        <!-- 根节点 -->
        <div v-for="level1_item in layerTreeData" :key="level1_item.value" class="level-1-item">
          <!-- 第一级 -->
          <div class="item-header" @click="level1_item.expanded = !level1_item.expanded">
            <el-icon class="expand-icon" :class="{ 'is-expanded': level1_item.expanded }">
              <ArrowRight />
            </el-icon>
            <span>{{ level1_item.label }}</span>
          </div>
          <!-- 第二级容器 -->
          <div v-if="level1_item.expanded" class="children-container level-2-container">
            <div v-for="level2_item in level1_item.children" :key="level2_item.value" class="level-2-item">
              <!-- 第二级 -->
              <div class="item-header" @click="level2_item.expanded = !level2_item.expanded">
                <el-icon class="expand-icon" :class="{ 'is-expanded': level2_item.expanded }">
                  <ArrowRight />
                </el-icon>
                <span>{{ level2_item.label }}</span>
              </div>
              <!-- 第三级容器 -->
              <div v-if="level2_item.expanded" class="children-container level-3-container">
                <div v-for="level3_item in level2_item.children" :key="level3_item.value" class="level-3-item">
                  <!-- 第三级 (可勾选项) -->
                  <el-checkbox v-model="level3_item.selected" :label="level3_item.label" :value="level3_item.value" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- (其他悬浮框无变化) -->


     <!-- 1. 右上角的悬浮框 -->
    <div v-if="areAllFiltersSelected" class="floating-panel top-right">
      <div class="symbol-editor-panel">
        <el-form :model="form" label-position="right" label-width="80px" class="main-form">
      <!-- 1. 顶部标题栏 -->
          <div class="panel-header">
            <span class="title">符号渲染</span>
            <div class="actions">
          <el-button :icon="CopyDocument" text circle title="复制" />
          <el-button :icon="Close" text circle title="关闭" />
            </div>
          </div>

      <!-- 2. 核心表单区域 -->
          <div class="form-content">
            <el-form-item label="图层名称:">
          <el-input v-model="form.layerName" disabled />
            </el-form-item>
            <el-form-item label="渲染类型:">
          <el-select v-model="form.renderType" placeholder="请选择渲染类型">
            <el-option label="单一符号" value="single" />
            <el-option label="分类渲染" value="category" />
            <el-option label="分级渲染" value="graded" />
          </el-select>
            </el-form-item>

        <!-- 3. 符号预览区 -->
            <div class="symbol-preview-section">
          <div class="symbol-box-wrapper">
            <div class="symbol-box-preview"></div>
          </div>
          <el-button text bg>...</el-button>
            </div>

        <!-- 4. 符号优先级 -->
            <el-checkbox v-model="form.usePriority" label="符号优先级" class="priority-checkbox" />

        <!-- 5. 符号列表 -->
            <el-table :data="tableData" border size="small" class="symbol-table">
              <el-table-column label="符号" width="60" align="center">
                <template #default>
                  <div class="table-symbol-preview"></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="符号名称" />
              <el-table-column prop="value" label="-1-" />
              <el-table-column label="" width="40" />
            </el-table>

        <!-- 6. 标注输入框 -->
            <el-form-item label="标注:">
              <el-input v-model="form.annotation" type="textarea" :rows="3" placeholder="请输入标注内容" />
            </el-form-item>
          </div>

      <!-- 7. 底部按钮栏 -->
        <div class="panel-footer">
          <el-button >重置</el-button>
          <el-button type="primary">应用</el-button>
        </div>
        </el-form>
      </div>
    </div>
    <!-- 2. 新增：左下角的悬浮框 -->
    <div v-if="areAllFiltersSelected" class="floating-panel bottom-left">
      <h4>图例信息</h4>
      <ul>
        <li><span class="legend-color-1"></span> 已覆盖区域</li>
        <li><span class="legend-color-2"></span> 未覆盖区域</li>
      </ul>
    </div>
    <!-- 地图容器 -->
    <div id="map" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,computed,reactive } from 'vue'
// 2. 新增：引入图标和 Element Plus 组件

import { CopyDocument, Close,ArrowRight } from '@element-plus/icons-vue';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

// 为四个下拉框创建响应式数据
const filter1 = ref('');
const filter2 = ref('');
const filter3 = ref('');
const filter4 = ref('');
const filter5 = ref('');


// 使用 reactive 创建一个集中的表单数据对象
const form = reactive({
  layerName: 'blockLength',
  renderType: 'single',
  usePriority: false,
  annotation: '',
});

// 表格的示例数据
const tableData = reactive([
  { name: '默认符号', value: 'Default' },
  // 可以在这里添加更多数据行
]);

// 3. 核心：创建一个计算属性来判断所有下拉框是否都有值
const areAllFiltersSelected = computed(() => {
  // .every() 方法会检查数组中的所有元素是否都满足一个条件
  return [
    filter1.value, 
    filter2.value, 
    filter3.value, 
    filter4.value, 
    filter5.value
  ].every(value => value !== '' && value !== null && value !== undefined);
});

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
          { label: '区域1', value: 'country-border', selected: false },
          { label: '区域2', value: 'province-border', selected: true }, // 默认勾选
          { label: '区域3', value: 'city-border', selected: false },
        ],
      },
      {
        label: '江西省',
        value: 'transportation',
        expanded: false,
        children: [
          { label: '区域1', value: 'railway', selected: false },
          { label: '区域2', value: 'main-road', selected: false },
        ],
      },
    ],
  },
  {
    label: '美国',
    value: 'remote-sensing',
    expanded: false,
    children: [
      {
        label: '亚利桑那州',
        value: 'gf-2',
        expanded: false,
        children: [
          { label: '区域1', value: 'gf2-2023', selected: false },
          { label: '区域2', value: 'gf2-2022', selected: false },
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
/* 3. 左上角：筛选器面板 */
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
  width: 170px; /* 调整宽度以适应5个选择器 */
}

/* 增强提示文字可见性 */
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
/* 4. 新增/替换：三级折叠图层列表面板样式                  */
/* ======================================================== */
.floating-layer-panel {
  position: absolute;
  top: 70px; /* 紧邻上方筛选器 */
  left: 15px;
  z-index: 10;
  width: 280px; /* 您可以根据需要调整面板宽度 */
  height: calc(100vh - 85px - 70px); /* 动态计算高度，留出上下边距 */
  max-height: 900px; /* 设置一个最大高度 */
  background-color: rgba(30, 41, 59, 0.88);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e0e0e0;
  display: flex;
  flex-direction: column; /* 垂直布局：标题 + 列表 */
}

.panel-title-bar {
  padding: 12px 15px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0; /* 防止标题栏在空间不足时被压缩 */
}

.layer-tree-scroll-container {
  padding: 10px;
  overflow-y: auto; /* 当内容超出时显示滚动条 */
  flex-grow: 1; /* 占据所有剩余的垂直空间 */
}

/* 美化滚动条 (仅对 Webkit 内核浏览器生效) */
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

/* 每一级可点击的标题行 */
.item-header {
  display: flex;
  align-items: center;
  padding: 8px 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  user-select: none; /* 防止点击时选中文本 */
}

.item-header:hover {
  background-color: rgba(71, 85, 105, 0.7);
}

/* 展开/折叠的箭头图标 */
.expand-icon {
  margin-right: 8px;
  transition: transform 0.2s ease;
}

/* 箭头旋转效果 */
.expand-icon.is-expanded {
  transform: rotate(90deg);
}

/* 子项的容器，用于实现缩进 */
.children-container {
  padding-left: 20px;
}

/* 第三级可勾选项 */
.level-3-item {
  display: flex;
  align-items: center;
  padding: 4px 0 4px 24px; /* 额外缩进，与父级的文字对齐 */
}

/* 深度作用选择器，修改 Element Plus Checkbox 在深色背景下的样式 */
:deep(.el-checkbox) {
  /* 修改标签文字颜色 */
  .el-checkbox__label {
    color: #cfd8dc !important;
    font-size: 14px;
    transition: color 0.2s;
  }
  .el-checkbox__label:hover {
    color: #ffffff !important;
  }
  
  /* 修改勾选框的边框 */
  .el-checkbox__inner {
    background-color: transparent;
    border-color: #909399;
    transition: border-color 0.2s, background-color 0.2s;
  }
  
  /* 鼠标悬浮时边框颜色 */
  .el-checkbox__input:not(.is-checked):hover .el-checkbox__inner {
      border-color: #409EFF;
  }
  
  /* 选中状态的样式 */
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }

  /* 选中状态的文字颜色 */
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409EFF !important;
  }
}


/* ======================================== */
/* 5. 右上角：符号化设置面板 (及之后的内容保持不变) */
/* ======================================== */
.top-right {
  top: 15px;
  right: 15px;
  width: 380px;
  max-height: calc(100vh - 30px);
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: flex;
  flex-direction: column;
}

.symbol-editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.title,
.panel-title {
  font-weight: 600;
  color: #303133;
}

.form-content {
  padding: 15px;
  overflow-y: auto;
  flex-grow: 1;
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

.symbol-box-wrapper {
  padding: 4px;
  border: 1px solid #dcdfe6;
  background-color: white;
  margin-right: 10px;
}

.symbol-box-preview {
  width: 90px;
  height: 50px;
  background-color: #d9ecff;
  border: 1px solid #79bbff;
}

.priority-checkbox {
  margin-bottom: 15px;
}

.symbol-table {
  width: 100%;
  margin-bottom: 15px;
}

.table-symbol-preview {
  width: 20px;
  height: 20px;
  background-color: #d9ecff;
  border: 1px solid #79bbff;
  margin: 0 auto;
}

.panel-footer {
  text-align: right;
  padding: 10px 15px;
  border-top: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

/* ======================================== */
/* 6. 左下角：图例面板 */
/* ======================================== */
.bottom-left {
  bottom: 15px;
  left: 15px;
  width: 220px;
  padding: 15px;
  background-color: rgba(30, 41, 59, 0.88);
  color: #e2e8f0;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-left h4 {
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
}

.bottom-left ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bottom-left li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

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