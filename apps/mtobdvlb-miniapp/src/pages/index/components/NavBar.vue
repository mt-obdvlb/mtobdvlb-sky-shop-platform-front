<template>
  <div :style="`top: ${top}px`" class="nav-bar">
    <up-image src="https://mtobdvlb-web.oss-cn-beijing.aliyuncs.com/private/mto_handwritten_vector_black.png" mode="scaleToFill" width="100%" height="100%"/>
  </div>
</template>

<script lang="ts" setup>
const systemInfo = uni.getSystemInfoSync()
const top = systemInfo.safeArea?.top

</script>

<style lang="scss" scoped>
.nav-bar {
  height: 350rpx;
}
</style>
