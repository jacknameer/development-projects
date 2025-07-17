
// 组件导入
// import one_map_layout from './views/one_map_layout.vue';


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/base.css'
// #elementplus组件库
import ElementPlus from 'element-plus'
//echarts图画组件库
// 引入 ECharts 核心模块
import * as echarts from 'echarts/core'
// 引入所需图表（按需添加）
import { LineChart, BarChart, PieChart } from 'echarts/charts'
// 引入提示框、标题、图例等组件（按需添加）
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
// 引入渲染器（必须）
import { CanvasRenderer } from 'echarts/renderers'

// 注册组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer
])

import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';

// 导入路由文件
import router from './router/UseRouter'



const app = createApp(App)
app.use(createPinia())
//全局注册 Element Plus
app.use(ElementPlus)
// 注册所有图标（也可按需引入，根据项目体积需求调整）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

// 挂载到全局（可选，方便组件内使用）
app.config.globalProperties.$echarts = echarts
//使用路由
app.use(router)


app.mount('#app')
