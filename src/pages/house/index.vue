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
        <ShCustomForm v-model="formData" :fields="fields" :has-bottom-tabbar="false" />
        <view class="footer" @click="handleSubmit">
          <view class="submit-btn">提交</view>
        </view>
        <view class="space" style="height: 50rpx"></view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ShCustomForm from '@/components/ShCustomForm.vue'
import type { CustomFormField } from '@/types/customFormField'

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
  console.log('1tijao1', formData.value)
}
const fields: CustomFormField[] = [
  { key: 'communityName', label: '小区名称', type: 'input', placeholder: '请输入小区名称' },
  { key: 'area', label: '面积', type: 'input', placeholder: '请输入', unit: '/m²' },
  { key: 'price', label: '价格', type: 'input', placeholder: '请输入', unit: '/万元' },
  {
    key: 'region',
    label: '区域',
    type: 'select',
    placeholder: '请选择所在区域',
    options: [
      { label: '新城区', value: '1' },
      { label: '碑林区', value: '2' },
      { label: '莲湖区', value: '3' },
      { label: '灞桥区', value: '4' },
      { label: '未央区', value: '5' },
      { label: '雁塔区', value: '6' },
      { label: '阎良区', value: '7' },
      { label: '临潼区', value: '8' },
      { label: '长安区', value: '9' },
      { label: '高陵区', value: '10' },
      { label: '鄠邑区', value: '11' },
      { label: '蓝田县', value: '12' },
      { label: '周至县', value: '13' },
      { label: '西安高新技术产业开发区', value: '14' },
    ],
  },
  {
    key: 'address',
    label: '详细地址',
    type: 'input',
    placeholder: '请输入详细地址',
  },
  { key: 'customerName', label: '姓名', type: 'input', placeholder: '请输入姓名', required: true },
  {
    key: 'phone',
    label: '电话',
    type: 'input',
    placeholder: '请输入电话',
    inputType: 'number',
    required: true,
  },
]

const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
})
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
