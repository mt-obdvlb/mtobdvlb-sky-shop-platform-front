<template>
  <view @click="handleDetail" class="order-item">
    <view class="order-item__header">
      <up-text :text="order.orderTime"  bold />
      <up-text color="#E7BB8C" align="right" :text="orderMap[order.status]"   />
    </view>
    <view class="order-item__details">
      <up-text align="right" bold  :text="`¥${order.amount.toFixed(2)}`" />
      <up-text align="right" type="info" :text="`共${order.orderDetailList.length}件`" />
    </view>
    <up-text :lines="1" :text="order.orderDetailList.map(item => item.name).join(' ')" type="info" />
    <view class="order-item__footer">
      <view class="order-button">
      <up-button   @click="handleClick" >再来一单</up-button>
      </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import type { OrderPageResponse } from '@/types/order'
import { repetitionOrder } from '../api/order';

const orderMap = {
  1: '待支付',
  2: '待接单',
  3: '已接单',
  4: '派送中',
  5: '已完成',
  6: '已取消',
  7: '已退款'
} as const 

const  props = defineProps<{
  order: OrderPageResponse
}>()

  const handleClick = async () => {
    await repetitionOrder(props.order.id)
    uni.navigateTo({ url: '/pages/index/index'})
  }

  const handleDetail = () => {
    
  }

</script>

<style scoped lang="scss">

.order-item {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  border-radius: 10rpx;
  box-sizing: border-box;
  gap: 10rpx;
  margin-bottom: 20rpx;
  .order-item__header {
    display: flex;
    justify-content: space-between;
    
  }

  .order-item__details {
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;
  }

  .order-item__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .order-button {
      width: 150rpx;
    }
  }

}

</style>