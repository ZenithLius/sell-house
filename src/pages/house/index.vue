<template>
  <scroll-view @scroll="onScroll" scroll-y class="viewport">
    <ShNavbar
      @back="handleBack"
      v-show="showNavbar"
      :title="'我要卖房'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="header-bg">
      <image class="bg-image" src="@/static/house/background.png"></image>
    </view>
    <view class="logo" :style="{ top: safeAreaInsets!.top +50 + 'px' }">
      <image class="logo-image" src="@/static/house/logo.png"></image>
    </view>

    <ShMainTabbar />

    <view class="back" :style="{ top: safeAreaInsets!.top +10 + 'px' }">
      <image
        class="back-icon"
        @tap="handleBack"
        src="/static/tabs/backWhite.png"
        mode="aspectFit"
      ></image>
    </view>
    <view class="scroll-view">
      <view class="scroll-content">
        <ShCustomForm :key="key" v-model="formData" :fields="fields" :has-bottom-tabbar="true" />
        <view class="footer" @click="handleSubmit">
          <view class="submit-btn">提交</view>
        </view>
        <view class="space" style="height: 50rpx"></view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ShCustomForm from '@/components/ShCustomForm.vue'
import type { CustomFormField } from '@/types/customFormField'
import { onLoad, onUnload, onShow } from '@dcloudio/uni-app'

import { getAreaListAPI, sellHouseAPI, type SellHouseParams } from '@/services/house'

const getAreaListData = async () => {
  const res = await getAreaListAPI()
  fields.value[3].options = res.data
}

onShow(() => {
  resetForm()
})

onUnload(() => {
  formData.value = {
    id: '',
    title: '',
    area: '',
    price: '',
    district_code: '',
    street_name: '',
    username: '',
    phone: '',
    province_code: '',
    province_name: '',
    city_code: '',
    city_name: '',
    district_name: '',
    street_code: '',
    address: '',
  }
})
const key = ref(0)
const sellHouseReq = async (data: SellHouseParams) => {
  uni.showLoading({
    title: '提交中...',
  })
  const res = await sellHouseAPI(data)
  if (res.code == 200) {
    uni.showToast({
      title: '提交成功',
      icon: 'none',
    })
    resetForm()
    nextTick(() => {
      uni.switchTab({ url: '/pages/index/index' })
    })
  }
  uni.hideLoading()
}
onLoad(() => {
  getAreaListData()
})
const showNavbar = ref(false)

const back = () => {
  uni.navigateBack()
}
const onScroll = (e: any) => {
  const currentScrollTopHeight = e.detail.scrollTop
  // 小于50px
  if (currentScrollTopHeight <= 50) {
    showNavbar.value = false
  } else {
    // 向上滚动，显示导航栏
    showNavbar.value = true
  }
  scrollTop.value = currentScrollTopHeight
}
const scrollTop = ref(0)
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
const handleSubmit = () => {
  if (formData.value.username == '') {
    uni.showToast({
      title: '请填写姓名',
      icon: 'none',
    })
    return
  }
  if (formData.value.phone == '') {
    uni.showToast({
      title: '请填写电话',
      icon: 'none',
    })
    return
  }
  if (formData.value.phone && !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none',
    })
    return
  }
  formData.value.district_code = formData.value.district_code + ''
  sellHouseReq(formData.value as SellHouseParams)
}
const fields = ref<any[]>([
  { key: 'title', label: '小区名称', type: 'input', placeholder: '请输入小区名称' },
  { key: 'area', label: '面积', type: 'input', placeholder: '请输入', unit: '/m²' },
  { key: 'price', label: '价格', type: 'input', placeholder: '请输入', unit: '/万元' },
  {
    key: 'district_code',
    label: '区域',
    type: 'select',
    placeholder: '请选择所在区域',
    options: [],
  },
  {
    key: 'street_name',
    label: '详细地址',
    type: 'input',
    placeholder: '请输入详细地址',
  },
  { key: 'username', label: '姓名', type: 'input', placeholder: '请输入姓名', required: true },
  {
    key: 'phone',
    label: '电话',
    type: 'input',
    placeholder: '请输入电话',
    inputType: 'number',
    required: true,
  },
])

// 定义初始数据
const getInitialFormData = () => ({
  id: '',
  title: '',
  area: '',
  price: '',
  district_code: '',
  street_name: '',
  username: '',
  phone: '',
  province_code: '',
  province_name: '',
  city_code: '',
  city_name: '',
  district_name: '',
  street_code: '',
  address: '',
})

const formData = ref(getInitialFormData())

// 重置表单的函数
const resetForm = () => {
  key.value++
  Object.assign(formData.value, getInitialFormData())
}
</script>

<style lang="scss">
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}
.viewport {
  height: 100vh;
  background-color: #fff;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  .bg-image {
    width: 100%;
    height: 444rpx;
  }
  .footer {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .back {
    position: absolute;
    left: 38rpx;
    top: 0;
    .back-icon {
      width: 38rpx;
      height: 38rpx;
    }
  }
  .scroll-view {
    height: calc(100vh - 600rpx);
    margin-top: -126rpx;
    position: relative;
    z-index: 10;
  }

  .scroll-content {
    // background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    min-height: 100%;
  }

  .logo {
    position: absolute;
    left: 38rpx;
    top: 0;
    .logo-image {
      width: 190rpx;
      height: 38rpx;
    }
  }

  .form {
    padding: 24rpx 32rpx;
  }

  .form-item {
    margin-bottom: 32rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      font-weight: 500;
    }

    .name-gender-row {
      display: flex;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      height: 88rpx;
      padding-left: 28rpx;
      padding-right: 28rpx;

      .input-style {
        flex: 1;
        height: 100%;
        background: transparent;
        border: none;
        font-size: 28rpx;
        color: #333;
      }
    }

    .unit {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #863fce;
      margin-left: 16rpx;
      flex-shrink: 0;
    }

    .input-name {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .gender-group {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
    }

    .radio-item {
      display: flex;
      align-items: center;
      margin-left: 24rpx;

      radio {
        transform: scale(0.8);
      }

      .radio-text {
        font-size: 28rpx;
        color: #666;
        margin-left: 8rpx;
      }
    }

    .input {
      width: 100%;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      height: 88rpx;
      box-sizing: border-box;
    }
    .form {
      padding: 24rpx 32rpx;
    }

    .textarea {
      width: 100%;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      min-height: 400rpx;
      box-sizing: border-box;
    }

    .placeholder {
      color: #999;
    }
  }
}
</style>
