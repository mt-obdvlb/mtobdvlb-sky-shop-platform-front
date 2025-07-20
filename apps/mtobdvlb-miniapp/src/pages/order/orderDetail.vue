<template>
  <view class="orderDetail">
    <view class="item header">
      <up-text
        :text="orderStatusMap[orderDetailData?.status ?? 1]"
        align="center"
        bold
        size="26px "
      />
      <view class="btns">
        <button
          v-show="
            orderDetailData &&
            (
              [
                OrderStatus.PENDING_PAYMENT,
                OrderStatus.TO_BE_CONFIRMED,
                OrderStatus.CONFIRMED,
                OrderStatus.DELIVERY_IN_PROGRESS
              ] as OrderStatus[]
            ).includes(orderDetailData.status)
          "
          class="info-btn"
          @click="handelCancel"
        >
          取消订单
        </button>
        <button
          v-show="orderDetailData?.status === OrderStatus.PENDING_PAYMENT"
          class="primary-btn"
          @click="handlePayment"
        >
          支付订单
        </button>
        <button
          v-show="
            orderDetailData &&
            ([OrderStatus.TO_BE_CONFIRMED, OrderStatus.CONFIRMED] as OrderStatus[]).includes(
              orderDetailData.status
            )
          "
          class="primary-btn"
          @click="handleReminder"
        >
          催单
        </button>
        <button
          v-show="
            orderDetailData &&
            ([OrderStatus.COMPLETED, OrderStatus.CANCELLED] as OrderStatus[]).includes(
              orderDetailData?.status
            )
          "
          class="info-btn"
          @click="handleRepetition"
        >
          再来一单
        </button>
      </view>
    </view>
    <view v-if="orderDetailData?.status === OrderStatus.PENDING_PAYMENT" class="item">
      <up-text prefixIcon="volume-fill" text="请在15分钟内完成支付,超时将自动取消。" type="info" />
    </view>
    <view class="item">
      <up-text bold size="26 " text="MTO餐厅" />
      <up-divider />
      <up-cell-group :border="false">
        <up-cell
          v-for="item in orderDetailData?.orderDetailList"
          :key="item.id"
          :border="false"
          :label="`x ${item.number}`"
          :title="item.name"
          :value="`¥${item.amount}`"
          size="large"
        >
          <template #icon>
            <up-image :src="item.image" height="100px" width="100px"></up-image>
          </template>
        </up-cell>
        <up-cell title="打包费" value="¥2" />
        <up-cell title="配送费" value="¥6" />
        <up-cell :value="`¥${orderDetailData?.amount}`" title="合计" />
      </up-cell-group>
    </view>
    <view class="item">
      <up-cell-group :border="false">
        <up-cell :value="orderDetailData?.number" title="订单号" />
        <up-cell :value="`${orderDetailData?.address}`" title="配送地址" />
      </up-cell-group>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import {
    cancelOrder,
    getOrderDetail,
    payOrder,
    reminderOrder,
    repetitionOrder
  } from '@/api/order'
  import { type OrderGetByIdResponse, OrderStatus } from '@/types/order'

  const orderStatusMap = {
    [OrderStatus.PENDING_PAYMENT]: '等待付款',
    [OrderStatus.TO_BE_CONFIRMED]: '等待商家接单',
    [OrderStatus.CONFIRMED]: '商家已接单',
    [OrderStatus.DELIVERY_IN_PROGRESS]: '订单派送中',
    [OrderStatus.COMPLETED]: '订单已完成',
    [OrderStatus.CANCELLED]: '订单已取消'
  }

  const id = ref<number>()
  const orderDetailData = ref<OrderGetByIdResponse>()

  const getData = async () => {
    const res = await getOrderDetail(id.value!)
    orderDetailData.value = res.data
  }

  onLoad(options => {
    id.value = options?.id
    getData()
  })

  const handelCancel = async () => {
    await cancelOrder(id.value!)
    uni.showToast({
      title: '取消成功',
      icon: 'success'
    })
    getData()
  }

  const handlePayment = async () => {
    await payOrder({
      orderNumber: orderDetailData?.value?.number ?? '',
      payMethod: 1
    })
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    })
    getData()
  }

  const handleRepetition = async () => {
    await repetitionOrder(id.value!)
    uni.navigateTo({ url: '/pages/index/index' })
  }

  const handleReminder = async () => {
    await reminderOrder(id.value!)
    uni.showToast({
      title: '已提醒商家'
    })
  }
</script>

<style lang="scss" scoped>
  .orderDetail {
    background-color: #efeff4;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .item {
      background-color: #fff;
      padding: 20rpx;
      border-radius: 20rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 20rpx;
    }

    .btns {
      display: flex;
      gap: 20rpx;

      button {
        border: #fff solid 1px;
        border-radius: 20rpx;
        width: 250rpx;
        height: 100rpx;
        padding: 10rpx 20rpx;
        font-size: 16px;
        box-sizing: border-box;
      }

      .info-btn {
        color: #000000;
      }

      .primary-btn {
        background-color: #eec65c;
      }
    }
  }
</style>
