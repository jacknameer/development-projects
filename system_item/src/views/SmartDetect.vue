<template>
    <el-container class="main-container">
      <!-- 左侧控制面板 -->
      <el-aside width="350px" class="control-panel">
        <el-tabs v-model="activeTab" class="main-tabs">
          <el-tab-pane label="执行检测" name="satellite">
            <!-- 筛选表单 -->
            <el-form :model="formData" label-position="top" class="filter-form">
  
              <!-- 检索区域 -->
              <el-form-item label="检索区域">
                <!-- 第一个下拉框，功能独立 -->
                <div class="form-row">
        <el-select v-model="formData.adminRegion" placeholder="请选择影像" style="width: 100%;">
            <el-option label="影像1" value="beijing" />
            <el-option label="影像2" value="shanghai" />
        </el-select>
                </div>
                <!-- 第二个下拉框，功能独立，使用新的 v-model -->
                <div class="form-row">
        <el-select v-model="formData.drawMethod" placeholder="请选择范围" style="width: 100%;">
            <el-option label="方形" value="square" />
            <el-option label="矩形" value="rectangle" />
            <el-option label="多边形" value="polygon" />
        </el-select>
                </div>

                <!-- 上传按钮 -->
                <!-- <div class="form-row">
        <el-button :icon="Upload" style="width: 100%">上传文件</el-button>
                </div> -->

                <!-- 功能选择（这也需要从 radio-group 中移出） -->
                <div class="form-row">
                    <el-form-item label="功能选择" style="margin-bottom: 0;">
                        <!-- 将 checkbox-group 换成 radio-group -->
                        <div class="form-row">
                            <el-select v-model="formData.modelfun" placeholder="请选择功能" style="width: 100%;">
                                <el-option label="变化检测" value="model1" />
                                <el-option label="林间道路提取" value="model2" />
                            </el-select>
                        </div>
                        <div class="form-row">
                            <el-select v-model="formData.modeloptions" placeholder="请选择检测所用模型" style="width: 100%;">
                                <el-option label="模型1" value="model1" />
                                <el-option label="模型2" value="model2" />
                            </el-select>
                        </div>
                        
                    </el-form-item>
                </div>
              </el-form-item>

              <div class="footer-actions">
                <!-- <el-button>重置</el-button>
                <el-button>引用</el-button> -->
                <el-button type="primary" @click="handleSearch">执行检测</el-button>
              </div>
              
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="新模型上传" name="product">
            <el-form :model="uploadFormData" label-position="top" class="upload-form">
                <el-form-item label="模型名称">
                    <el-input v-model="uploadFormData.modelName" placeholder="请输入模型名称"></el-input>
                </el-form-item>
                <el-form-item label="模型功能">
                    <el-input v-model="uploadFormData.modelName" placeholder="请输入模型具体功能"></el-input>
                </el-form-item>

                <el-form-item label="模型描述">
                    <el-input
                        v-model="uploadFormData.modelDescription"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入关于模型的简要描述"
                    ></el-input>
                </el-form-item>

                <el-form-item label="模型文件上传">
                    <el-upload
                        ref="uploadRef"
                        class="model-uploader"
                        action="#" 
                        :auto-upload="false"
                        :limit="1"
                        :on-exceed="handleExceed"
                    >
                        <template #trigger>
                        <el-button type="primary">选择文件</el-button>
                        </template>
                        <template #tip>
                        <div class="el-upload__tip">
                            请上传 .zip, .pt, 或 .h5 格式的模型文件。
                        </div>
                        </template>
                    </el-upload>
                </el-form-item>

                <div class="footer-actions">
                    <el-button type="success" @click="submitUpload">确认上传</el-button>
                </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="上传影像" name="service">
            <FileUpload></FileUpload>
          </el-tab-pane>
        </el-tabs>
          
      </el-aside>
  
      <!-- 右侧地图展示区 -->
      <el-main class="map-container">
        <div class="map-placeholder" id="map"></div>
        <!-- 右上角浮动按钮 -->
        <el-button class="float-btn top-right"  @click="openModelDrawer">模型权重文件下载</el-button>

        <el-drawer
            v-model="drawerVisible"
            title="模型权重文件列表"
            direction="rtl"
            size="400px"
            custom-class="model-drawer"
            >
        <el-table :data="modelList" style="width: 100%">
            <el-table-column prop="name" label="模型名称" />
            <el-table-column prop="version" label="版本" width="80" />
            <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
            <el-button 
            type="primary" 
            link 
            @click="handleDownload(scope.row)"
            >
            下载
            </el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-drawer>
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  // 组件的导入
  import FileUpload from '@/components/FileUpload.vue';


  import { ref, reactive, onMounted } from 'vue';
  import { Position, Upload, Menu, FullScreen, MapLocation, Files as Layer } from '@element-plus/icons-vue';
  
    // 新增：从 element-plus 引入 ElMessage 和 genFileId
    import { ElMessage, genFileId } from 'element-plus';
  
  // 1. 引入 OpenLayers 的 CSS 文件
  import 'ol/ol.css'; 

  // 2. 引入 OpenLayers 需要的模块
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import XYZ from 'ol/source/XYZ';
  import { fromLonLat } from 'ol/proj';
  
  const activeTab = ref('satellite');
  
  const formData = reactive({
  adminRegion: '',
  drawMethod: '',
  modelfun: '', // <-- 新增的下拉框选项
  modeloptions: '', // <-- 新增的下拉框选项
  functionality: '林地道路提取', // <-- 改为单选的字符串，默认为'林地提取'，或设为 '' 代表不选
  dateRange: '',
 });
  
  const handleSearch = () => {
    console.log('开始检索，参数为:', formData);
  };

