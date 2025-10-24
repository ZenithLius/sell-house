<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'新增记录'"
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

const bottomButtons = [
  {
    text: '提交',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改======', formData.value)
  } else if (index === 1) {
    console.log('续约')
  }
}

const formData = ref({
  communityName: '',
  area: '',
  images: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '标题',
    type: 'input',
    placeholder: '请输入',
  },
  {
    key: 'area',
    label: '内容',
    type: 'textarea',
    placeholder: '请描述你的问题',
  },
  { key: 'images', label: '图片上传', type: 'upload' },
]

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
    height: calc(100vh - env(safe-area-inset-bottom) - 200rpx);
  }
}
</style>
