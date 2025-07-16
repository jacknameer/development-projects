 <template>
  <div id="app">
    <el-container style="height: 100%; width: 100%; border: 1px solid #000; box-sizing: border-box;">
      <el-header style="background-color: #2c3e50; padding: 0; display: flex; align-items: center; border-bottom: 1px solid #000; height: 60px; min-width: 0; overflow: visible;">
        <div style="padding: 0 20px; display: flex; flex-direction: column; justify-content: center;">
    <!-- 2. 中文标题 -->
          <div style="color: white; font-size: 20px; line-height: 1.4;">
                农田基础设施遥感智能解译平台
          </div>
    <!-- 3. 英文小字 -->
          <div style="color: #b3c0d1; font-size: 12px; line-height: 1.4;">
              Intelligent Interpretation Platform for Farmland Infrastructure Remote Sensing
          </div>
        </div>
        <el-menu
          mode="horizontal"
          background-color="#2c3e50"
          text-color="#b3c0d1"
          active-text-color="#b3c0d1"
          style="border-bottom: none; margin-left: auto; padding: 0 20px; min-width: 0; display: flex; white-space: nowrap;"
          :collapse="false"
          
          :popper-append-to-body="false"
          :ellipsis="false"
           router :default-active="$route.path"
           
        >
          <el-menu-item index="/login">登录</el-menu-item>
          <el-menu-item index="/home">检测一张图</el-menu-item> 
          <el-menu-item index="/SmartDetect">智能检测</el-menu-item>
          <el-menu-item index="/RunLog">运行日志</el-menu-item>
          <el-menu-item index="/peronal">个人中心</el-menu-item>
        </el-menu>
      </el-header>
      <el-main style="background-color: black; padding: 0; border: 1px solid #000; border-top: none; height: calc(100% - 61px); box-sizing: border-box; overflow: hidden;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style> 

