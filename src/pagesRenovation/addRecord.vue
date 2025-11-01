<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'添加记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <ShCustomForm v-model="formData" :fields="fields" />
      <ShBottomBtns
        paddingBottom="20"
        backgroundColor="#fff"
        :buttons="bottomButtons"
        @click="handleButtonClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CustomFormField } from '@/types/customFormField'
import { ref } from 'vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

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
    label: '装修任务',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '任务1', value: '1' },
      { label: '任务2', value: '2' },
      { label: '任务3', value: '3' },
    ],
  },
  {
    key: 'communityName',
    label: '装修进度',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '进度1', value: '1' },
      { label: '进度2', value: '2' },
      { label: '进度3', value: '3' },
    ],
  },
  { key: 'area', label: '证明材料', type: 'upload' },
]
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
}
</style>
