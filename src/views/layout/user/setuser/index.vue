<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { setUserPass } from '@/api/user'

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: '',
})

// 表单引用
const pwdFormRef = ref()

// 提交 loading 状态
const loading = ref(false)

// 校验规则：6-15位非空
const validateLength = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度必须为6-15位'))
  } else {
    callback()
  }
}

// 自定义校验1：原密码和新密码不能一样
const validateNotSame = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

// 自定义校验2：新密码和确认密码必须一样
const validateConfirm = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = {
  old_pwd: [{ validator: validateLength, trigger: 'blur' }],
  new_pwd: [
    { validator: validateLength, trigger: 'blur' },
    { validator: validateNotSame, trigger: 'blur' },
  ],
  re_pwd: [
    { validator: validateLength, trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

// 提交表单
const handleSubmit = async () => {
  // 1. 触发表单校验
  await pwdFormRef.value.validate()

  // 2. 设置 loading，防止重复提交
  loading.value = true

  // 3. 调用 API 修改密码
  const res = await setUserPass(pwdForm.value)
  ElMessage.success(res.data.message)
  loading.value = false
  handleReset()
}

// 重置表单
const handleReset = () => {
  pwdFormRef.value.resetFields()
}
</script>

<template>
  <mainPage title="用户设置">
    <el-breadcrumb
      separator=">"
      style="margin-bottom: 20px"
    >
      <el-breadcrumb-item>用户设置</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      ref="pwdFormRef"
      :model="pwdForm"
      :rules="rules"
      label-width="80px"
      size="large"
    >
      <!-- 原密码 -->
      <el-form-item
        label="原密码"
        prop="old_pwd"
      >
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          show-password
          placeholder="请输入原密码"
        />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item
        label="新密码"
        prop="new_pwd"
      >
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item
        label="确认密码"
        prop="re_pwd"
      >
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          show-password
          placeholder="请再次输入新密码"
        />
      </el-form-item>

      <!-- 按钮行 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          >修改密码</el-button
        >
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </mainPage>
</template>
