<script setup lang="ts">
const emit = defineEmits<{ back: [] }>()
const { safeAreaInsets } = uni.getSystemInfoSync()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  home: {
    type: Boolean,
    default: false,
  },
})

const back = () => {
  emit('back')
}
</script>

<template>
  <view class="navbar" :style="{ height: safeAreaInsets!.top + 10 + 'px'}"> </view>
  <view class="drawer-header">
    <view v-if="showBack" class="header-back" @tap="back">
      <image
        v-if="home"
        class="back-icon"
        src="/static/tabs/sellHouse.png"
        mode="aspectFit"
      ></image>
      <image v-else class="back-icon" src="/static/tabs/back.png" mode="aspectFit"></image>
    </view>
    <text class="header-title">{{ title }}</text>
    <view class="header-placeholder"></view>
  </view>
</template>

<style lang="scss">
.drawer-header {
  margin-top: 0rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rpx 30rpx 20rpx 30rpx;
  background-color: #fff;
  width: 100%;
}

.header-back {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  width: 38rpx;
  height: 38rpx;
}

.header-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 29rpx;
  color: #16181b;
}
.navbar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  background: #fff;
  margin-top: -2rpx;

  .navbar-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }
    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
