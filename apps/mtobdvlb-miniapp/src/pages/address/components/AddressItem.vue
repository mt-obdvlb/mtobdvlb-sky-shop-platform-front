<template>
  <view class="address-item">
    <up-cell-group :border="false" >
      <up-cell :url="`/pages/address/addressAdd?id=${address.id}`" rightIcon="edit-pen"  is-link :border="false" >
        <template #title>
          <up-text :text="`${address.provinceName} ${address.cityName} ${address.districtName} ${address.detail}`"  />
        </template>
        <template #label>
          <up-text :text="`${address.consignee} ${address.sex ? '先生' : '女士'} ${address.phone} `" type="info" />
        </template>
      </up-cell>
    </up-cell-group>
    <up-divider/> 
    <up-radio :name="address.id"  active-color="#EEC65C" label="默认地址"  @change="handleChange"/>
  </view>
</template>

<script setup lang="ts">
import { updateAddressDefault } from '@/api/address'
import type { AddressBook } from '@/types/address'


const props = defineProps<{
  address: AddressBook,
  getData?: () => Promise<void>
}>()



const handleChange = async () => {
  await updateAddressDefault(props.address!)
  await props.getData?.()  
}

</script>

<style scoped lang="scss">

.address-item {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

</style>