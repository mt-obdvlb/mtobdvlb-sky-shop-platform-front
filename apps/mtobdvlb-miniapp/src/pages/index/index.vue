<template>
  <view>
    <scroll-view></scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { onShow } from '@dcloudio/uni-app'
  import { getCategoryList } from '@/api/category'
  import { watchEffect } from '@vue/runtime-core'
  import { ref } from 'vue'
  import type { CategoryListResponse } from '@/types/category'

  const categoryList1 = ref<CategoryListResponse>([])
  const categoryList2 = ref<CategoryListResponse>([])

  onShow(async () => {
    const res1 = await getCategoryList(1)
    const res2 = await getCategoryList(2)
    categoryList1.value = res1.data
    categoryList2.value = res2.data
  })

  const categoryList = watchEffect(() =>
    [...categoryList1.value, ...categoryList2.value].sort((a, b) => a.sort - b.sort)
  )
</script>

<style lang="scss" scoped></style>
