<template>
  <view  class="cart">
    <view @click="handleClick" class="badge">
      
      <up-badge absolute :show="length > 0" :offset="['-10', '-10']"  :value="length" >
      </up-badge>
      <text v-show="length > 0" >${{ amount }}</text>
    </view>

    <button @click="handlePayment" class="btn" >去结算</button>
  </view>
  <up-popup round="10" z-index="100" v-model:show="show" mode="bottom" >
    <view class="popup">
      <view class="header">


          <up-text  size="large" block text="购物车" bold />

          <up-icon   name="trash-fill" label="清空" @click="handleCleanUp" />
      </view>
      <up-divider />
      <scroll-view scroll-y>
        <up-cell-group center :border="false">
          <up-cell v-for="item in list" :key="item.id" :custom-style="{position: 'relative'}" center clickable>
            <template #icon>
              <up-image :src="item.image" width="100px" height="100px"></up-image>
            </template>
            <template v-slot:title>
              <up-text :text="item.name" bold></up-text>
            </template>
            <template v-slot:label>
              <view>
                <up-text type="error" :text="`￥${ item.amount }`"></up-text>
              </view>
            </template>
            <template #value>
              <up-number-box v-model="item.number" :min="1" :disableMinus="item.number === 1"  @change="(value) => updateCart(value , item)" />
            </template>
          </up-cell>
        </up-cell-group>

      </scroll-view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { addCart, cleanCart, getCartList, subCart } from '@/api/cart'
import type { ShoppingCart, ShoppingCartListResponse } from '@/types/cart'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const list = ref<ShoppingCartListResponse>([])
const show = ref(false)

const getCartData = async () => {
  const res = await getCartList()
  list.value = res.data
}

onShow(() => {
  getCartData()
})

defineExpose({
  getCartData
})

const amount =  computed(() => list.value.reduce((total, item) => {
  return total + item.amount * item.number
}, 0)) 

const length = computed(() => list.value.reduce((total, item) => {
  return total + item.number
}, 0))

const handlePayment = () => {
  uni.navigateTo({
    url: '/pages/payment/payment'
  })
}

const handleClick = () => {
  if(length.value === 0) return
  show.value = !show.value
}

const handleCleanUp = async () => {
  await cleanCart()
  show.value = false
  getCartData()
}

const updateCart = async (value: {
  value: number,
  type: "plus" | "minus"
}, item: ShoppingCart) => {
  if (value.type === 'plus') {
    await addCart({
      dishId:  item.dishId,
      setmealId: item.setmealId,
      dishFlavor: item.dishFlavor,

    })
  } else {
    await subCart({
      dishId:  item.dishId,
      setmealId: item.setmealId,
      dishFlavor: item.dishFlavor,
    })
  }
  getCartData()
  
}

</script>

<style scoped lang="scss">
.cart {
  bottom: 30rpx;
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  background-color: #191919;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 1000;
  border-radius: 50rpx;
  color: #fff;

  .btn {
    background-color: #EEC65C;
    border-radius: 50rpx;
    margin: 0;
  }

  .badge {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }



  
}

  .popup {
    padding: 20rpx 10rpx;
    height: 800rpx;
    display: flex;
    gap: 20rpx;
    flex-direction: column;
    overflow: auto;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }
  }

</style> 