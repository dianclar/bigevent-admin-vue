<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { setUserInfo, getUserInfo, setUserAvatar } from '@/api/user'
import { Plus } from '@element-plus/icons-vue'

const {
  userInfo: { username, nickname, id, email },
} = useUserStore()

// 表单数据
const formData = reactive({
  username, // 示例默认值，实际可从 props 或 API 获取
  nickname,
  email,
  id,
})
// 表单引用
const formRef = ref(null)

// 加载状态
const loading = ref(false)

// 校验规则
const formRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '昵称长度必须为2-10位',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change'],
    },
  ],
}

// 提交处理
const handleSubmit = async () => {
  await formRef.value.validate()
  loading.value = true
  const res = await setUserInfo(formData)
  ElMessage.success(res.data.message)
  loading.value = false
  getUserInfo().then(res => {
    useUserStore().setUserInfo(res.data.data)
  })
}
// 头像预览
const imgUrl = ref(useUserStore().userInfo.user_pic)
const imgUpload = file => {
  // 基于filereader对象创建base64图片
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = e => {
    imgUrl.value = e.target.result
  }
}
// 上传头像
const uploadpic = async () => {
  const res = await setUserAvatar({ avatar: imgUrl.value })
  ElMessage.success(res.data.message)
  getUserInfo().then(res => {
    useUserStore().setUserInfo(res.data.data)
  })
}
</script>

<template>
  <mainPage title="基本资料"
    ><div class="user-profile-form">
      <el-upload
        :auto-upload="false"
        @change="imgUpload"
        :show-file-list="false"
        class="avatar-uploader"
      >
        <img
          :src="imgUrl"
          v-if="imgUrl"
          class="avatar"
        />
        <el-icon
          v-else
          class="avatar-uploader-icon"
        >
          <Plus />
          <div>设置头像</div>
        </el-icon>
      </el-upload>

      <p>
        <el-button
          type="primary"
          @click="uploadpic"
          >更新头像</el-button
        >
      </p>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        size="default"
      >
        <!-- 第一行：登录名称（禁用） -->
        <el-form-item
          label="登录名称"
          prop="username"
        >
          <el-input
            v-model="formData.username"
            disabled
            placeholder="登录名称不可修改"
          />
        </el-form-item>

        <!-- 第二行：用户昵称（必填，2-10位） -->
        <el-form-item
          label="用户昵称"
          prop="nickname"
        >
          <el-input
            v-model="formData.nickname"
            placeholder="请输入2-10位昵称"
            clearable
          />
        </el-form-item>

        <!-- 第三行：用户邮箱（必填，邮箱格式） -->
        <el-form-item
          label="用户邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            clearable
          />
        </el-form-item>

        <!-- 第四行：提交按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
          >
            修改资料
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </mainPage>
</template>

<style scoped>
/* 头像上传容器 */
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px; /* 可根据需求调整 */
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.avatar-uploader:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}
::v-deep .el-upload {
  width: 100%;
  height: 100%;
}

/* 已上传的头像 */
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：裁切并填充容器 */
  object-position: center; /* 关键：图片居中显示 */
}

/* 上传图标容器 */
.avatar-uploader-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
}

.avatar-uploader-icon div {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}
</style>
