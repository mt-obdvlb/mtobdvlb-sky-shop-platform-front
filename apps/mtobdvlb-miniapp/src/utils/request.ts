import Request from 'luch-request'
import { useUserStore } from '@/store'

const baseURL = 'http://localhost:80/user'

const request = new Request({
  baseURL,
  timeout: 10000
})

request.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.userInfo?.token || uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      authentication: token
    }
  }

  return config
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 1) {
      return res
    } else {
      void uni.showToast({
        title: res.msg,
        icon: 'error'
      })
      return Promise.reject(res)
    }
  },
  err => {
    void uni.showToast({
      title: `网络错误${err.statusCode}`,
      icon: 'error'
    })
    const userStore = useUserStore()
    if (err.statusCode === 401) {
      userStore.clearUserInfo()
      void uni.reLaunch({ url: '/pages/my/my' })
    }
    return Promise.reject(err)
  }
)

export default request
