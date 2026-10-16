import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // token 信息
    const token = ref('')
    // 设置 token
    function setToken(newToken) {
      token.value = newToken
      return this
    }
    // 用户信息
    const userInfo = ref({})
    // 设置用户信息
    function setUserInfo(data) {
      userInfo.value = data || {}
      return this
    }

    return { token, setToken, userInfo, setUserInfo }
  },
  {
    //持久化存储
    persist: true,
  },
)
