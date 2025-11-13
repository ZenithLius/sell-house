<template>
  <view class="contact-about">
    <view class="contact-item" @tap="handleClick('contact')">
      <image class="contact-icon" src="/static/my/phone.png"></image>
      <text class="contact-text">联系我们</text>
    </view>
    <view class="contact-item" @tap="handleClick('about')">
      <image class="contact-icon" src="/static/my/about.png"></image>
      <text class="contact-text">关于我们</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleClick = (type: string) => {
  if (type === 'contact') {
    uni.navigateTo({ url: '/pagesMy/contact/index' })
    // uni.makePhoneCall({ phoneNumber: '400-xxx-xxxx' })
  } else if (type === 'about') {
    uni.navigateTo({ url: '/pagesMy/about/index' })
  }
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';
.contact-about {
  margin: 40rpx 30rpx 0rpx 30rpx;
  padding: 32rpx 32rpx 24rpx;
  display: flex;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: $uni-box-shadow;

  .contact-item {
    width: 20%;
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 27rpx;
    height: 100rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .contact-icon {
      width: 44rpx;
      height: 44rpx;
    }

    .contact-text {
      flex: 1;
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 22rpx;
      color: #362b40;
    }
  }
}
</style>