//   地图展示
  const SkyMap_key="6ae7ecacd50dfc97f805e753f68823f3"; // 您的天地图密钥

  onMounted(()=>{
    const imgLayer = new TileLayer({
      source: new XYZ({
        url: `https://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${SkyMap_key}`
      })
    });

    const imgLabelLayer = new TileLayer({
      source: new XYZ({
        url: `https://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${SkyMap_key}`
      })
    });
    
    // 3. 使用正确的变量名
    const map = new Map({
      target: 'map', // 这里的 'map-placeholder' 对应 <template> 中 div 的 id
      layers: [imgLayer, imgLabelLayer],
      view: new View({
        center: fromLonLat([116.391, 39.907]), // 北京
        zoom: 10,
      }),
      controls: [], // 移除默认控件，因为我们有自定义的浮动按钮
    });

    
  });


//   以下为新模型上传页面代码
// 为新模型上传表单创建独立的数据对象
const uploadFormData = reactive({
    modelName: '',
    modelDescription: '',
  });

// 这是模型下载
// 模拟的模型列表数据
const modelList = ref([
  { id: 1, name: '林地道路提取模型', version: 'v1.2', url: '/downloads/model_forest_road_v1.2.zip' },
  { id: 2, name: '田间地块提取模型', version: 'v2.0', url: '/downloads/model_field_parcel_v2.0.zip' },
  { id: 3, name: '通用物体检测模型', version: 'v1.0', url: '/downloads/model_general_object_v1.0.pt' },
  { id: 4, name: '建筑物分割模型', version: 'v3.1', url: '/downloads/model_building_seg_v3.1.h5' },
]);
// 打开抽屉的函数
// 控制抽屉的显示/隐藏
const drawerVisible = ref(false);
const openModelDrawer = () => {
  drawerVisible.value = true;
};

</script>
  
<style scoped>
  /* 整体布局样式 */
  .main-container {
    height: 100vh;
    width: 100vw;
    background-color: #000;
    color: #fff;
    overflow: hidden;
  }
  
  /* 左侧面板 */
  .control-panel {
    background-color: #24272a;
    display: flex;
    flex-direction: column;
    padding: 0 15px;
  }
  
  /* 右侧地图容器 */
  .map-container {
    padding: 0;
    position: relative;
  }
  
  #map {
      width: 100%;
      height: 100%;
      background-color: #000;
  }
  
  /* 浮动按钮通用样式 */
  .float-btn {
      position: absolute;
      background-color: rgba(36, 39, 42, 0.8);
      border: 1px solid #4a4a4a;
      color: #fff;
      border-radius: 15px;
  }
  .float-btn:hover {
      background-color: rgba(60, 65, 70, 0.9);
      border-color: #666;
  }
  
  .top-right {
      top: 30px;
      right: 40px;
  }
  .side-toolbar {
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
  }
  :deep(.side-toolbar .el-button) {
      background-color: rgba(36, 39, 42, 0.8);
      border: 1px solid #4a4a4a;
      color: #fff;
  }
  
  /* --- 暗黑主题样式覆盖 (关键部分) --- */
  :deep(.el-tabs__header) {
    margin: 0 0 15px;
    border-bottom: 1px solid #4a4a4a;
  }
  :deep(.el-tabs__item) {
    color: #ccc;
  }
  :deep(.el-tabs__item.is-active) {
    color: #fff;
  }
  :deep(.el-tabs__content) {
    flex-grow: 1;
    overflow-y: auto;
  }
  
  .filter-form {
    padding: 0 5px;
  }
  :deep(.el-form-item__label) {
    color: #ccc;
  }
  :deep(.el-input__wrapper, .el-select__wrapper, .el-date-editor) {
    background-color: #2c3033;
    box-shadow: none;
    border: 1px solid #4a4a4a;
  }
  :deep(.el-input__inner, .el-range-input) {
    color: #fff;
  }
  :deep(.el-checkbox__label, .el-radio__label) {
    color: #ccc;
  }
  
  /* ↓↓↓↓↓↓ 这是您需要修改的部分 ↓↓↓↓↓↓ */
  /* 为新的独立行容器添加样式 */
  .form-row {
    width: 100%;
    margin-bottom: 18px; /* 为每一行控件设置一个合适的下边距 */
  }

  /* 最后一行不需要下边距，让布局更规整 */
  .form-row:last-child {
    margin-bottom: 0;
  }
  /* ↑↑↑↑↑↑ 修改结束 ↑↑↑↑↑↑ */
  
  .footer-actions {
    padding: 15px 0;
    border-top: 1px solid #4a4a4a;
    text-align: right;
  }
  .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
:deep(.model-drawer) {
  background-color: #24272a !important;
}
:deep(.model-drawer .el-drawer__header) {
  color: #fff;
  margin-bottom: 20px;
  border-bottom: 1px solid #4a4a4a;
}
:deep(.model-drawer .el-drawer__close-btn) {
  color: #fff;
}
/* 自定义表格的暗黑样式 */
:deep(.model-drawer .el-table) {
  --el-table-bg-color: #24272a;
  --el-table-tr-bg-color: #24272a;
  --el-table-header-bg-color: #2c3033;
  --el-table-header-text-color: #ccc;
  --el-table-text-color: #fff;
  --el-table-border-color: #4a4a4a;
  --el-table-row-hover-bg-color: #2c3033;
}
</style>