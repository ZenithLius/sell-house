<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'签约'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view
      class="content"
      scroll-y
      :style="{ paddingTop: safeAreaInsets!.top +40+ 'px', paddingBottom:safeAreaInsets!.bottom + 100+'rpx' }"
    >
      <ShCustomForm v-model="formData" :fields="fields" />
    </scroll-view>
    <ShBottomBtns :buttons="bottomButtons" @click="handleButtonClick" />
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import ShBottomBtns from '@/components/ShBottomBtns.vue'
import { ref } from 'vue'
const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
})
const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '合同签约时间',
    head: '收房时间：',
    type: 'date',
    placeholder: '收房时间：',
  },
  {
    key: 'communityName',
    label: '',
    head: '到期时间：',
    type: 'date',
    placeholder: '收房时间：',
  },
  { key: 'area', label: '合同', type: 'upload' },

  { key: 'ownerCertificate', label: '业主房产证', type: 'upload' },
  { key: 'idCard', label: '身份证正反面', type: 'idCard' },
]
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

const bottomButtons = [
  {
    text: '保存/修改',
    background: '#863fce',
    color: '#ffffff',
  },
  {
    text: '续约',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改')
  } else if (index === 1) {
    console.log('续约')
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 100rpx);
  }
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
