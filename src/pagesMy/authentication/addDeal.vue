<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'新增成交'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view scroll-y class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <ShCustomForm v-model="formData" :fields="fields" />
    </scroll-view>
    <ShBottomBtns
      :buttons="bottomButtons"
      @click="handleButtonClick"
      :backgroundColor="'#ffffff'"
    />
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import { ref } from 'vue'
const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
  verificationCode: '',
  company: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '成交状态',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '审核成功', value: '审核成功' },
      { label: '审核失败', value: '审核失败' },
    ],
  },
  {
    key: 'communityName',
    label: '经纪人',
    type: 'selectSearch',
    placeholder: '请选择',
    options: [
      { label: '1号', value: '1', phone: '1234567890' },
      { label: '2号', value: '1', phone: '1234567890' },
    ],
  },
  { key: 'area', label: '成交价格', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'ownerCertificate', label: '出房中介费', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'idCard', label: '出房成交奖', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'idCard', label: '成交合同', type: 'upload' },
]

const bottomButtons = [
  {
    text: '提交',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('提交')
  }
}
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  .content {
    height: calc(100vh - env(safe-area-inset-bottom) - 220rpx);
    background: #fff;
  }
}
</style>
