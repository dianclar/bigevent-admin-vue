<script setup>
import { ref } from 'vue'
import { registerUser, loginUser } from '@/api/user.js'
import { useUserStore } from '@/stores'
import router from '@/router'
import { User, Lock } from '@element-plus/icons-vue'

// 是否注册状态
const isRegister = ref(false)

// 表单数据对象
const loginForm = ref({
  username: '',
  password: '',
  repassword: '',
})
// 自定义确认密码规则
const repasswordrules = (rule, value, callback) => {
  if (value !== loginForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
// 表单规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
      message: '用户名不能包含符号',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: repasswordrules,
      trigger: 'blur',
    },
  ],
})

// 表单ref
const form = ref()
// 注册
const register = async () => {
  await form.value.validate()
  const res = await registerUser(loginForm.value)
  ElMessage.success(res.data.message)
  isRegister.value = false
}
// 登录
const login = async () => {
  await form.value.validate()
  const { username, password } = loginForm.value
  const res = await loginUser({ username, password })
  ElMessage.success(res.data.message)
  useUserStore().setToken(res.data.token)
  router.push('/home')
}

// 忘记密码
const resetPassword = () => ElMessage.info('要不重新注册一个账号？')
</script>

<template>
  <el-row class="login-page">
    <el-col
      :span="12"
      class="bg"
      ><div></div
    ></el-col>
    <el-col
      :span="8"
      :offset="2"
      class="col"
    >
      <!-- form->moudel表单数据对象
      form->rules表单规则
      item->v-model表单项数据
      item->prop表单项匹配规则 -->
      <div class="form">
        <!-- 注册 -->
        <el-form
          ref="form"
          size="large"
          autocomplete="off"
          v-if="isRegister"
          :model="loginForm"
          :rules="rules"
        >
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              v-model="loginForm.repassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入再次密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="register"
            >
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link
              type="info"
              :underline="false"
              @click="isRegister = false"
            >
              返回登陆
            </el-link>
          </el-form-item>
        </el-form>

        <!-- 登陆 -->
        <el-form
          ref="form"
          size="large"
          autocomplete="off"
          :model="loginForm"
          :rules="rules"
          v-else
        >
          <el-form-item>
            <h1>欢迎登录</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              placeholder="请输入用户名"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox
                :checked="true"
                disabled
                >记住我</el-checkbox
              >
              <el-link
                type="primary"
                :underline="false"
                @click="resetPassword"
                >忘记密码？</el-link
              >
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="login"
            >
              登录</el-button
            >
          </el-form-item>
          <el-form-item class="flex">
            <el-link
              type="info"
              :underline="false"
              @click="isRegister = true"
            >
              前往注册
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #f0f0f0;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    div {
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(240, 240, 240, 0) 50%,
        rgba(240, 240, 240, 0.5) 75%,
        rgba(240, 240, 240, 1) 100%
      );
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .form {
      padding: 0 40px;
      background: #fff;
      border-radius: 15px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
