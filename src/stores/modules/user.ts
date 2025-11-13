import type { UserInfo } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 User Store
export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref<UserInfo>()

    // 保存用户信息
    const setUserInfo = (val: UserInfo) => {
      userInfo.value = val
    }

    // 清理用户信息
    const clearUserInfo = () => {
      userInfo.value = undefined
    }

    // 记得 return
    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
