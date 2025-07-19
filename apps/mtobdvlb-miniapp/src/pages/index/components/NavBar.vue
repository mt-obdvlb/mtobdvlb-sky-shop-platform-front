<template>
  <div :style="`top: ${top}px`" class="nav-bar">
    <up-image src="https://mtobdvlb-web.oss-cn-beijing.aliyuncs.com/private/mto_handwritten_vector_black.png" mode="scaleToFill" width="100%" height="100%"/>
    <navigator class="my" url="/pages/my/my"  ><up-icon name="home-fill"  ></up-icon></navigator>
  </div>
</template>

<script lang="ts" setup>
const systemInfo = uni.getSystemInfoSync()
const top = systemInfo.safeArea?.top

</script>

<style lang="scss" scoped>
.nav-bar {
  height: 350rpx;
  position: relative;
  .my {
    position: absolute;
    left: 10rpx;
    top: 0;
    width: 30rpx;
    height: 30rpx;
    border: #E5E5E5 solid 2px;
    border-radius: 50%;
    background-color: #fff;
      display: flex;
  justify-content: center;
  align-items: center;
      padding: 20rpx;
  }
}
</style>
