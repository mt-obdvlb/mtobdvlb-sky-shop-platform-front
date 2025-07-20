<template>
  <view class="address">
    <up-radio-group class="radio-group" v-model="defaultId">
    <AddressItem v-for="item in list" :key="item.id" :address="item"/>
    </up-radio-group>
    <button :getData="getData" @click="handleClick">+新增收货地址</button>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import AddressItem from './components/AddressItem.vue'
import { getAddressDefault, getAddressList } from '@/api/address'
import type { AddressBook } from '@/types/address'
import { ref } from 'vue'

const list = ref<AddressBook[]>([])
const defaultId = ref<number>()

onShow(async () => {
  await getData()
})

const handleClick = () => {
  uni.navigateTo({
    url: '/pages/address/addressAdd'
  })
}

const getData = async () => {
  const res = await getAddressList()
  list.value = res.data
  const res2 = await getAddressDefault()
  defaultId.value = res2.data.id
}

</script>

<style scoped lang="scss">
.address {
  background-color: #f5f5f5;
  box-sizing: border-box;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  height: 100vh;
  overflow-y: auto;
  position: relative;

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  button {
    position: fixed;
    bottom: 20rpx;
    height: 80rpx;
    background-color: #EEC65C;
    color: #000;
    border-radius: 10rpx;
    font-size: 32rpx;
    margin-bottom: 20rpx;
    width: calc(100% - 40rpx);
  }
}
</style>