<template>
  <up-navbar bg-color="#EEC65C" />
  <view class="my">
    <view class="user-info">
      <up-avatar />
      <up-text text="微信用户"></up-text>
    </view>
    <up-cell-group class="cell-group">
      <up-cell url="/pages/address/address" is-link icon="map-fill" title="地址管理" class="cell-button">

      </up-cell>
      <up-cell url="/pages/order/order" is-link icon="file-text-fill" title="历史订单" class="cell-button">

      </up-cell>
    </up-cell-group>
    <up-text text="最近订单" block bold margin="20rpx" />
    <scroll-view @scrolltolower="handleScrolltolower"  class="scroll-view" scroll-y>
      <OrderItem v-for="(item, index) in list" :key="index" :order="item" />
      <up-loadmore :status="status" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { loginUser } from '@/api/user'
import { getHistoryOrders } from '@/api/order'
import type { OrderPageRequest, OrderPageResponse } from '@/types/order'
import { ref } from 'vue'
import OrderItem from '@/components/OrderItem.vue'

const userStore = useUserStore()

const searchParams = ref<OrderPageRequest>({
  page: 1,
  pageSize: 10,

})

const getData = async () => {
  if (status.value === 'nomore') {
      return
    }
  const res = await getHistoryOrders(searchParams.value)
  
  list.value.push(...res.data.records)
  if (res.data.total === list.value.length) {
      status.value = 'nomore'
    }
}

const handleScrolltolower = async () => {
  searchParams.value.page++
  await getData()
}

const list = ref<OrderPageResponse[]>([])
const status = ref<'loadmore' | 'loading' | 'nomore'>('loading')

onShow(async () => {
      const token = userStore.userInfo?.token
    if (!token) {
      const res = await uni.login()
      const data = await loginUser({ code: res.code })
      userStore.setUserInfo(data.data)
    }
    getData()

})



</script>

<style scoped lang="scss"> 
.my {
  display: flex;
  flex-direction: column;
  height: 100%;
  .user-info {
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100rpx;
    gap: 10rpx;
    padding: 20rpx;
    background-color: #EEC65C;
    padding-top:  200rpx;
  }
  .cell-group {
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  .cell-button {
    width: 100%;
    height: 100rpx;

  }
  .scroll-view {
    flex: 1;
    padding: 20rpx;
    background-color: #F5F5F5;
    box-sizing: border-box;
  }
}
</style> 