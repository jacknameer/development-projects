import { createRouter, createWebHistory} from 'vue-router';
// 导入路由组件
import one_map_layout from '@/views/one_map_layout.vue';
import SmartDetect from '@/views/SmartDetect.vue';
import RunLog from '@/views/RunLog.vue';
import Personal from '@/views/Personal.vue';
import login from '@/views/login.vue';
import register from '@/views/register.vue';
import { pa } from 'element-plus/es/locales.mjs';
//  定义路由配置数组，每个元素是一个RouteRecordRaw对象
const router = createRouter({
    history:createWebHistory(),
    routes: [
        // 根路径重定向
        {
            path: '/',
            redirect: '/home' // 访问根路径时自动跳转到 /home
        },
        // 路径1：检测一张图根路径，主页面路径
        {
            path: '/home',
            name: 'Home',
            component: one_map_layout, 
            
        },
        // 路径2：智能检测页面
        {
            path: '/SmartDetect', 
            name:"SmartDetect",
            component: SmartDetect, 

        },
        // 路径3：运行日志页面
        {
            path:'/RunLog',
            name:"RunLog",
            component:RunLog
        },
        // 路径4：个人中心页面
        {
            path:'/peronal',
            name:"peronal",
            component:Personal
        },
        // 路径5登录页面
        {
            path:'/login',
            name:"login",
            component:login,
        },
        // 路径6注册页面
        {
            path:'/register',
            name:"register_user",
            component:register
        }



    ]
})

export default router;