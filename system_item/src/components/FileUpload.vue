<template>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; margin: 0 auto;"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"  
      label-position="left"  
    >
      <el-form-item label="数据名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="采集区域-国家" prop="region">
        <el-input v-model="ruleForm.guo" />
      </el-form-item>
      <el-form-item label="采集区域-省" prop="count">
        <el-input v-model="ruleForm.sheng" />
      </el-form-item>
      <el-form-item label="采集区域-市" prop="count">
        <el-input v-model="ruleForm.shi" />
      </el-form-item>
     
      <el-form-item label="数据描述" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>
      
      <!-- 上传组件添加标签，与其他表单项对齐 -->
      <el-form-item label="上传文件">
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
              >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
              </div>
              <template #tip>
                  <div class="el-upload__tip">
                  请上传shp文件
                  </div>
              </template>
        </el-upload>
      </el-form-item>
      
      <el-form-item class="btn-group">
        <el-button type="primary">
          确认添加数据
        </el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  
  import type { FormInstance, FormRules } from 'element-plus'
  import { UploadFilled } from '@element-plus/icons-vue'
  
  interface RuleForm {
    name: string
    region: string
    count: string
    guo: string
    sheng: string
    shi: string
    date1: string
    date2: string
    delivery: boolean
    location: string
    type: string[]
    resource: string
    desc: string
  }
  
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    name: 'Hello',
    guo: '中国',
    sheng: '湖北',
    shi: '武汉',
    region: '',
    count: '',
    
    date1: '',
    date2: '',
    delivery: false,
    location: '',
    type: [],
    resource: '',
    desc: '',
  })
  

  const rules = reactive<FormRules<RuleForm>>({
    name: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    region: [
      {
        required: true,
        message: 'Please select Activity zone',
        trigger: 'change',
      },
    ],
    count: [
      {
        required: true,
        message: 'Please select Activity count',
        trigger: 'change',
      },
    ],
    date1: [
      {
        type: 'date',
        required: true,
        message: 'Please pick a date',
        trigger: 'change',
      },
    ],
    date2: [
      {
        type: 'date',
        required: true,
        message: 'Please pick a time',
        trigger: 'change',
      },
    ],
    location: [
      {
        required: true,
        message: 'Please select a location',
        trigger: 'change',
      },
    ],
    type: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    resource: [
      {
        required: true,
        message: 'Please select activity resource',
        trigger: 'change',
      },
    ],
    desc: [
      { required: false, message: 'Please input activity form', trigger: 'blur' },
    ],
  })
  </script>
  

<script setup>

</script>


<style scoped>
/* 统一输入框宽度，确保对齐 */
.el-form-item__content .el-input,
.el-form-item__content .el-textarea {
  width: 100%;
  max-width: 400px; /* 与600px表单宽度适配 */
}

/* 按钮组居中样式 */
.btn-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 优化上传组件与标签的对齐 */
.upload-demo {
  margin-top: 5px; /* 微调上传区域位置，与输入框对齐 */
}
</style>
