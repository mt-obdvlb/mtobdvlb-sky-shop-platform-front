<script lang="ts" setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { addAddress, getAddressById, updateAddress } from '@/api/address'
  import type { AddressBook } from '@/types/address'
  import { useUserStore } from '@/store'

  const userStore = useUserStore()

  // 表单数据
  const formRef = ref()
  const form = ref<AddressBook>({
    phone: '', // 联系方式
    provinceCode: '', // 省份编码(后端参数)
    cityCode: '', // 城市编码(后端参数)
    districtCode: '', // 省份编码(后端参数)
    isDefault: 0, // 默认地址，1为是，0为否
    userId: userStore.userInfo?.id ?? 0,
    districtName: '',
    cityName: '',
    provinceName: '',
    consignee: '',
    sex: '1',
    detail: '',
    label: ''
  })

  const query = defineProps<{
    id?: string
  }>()
  uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '添加地址' })

  const fullLocation = ref<string>('')

  const onRegionChange = (e: { detail: { value: string[]; code: string[] } }) => {
    fullLocation.value = e.detail.value.join(' ')
    console.log(e)

    const [provinceCode, cityCode, districtCode] = e.detail.code!
    const [provinceName, cityName, districtName] = e.detail.value!

    Object.assign(form.value, {
      provinceCode,
      cityCode,
      districtCode,
      provinceName,
      cityName,
      districtName
    })
  }

  const getMemberAddressByIdData = async () => {
    if (query.id) {
      const res = await getAddressById(+query.id)
      Object.assign(form.value, res.data)
      fullLocation.value = `${res.data.provinceName} ${res.data.cityName} ${res.data.districtName}`
    }
  }

  onLoad(() => {
    getMemberAddressByIdData()
  })

  const onSubmit = async () => {
    try {
      formRef.value?.validate?.()
      if (query.id) {
        await updateAddress(+query.id, form.value)
      } else {
        await addAddress(form.value)
      }
      await uni.showToast({
        title: query.id ? '修改成功' : '添加成功',
        icon: 'success'
      })
      uni.navigateBack()
    } catch (err) {
      console.log(err)

      uni.showToast({
        title: '请填写完整信息',
        icon: 'error'
      })
    }
  }
</script>

<template>
  <view class="content">
    <uni-forms ref="formRef" :model="form">
      <!-- 表单内容 -->
      <uni-forms-item class="form-item" name="consignee">
        <text class="label">收货人</text>
        <input v-model="form.consignee" class="input" placeholder="请填写收货人姓名" />
      </uni-forms-item>
      <uni-forms-item class="form-item" name="phone">
        <text class="label">手机号码</text>
        <input v-model="form.phone" class="input" placeholder="请填写收货人手机号码" />
      </uni-forms-item>
      <uni-forms-item class="form-item" name="fullLocation">
        <text class="label">所在地区</text>
        <picker class="picker" mode="region" value="" @change="onRegionChange">
          <view v-if="fullLocation">
            {{ fullLocation }}
          </view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item class="form-item" name="detail">
        <text class="label">详细地址</text>
        <input v-model="form.detail" class="input" placeholder="街道、楼牌号等信息" />
      </uni-forms-item>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<style lang="scss" scoped>
  .content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;

    .form-item,
    .uni-forms-item {
      display: flex;
      align-items: center;
      min-height: 96rpx;
      padding: 25rpx 10rpx 40rpx;
      background-color: #fff;
      font-size: 28rpx;
      border-bottom: 1rpx solid #ddd;
      position: relative;
      margin-bottom: 0;

      // 调整 uni-forms 样式
      .uni-forms-item__content {
        display: flex;
      }

      .uni-forms-item__error {
        margin-left: 200rpx;
      }

      &:last-child {
        border: none;
      }

      .label {
        width: 200rpx;
        color: #333;
      }

      .input {
        flex: 1;
        display: block;
        height: 46rpx;
      }

      .switch {
        position: absolute;
        right: -20rpx;
        transform: scale(0.8);
      }

      .picker {
        flex: 1;
      }

      .placeholder {
        color: #808080;
      }
    }
  }

  .button {
    height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #eec65c;
  }
</style>
