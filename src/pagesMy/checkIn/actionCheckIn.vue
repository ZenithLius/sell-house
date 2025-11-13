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
import { onLoad } from '@dcloudio/uni-app'
import { checkInAPI } from '../services/staff'
const { safeAreaInsets } = uni.getSystemInfoSync()

const currentType = ref('1')
onLoad(() => {
  const currentRole = uni.getStorageSync('currentOtherManageType')
  if (currentRole === 'manager') {
    currentType.value = '2'
  } else {
    currentType.value = '1'
  }
})
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

const checkInReq = async () => {
  uni.showLoading({
    title: '提交中...',
  })
  const res = await checkInAPI({
    pic_url: formData.value.pic_url.join(','),
    type: '1', //1 员工 2 区域经理
  })
  uni.hideLoading()
  if (res.code === 200) {
    uni.showToast({
      title: '提交成功',
      icon: 'none',
    })
    handleBack()
  } else {
    uni.showToast({
      title: '提交失败',
      icon: 'none',
    })
  }
}

const handleButtonClick = (index: number) => {
  if (index === 0) {
    checkInReq()
  }
}

const formData = ref({
  pic_url: [],
})

const fields: CustomFormField[] = [
  {
    key: 'pic_url',
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
