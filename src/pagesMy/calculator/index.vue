<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'计算器'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <view class="form-one">
        <ShCustomForm v-model="formData" :fields="fields" />
      </view>
    </view>
    <ShBottomBtns
      :fixed="false"
      :buttons="bottomButtons"
      backgroundColor="#ffffff"
      :paddingBottom="0"
      @click="handleButtonClick"
    />
    <view class="result">
      <view class="top">测算结果</view>
      <view class="bottom">
        <view class="bottom-text">建议价格</view>
        <view class="bottom-value">88.88 <span style="font-size: 28rpx">万元</span></view>
      </view>
    </view>
    <ShBottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import { ref } from 'vue'

// （（score*weight）+（score*weight）+...）*最近成交价   测算价格逻辑

/**
 * ==========================================================================
 *                                 @异步请求下拉框
 * ==========================================================================
 */

const handleBack = () => {
  uni.navigateBack()
}

const bottomButtons = [
  {
    text: '重置信息',
    background: '#fff',
    color: '#333',
  },
  {
    text: '开始测算',
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

const formData = ref({
  communityName: '',
  area: '',
  videourl: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '房型',
    type: 'select',
    placeholder: '请选择',
    unit: '室',
    options: [],
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '请选择',
    unit: '明卫',
    options: [],
  },
  {
    key: 'communityName',
    label: '物业等级',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'communityName',
    label: '学校等级',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'communityName',
    label: '朝向',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'communityName',
    label: '得房率',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'area',
    label: '最近成交价',
    unit: '万元',
    type: 'input',
    placeholder: '请输入',
    col: 24,
  },
  {
    key: 'area',
    label: '建筑面积',
    unit: '㎡',
    type: 'input',
    placeholder: '请输入',
    col: 24,
  },
]
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  // .content {
  //   // padding-bottom: calc(env(safe-area-inset-bottom));
  // }
  .result {
    padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 24rpx;
    margin-top: 24rpx;
    .top {
      font-family: Source Han Sans CN;
      font-weight: 500;
      font-size: 28rpx;
      color: #626262;
      opacity: 0.9;
    }
    .bottom {
      width: 496rpx;
      height: 162rpx;
      background: rgba(134, 63, 206, 0.13);
      border-radius: 18rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      row-gap: 24rpx;

      .bottom-text {
        font-family: Source Han Sans CN;
        font-weight: 400;
        font-size: 28rpx;
        color: #747474;
        line-height: 42rpx;
      }
      .bottom-value {
        font-family: Source Han Sans CN;
        font-weight: bold;
        font-size: 46rpx;
        color: #f9432e;
        line-height: 54rpx;
        span {
          font-family: Source Han Sans CN;
          font-weight: bold;
          font-size: 31rpx !important;
          color: #f9432e;
          line-height: 54rpx;
        }
      }
    }
  }
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  .line {
    height: 10rpx;
    background: #f7f8fc;
  }
  .btn {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 35rpx;
    margin: 0 auto;
  }
}
</style>
