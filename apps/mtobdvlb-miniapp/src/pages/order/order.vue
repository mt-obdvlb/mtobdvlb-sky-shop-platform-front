<template>
  <div class="order">
    <up-sticky bgColor="#fff">
    <up-tabs :list="list1" @click="handleClick"></up-tabs>
  </up-sticky>
    <scroll-view @scrolltolower="handlScrolltolower" class="scroll-view" scroll-y>
      <OrderItem v-for="item in list" :key="item.id" :order="item" />
      <up-loadmore :status="status" />
    </scroll-view>
  </div>
</template>

<script setup lang="ts">
import { getHistoryOrders } from '@/api/order'
import OrderItem from '@/components/OrderItem.vue'
import type { OrderPageRequest, OrderPageResponse, OrderStatus } from '@/types/order'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'


const searchParams = ref<OrderPageRequest>({
  page: 1,
  pageSize: 10,
  status: undefined
})

const status = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')
const list = ref<OrderPageResponse[]>([])
const list1 = ref([
  { name: '全部订单', value: undefined },
  { name: '待支付', value: 1 },
  { name: '已取消', value: 6 },
])

const handleClick = (item: { name: string; value: OrderStatus | undefined }) => {
  searchParams.value.status = item.value
  list.value = []
  searchParams.value.page = 1
  status.value = 'loadmore'
  getData()
}

const handlScrolltolower = async () => {
  if (status.value === 'nomore') {
    return
  }
  searchParams.value.page++
  await getData()
}

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

onShow(async () => {
  await getData()
})

</script>

<style scoped lang="scss">
.order {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #F5F5F5;
  .scroll-view {
    box-sizing: border-box;
    flex: 1;
    padding: 0 20rpx;
    background-color: #F5F5F5;
    overflow: auto;
  }
}
</style>