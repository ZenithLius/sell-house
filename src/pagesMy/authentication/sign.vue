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
      <ShCustomForm v-if="currentRole !== 'manager'" v-model="formData" :fields="fields" />
      <ShFormView v-else :modelValue="formData" :fields="fields" :showAsteriskForRequired="true" />
    </scroll-view>

    <ShBottomBtns
      :paddingBottom="130"
      backgroundColor="#fff"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import ShBottomBtns from '@/components/ShBottomBtns.vue'
import { computed, ref } from 'vue'
import ShFormView from '@/components/ShFormView.vue'
import { onLoad } from '@dcloudio/uni-app'

const currentRole = uni.getStorageSync('currentOtherManageType')

const formData = ref({
  communityName: '123233333',
  area: '12323',
  price: '123123',
  region: '123123',
  address: '123123',
  customerName: '123123',
  phone: '123123',
  photos: [
    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  ],
  idcard: {
    front: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    back: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
})
const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '合同签约时间',
    type: 'input',
    head: '收房时间：',
  },
  {
    key: 'communityName',
    label: 'none',
    head: '到期时间：',
    type: 'input',
  },
  { key: 'photos', label: '合同', type: 'upload', maxCount: 6 },

  { key: 'photos', label: '业主房产证', type: 'upload', maxCount: 6 },
  { key: 'idcard', label: '身份证正反面', type: 'idCard' },
]
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

const bottomButtons = computed(() => {
  console.log('currentRolejisaunshuxing1', currentRole)
  if (currentRole === 'manager') {
    return [
      {
        text: '取消',
        background: '#fff',
        color: '#863fce',
      },
    ]
  } else {
    return [
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
  }
})
const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改')
  } else if (index === 1) {
    console.log('续约')
  }
}
onLoad(() => {
  console.log('currentRolejisaunshuxing2', uni.getStorageSync('currentOtherManageType'))
})
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 128rpx);
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
