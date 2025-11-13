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
      :paddingBottom="20"
      @click="handleButtonClick"
      :backgroundColor="'#ffffff'"
    />
    <!-- <BottomTabbar /> -->
    <!-- <ShBottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addFollowRecordAPI } from '@/pagesMy/services/staff'
const currentHouseId = ref('')
onLoad((options) => {
  currentHouseId.value = options?.house_list_id || ''
})

const bottomButtons = [
  {
    text: '提交',
    background: '#863fce',
    color: '#ffffff',
  },
]
const addFollowRecordReq = async () => {
  const params = {
    house_list_id: currentHouseId.value,
    title: formData.value.title,
    content: formData.value.content,
    mul_img: formData.value.mul_img.join(','),
  }
  uni.showLoading({
    title: '保持中',
  })
  const res = await addFollowRecordAPI(params)
  if (res.code === 200) {
    uni.showToast({
      title: '新增成功',
      icon: 'none',
    })
    uni.navigateBack()
  } else {
    uni.showToast({
      title: '新增失败',
      icon: 'none',
    })
  }
  uni.hideLoading()
}
const handleButtonClick = (index: number) => {
  if (index === 0) {
    // 表单验证
    if (!formData.value.title) {
      uni.showToast({
        title: '请输入标题',
        icon: 'none',
      })
      return
    }
    if (!formData.value.content) {
      uni.showToast({
        title: '请输入内容',
        icon: 'none',
      })
      return
    }
    // if (!formData.value.mul_img.length) {
    //   uni.showToast({
    //     title: '请上传图片',
    //     icon: 'none',
    //   })
    //   return
    // }
    addFollowRecordReq()
  }
}

const formData = ref({
  title: '',
  content: '',
  mul_img: [],
})

const fields: CustomFormField[] = [
  {
    key: 'title',
    label: '标题',
    type: 'input',
    placeholder: '请输入',
  },
  {
    key: 'content',
    label: '内容',
    type: 'textarea',
    placeholder: '请描述你的问题',
  },
  { key: 'mul_img', label: '图片上传', type: 'upload' },
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
    height: calc(100vh - env(safe-area-inset-bottom) - 100rpx);
  }
}
</style>
