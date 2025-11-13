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
    <!-- <BottomTabbar /> -->
    <ShBottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import { ref } from 'vue'
import { createProcedureAPI, getProcedureStatusAPI } from '../services/staff'
import { onLoad } from '@dcloudio/uni-app'

const houseListId = ref<string | number>('')
onLoad((options) => {
  houseListId.value = options?.house_list_id || ''
})

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

// 新增手续
const createProcedureReq = async () => {
  const params = {
    house_list_id: houseListId.value,
    remark: formData.value.remark,
    type_id: formData.value.type_id,
  }
  uni.showLoading({
    title: '提交中',
  })
  const res = await createProcedureAPI(params)
  uni.hideLoading()

  if (res.code === 200) {
    uni.showToast({
      title: '提交成功',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } else {
    uni.showToast({
      title: '提交失败',
      icon: 'none',
    })
  }
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
    createProcedureReq()
  }
}

const formData = ref({
  type_id: '',
  remark: '',
})

const fields: CustomFormField[] = [
  {
    key: 'type_id',
    label: '手续状态',
    type: 'select',
    placeholder: '请选择',
    options: [
      {
        title: '过户',
        id: 1,
      },
      {
        title: '放款',
        id: 2,
      },
      {
        title: '完结',
        id: 3,
      },
    ],
  },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    placeholder: '请描述你的问题',
  },
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
