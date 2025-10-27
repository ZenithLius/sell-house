<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'关于我们'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view class="content" scroll-y :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <view class="header-logo">
        <image class="about-image" src="@/pagesMy/static/aboutus.png" mode="aspectFill"></image>
      </view>

      <view class="text-container">
        <view class="text-content">
          <text class="about-text">
            欢迎使用我们的卖房服务平台！我们致力于为用户提供便捷、高效、安全的房产交易服务。
            我们的平台汇集了海量优质房源信息，覆盖全国各大城市的住宅、商业地产等多种类型。通过先进的智能匹配系统，我们能够快速为您推荐最符合需求的房源。
            我们拥有专业的房产顾问团队，为您提供从看房、选房到签约、过户的全程专业服务。同时，我们严格把控房源信息的真实性，确保每一套房源都经过实地核验。
            平台还提供在线预约看房、虚拟看房、房贷计算等多种便捷功能，让您的购房之旅更加轻松愉快。
            如果您在使用过程中遇到任何问题，欢迎随时联系我们的客服团队，我们将竭诚为您服务！
            感谢您的信任与支持！
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f7f8fc;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}

.content {
  flex: 1;
  height: 100%;
}

.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 93rpx;

  .about-image {
    width: 331rpx;
    height: 104rpx;
  }
}

.text-container {
  margin: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

.text-content {
  padding: 38rpx 54rpx 38rpx 49rpx;
}

.about-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 48rpx;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
