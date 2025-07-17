import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo>()

    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
    }

    const clearUserInfo = () => {
      userInfo.value = undefined
    }

    return {
      userInfo,
      setUserInfo,
      clearUserInfo
    }
  },
  {
    persist: {
      storage: {
        getItem: key => {
          return uni.getStorageSync(key)
        },
        setItem: (key, value) => {
          uni.setStorageSync(key, value)
        }
      }
    }
  }
)
