<script setup>
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getDocumentInfo } from '@/api/document'
import { baseURL } from '@/utils/request'
import { imgUrlToFile } from '@/utils/imgurltofile'

defineProps({
  title: {
    type: String,
    required: false,
  },
})

// 表单数据
const formData = ref({
  title: '',
  care_id: '',
  cover_img: '',
  content: '',
  state: '',
  id: null,
})

// 图片预览
const imgUrl = ref()
const imgUpload = file => {
  imgUrl.value = URL.createObjectURL(file.raw)
  formData.value.cover_img = file.raw
}

// 提交表单
const emit = defineEmits(['commit'])
const submitForm = state => {
  formData.value.state = state
  emit('commit', formData.value)
  show.value = false
}

// 打开抽屉
const propsData = ref()
const show = ref(false)
const contentRef = ref()
const open = async data => {
  propsData.value = data
  if (data.id) {
    getDocumentInfo({ id: data.id }).then(async d => {
      formData.value = d.data.data
      imgUrl.value = baseURL + d.data.data.cover_img
      formData.value.cover_img = await imgUrlToFile(imgUrl.value)
    })
  } else {
    formData.value = {
      title: '',
      care_id: '',
      cover_img: '',
      content: '',
      state: '',
      id: null,
    }
    imgUrl.value = null
    contentRef.value.setHTML('')
  }
  show.value = true
}

defineExpose({
  open,
})
</script>

<template>
  <el-drawer
    v-model="show"
    :title="title"
    direction="ltr"
    size="auto"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formData"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item
        label="文章标题"
        prop="title"
      >
        <el-input
          v-model="formData.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="文章分类"
        prop="cate_id"
      >
        <el-select v-model="formData.cate_id">
          <el-option
            :label="i.cate_name"
            :value="i.id"
            v-for="i in propsData.classList"
            :key="i.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="文章封面"
        prop="cover_img"
      >
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
            ><Plus
          /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item
        label="文章内容"
        prop="content"
      >
        <div class="editor">
          <quill-editor
            theme="snow"
            content-type="html"
            v-model:content="formData.content"
            ref="contentRef"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="submitForm('已发布')"
          type="primary"
          >发布</el-button
        >
        <el-button
          @click="submitForm('草稿')"
          type="info"
          >草稿</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
