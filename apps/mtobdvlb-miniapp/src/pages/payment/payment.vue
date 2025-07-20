<template>
  <view class="payment">
    <view class="header">
      <up-cell-group>
        <up-cell
          :label="`${address?.consignee} ${address?.phone} `"
          :title="`${address?.provinceName} ${address?.cityName} ${address?.districtName} ${address?.detail}`"
          is-link
          url="/pages/address/address"
        ></up-cell>
        <up-cell
          :label="`预计${paymentParams?.estimatedDeliveryTime}送达`"
          :title="'立即送出'"
        ></up-cell>
      </up-cell-group>
    </view>
    <view class="content">
      <up-text text="MTO餐厅"></up-text>
      <up-divider />
      <up-cell-group :border="false">
        <up-cell
          v-for="item in list"
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
      </up-cell-group>
      <up-divider />
      <up-text :text="`合计 ¥${amount}`" align="right" bold size="24"></up-text>
    </view>
  </view>
  <Cart :paymentParams="paymentParams" />
</template>

<script lang="ts" setup>
  import { getAddressDefault } from '@/api/address'
  import { getCartList } from '@/api/cart'
  import type { AddressBook } from '@/types/address'
  import type { ShoppingCartListResponse } from '@/types/cart'
  import type { OrderSubmitRequest } from '@/types/order'
  import { onShow } from '@dcloudio/uni-app'
  import { computed, ref } from 'vue'
  import dayjs from 'dayjs'
  import Cart from '@/components/Cart.vue'

  const address = ref<AddressBook>()
  const list = ref<ShoppingCartListResponse>([])

  const getData = async () => {
    const res = await getAddressDefault()
    address.value = res.data
    const res1 = await getCartList()
    list.value = res1.data
    paymentParams.value.amount = amount.value
    paymentParams.value.addressBookId = address.value.id ?? 0
  }

  onShow(() => {
    getData()
  })

  const amount = computed(() => {
    return list.value.reduce((total, item) => {
      return total + item.amount * item.number
    }, 6)
  })

  const paymentParams = ref<OrderSubmitRequest>({
    addressBookId: 0,
    remark: '',
    payMethod: 1,
    tablewareNumber: 0,
    tablewareStatus: 0,
    estimatedDeliveryTime: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    packAmount: 2,
    amount: amount.value ?? 2,
    deliveryStatus: 1
  })
</script>

<style lang="scss" scoped>
  .payment {
    background-color: #efeff4;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px 20px 100rpx;

    .header,
    .content {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .content {
      margin-top: 20rpx;
      margin-bottom: 100rpx;
      padding: 20rpx;
    }
  }
</style>
