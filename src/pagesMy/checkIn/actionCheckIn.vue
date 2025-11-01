<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'员工打卡'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +10+ 'px' }">
      <view class="form">
        <ShCustomForm v-model="formData" :fields="fields" />
      </view>
    </view>
    <!-- <ShBottomTabbar /> -->
    <ShBottomBtns
      :paddingBottom="40"
      backgroundColor="#fff"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CustomFormField } from '@/types/customFormField'
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

const bottomButtons = [
  {
    text: '提交',
    background: '#863FCE',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改')
  }
}

const formData = ref({
  communityName: '',
  area: '',
  videourl: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '上传打卡照片',
    type: 'upload',
    placeholder: '请选择',
    weight: 'bold',
    desc: '上传水印相机照片',
    col: 24,
  },
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
