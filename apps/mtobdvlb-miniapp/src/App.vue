<script lang="ts" setup>
  import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
  import { useUserStore } from '@/store/modules/user'
  import { loginUser } from '@/api/user'

  const userStore = useUserStore()

  onLaunch(async () => {
    const token = userStore.userInfo?.token
    if (!token) {
      const res = await uni.login()
      const data = await loginUser({ code: res.code })
      userStore.setUserInfo(data.data)
    }
  })
  onShow(() => {
    console.log('App Show')
  })
  onHide(() => {
    console.log('App Hide')
  })
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
page{
  height: 100vh;
}
</style>
