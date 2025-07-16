
// 组件导入
// import one_map_layout from './views/one_map_layout.vue';


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/base.css'
// #elementplus组件库
import ElementPlus from 'element-plus'
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
//使用路由
app.use(router)


app.mount('#app')
