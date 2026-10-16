import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    if (useUserStore().token) {
      config.headers.Authorization = useUserStore().token //携带token
    }
    return config
  },
  err => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res
    }
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  err => {
    // 错误的特殊情况 => 401 权限不足或token过期 => 拦截到登录
    if (err.response?.status === 401) {
      ElMessage.error(err.response?.data?.message || '登录过期，请重新登录')
      router.push('/login')
    }

    // 错误的默认情况
    ElMessage.error(err.response?.data?.message || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
export const get = (url, params) => instance.get(url, { params })
export const post = (url, data) => instance.post(url, data)
