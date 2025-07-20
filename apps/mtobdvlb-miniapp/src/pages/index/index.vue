<template>
  <view class="page">

  <NavBar />
  <view class="body">
    <up-cate-tab class="cate-tab" :tabList="categoryWithDishSetmealList" tabKeyName="name" itemKeyName="name" >
      <template #pageItem="{ pageItem}">
        <view  class=" page-item"  >
                    <up-cell-group  :border='false'>
                        <up-cell :custom-style="{position: 'relative'}" center clickable @click="() => handleClick(pageItem)" :border='false'>
                            <template #icon>
                                <up-image :src="pageItem.image" width="100px" height="100px"></up-image>
                            </template>
                            <template v-slot:title>
                                <up-text :text="pageItem.name" bold >
                                </up-text>
                            </template>
                            <template v-slot:label>
                                <view >
                                  <up-text :lines="2" type="info" :text="pageItem.description"></up-text>
                                    <up-text type="error" :text="`￥${ pageItem.price }`" ></up-text>
                                </view>
                              
                            </template>
                          </up-cell>
                        </up-cell-group>
                        <up-button @click="() => handleAddShopCart(pageItem)" class="add-button" shape="circle"    >+</up-button>
                      </view>
      </template>
    </up-cate-tab>

  </view>

</view>
    <up-popup mode="center" round="10" v-model:show="show">
      <up-cell-group center  :border='false'>
        <up-cell :border='false' center>
         <template #icon>
              <up-image :src="currentItem?.image" width="100px" height="100px"></up-image>
          </template>
          <template v-slot:title>
              <up-text :text="currentItem?.name" bold >
              </up-text>
          </template>
          <template v-slot:label>
              <view >
                <up-text :lines="2" type="info" :text="currentItem?.description"></up-text>
                  <up-text type="error" :text="`￥${ currentItem?.price }`" ></up-text>
              </view>
            
            </template>
          </up-cell>
          </up-cell-group>
          <up-button @click="handleAddShopCart" color="#F6C443"     >加入购物车</up-button>
		</up-popup>
    <Cart ref="cartRef" />
</template>

<script lang="ts" setup>
  import { onShow } from '@dcloudio/uni-app'
  import { getCategoryList } from '@/api/category'
  import { computed } from 'vue'
  import { ref } from 'vue'
  import type { CategoryListResponse } from '@/types/category'
import NavBar from './components/NavBar.vue'
import Cart from '@/components/Cart.vue'
import { getDishList } from '@/api/dish'
import { getSetmealList } from '@/api/setmeal'
import type { Setmeal } from '@/types/setmeal'
import type { Dish } from '@/types/dish'
import { addCart } from '@/api/cart'

  
  const categoryList1 = ref<CategoryListResponse>([])
  const categoryList2 = ref<CategoryListResponse>([])
const show = ref(false)
const currentItem = ref<Dish | Setmeal | null>(null)
  const cartRef = ref()


  onShow(async () => {
    const res1 = await getCategoryList(1)
    const res2 = await getCategoryList(2)
    for(const item of res1.data) {
      const res3 = await getDishList(item.id)
      item.children = res3.data
      item.children.forEach((dish: Dish) => {
        dish.type = 'dish' // 标记为菜品
      })
    }
    for (const item of res2.data) {
      const res4 = await getSetmealList(item.id)
      item.children = res4.data
      item.children.forEach((setmeal: Setmeal) => {
        setmeal.type = 'setmeal' // 标记为套餐
      })
    }
    categoryList1.value = res1.data
    categoryList2.value = res2.data
    console.log(categoryList1.value);
    console.log(categoryList2.value)
    
  })

  const categoryWithDishSetmealList = computed(() =>
    [...categoryList1.value, ...categoryList2.value].sort((a, b) => a.sort - b.sort)
  )

  const handleClick = (pageItem: Dish | Setmeal) => {
    show.value = true
    currentItem.value = pageItem
  }

  

const handleAddShopCart = async (pageItem: Dish | Setmeal) => {

  const isDish = pageItem.type === 'dish'

  await addCart({
    dishId: isDish ? pageItem.id : undefined,
    setmealId: isDish ? undefined : pageItem.id,
    dishFlavor: isDish && (pageItem as Dish ).dishFlavors ? (pageItem as Dish)?.dishFlavors.map(item => item.name).join(',') : undefined,
  })
    cartRef.value?.getCartData()
    
  }
  
</script>

<style lang="scss" scoped>
  .page {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .body{
  overflow: auto;  
}

.page-item {
  position: relative;
  flex: 1;
  min-width: 500rpx;
}


.add-button {
  position: absolute !important;
  right: 10rpx;
  bottom: 10rpx;
  width: 30px !important;
  height: 30px !important;
  border-radius: 100% !important;
  background-color: #F6C443 !important;
}


</style>