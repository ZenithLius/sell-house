<template>
  <view class="smart-lock-container" :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px'}">
    <view class="content">
      <!-- 步骤列表 -->
      <view class="step-list">
        <!-- 步骤1 -->
        <view class="step-item">
          <view class="step-header">
            <view class="step-number">
              <text class="number-text">1</text>
              <image class="line-icon" src="/static/index/linedown.png" mode="aspectFit"></image>
            </view>
            <view class="step-content">
              <text class="step-title">第一步：</text>
              <view class="step-desc">
                <text class="desc-text">打开手机蓝牙</text>
                <image
                  class="bluetooth-icon"
                  src="/static/index/bluet.png"
                  mode="aspectFit"
                ></image>
              </view>
            </view>
          </view>
        </view>

        <!-- 步骤2 -->
        <view class="step-item">
          <view class="step-header">
            <view class="step-number">
              <text class="number-text">2</text>
              <image class="line-icon" src="/static/index/linedown.png" mode="aspectFit"></image>
            </view>
            <view class="step-content">
              <text class="step-title">第二步：</text>
              <view class="step-desc">
                <text class="desc-text">用手触碰门锁数字区，激活门锁</text>
                <image class="hand-icon" src="/static/index/hand.png" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>

        <!-- 步骤3 -->
        <view class="step-item">
          <view class="step-header">
            <view class="step-number">
              <text class="number-text">3</text>
              <image class="line-icon" src="/static/index/linedown.png" mode="aspectFit"></image>
            </view>
            <view class="step-content" style="flex-direction: row; column-gap: 24rpx">
              <view>
                <text class="step-title">第三步：</text>
                <view class="step-desc">
                  <text class="desc-text">点击开锁</text>
                </view>
              </view>
              <view class="unlock-button" @tap="handleUnlock">
                <text class="unlock-text">蓝牙开锁</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-action">
      <view class="password-button" @tap="handlePasswordUnlock">
        <text class="password-text">密码开锁</text>
      </view>
      <text class="tip-text">*当蓝牙开锁失败，点击按钮，进行密码开锁</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
const emit = defineEmits<{
  unlock: []
  passwordUnlock: []
}>()

// 蓝牙开锁
const handleUnlock = () => {
  emit('unlock')
}

// 密码开锁
const handlePasswordUnlock = () => {
  emit('passwordUnlock')
}
</script>

<style lang="scss" scoped>
.bottom-action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 13rpx;
}
.smart-lock-container {
  background: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 200rpx;
  height: 90vh;
}

.content {
  width: 100%;
  flex: 1;
  padding: 40rpx 32rpx;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.step-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.step-header {
  display: flex;
  gap: 24rpx;
}

.step-number {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;

  .number-text {
    font-family: DIN;
    font-weight: bold;
    font-size: 40rpx;
    color: #16181b;
    line-height: 42rpx;
    font-style: italic;
    z-index: 2;
  }

  .line-icon {
    width: 50rpx;
    height: 18rpx;
    margin-top: -18rpx;
    z-index: 1;
    margin-left: 5rpx;
  }

  &.no-line {
    .line-icon {
      display: none;
    }
  }
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex {
    flex-direction: row;
  }
}

.step-title {
  font-family: Source Han Sans CN;
  font-weight: 600;
  font-size: 28rpx;
  color: #16181b;
}

.step-desc {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #16181b;
  display: flex;
  align-items: center;
  column-gap: 16rpx;

  .desc-text {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #16181b;
  }

  .bluetooth-icon,
  .hand-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

.unlock-button {
  width: 322rpx;
  height: 64rpx;
  background: #863fce;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;

  .unlock-text {
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;
  }

  &:active {
    opacity: 0.9;
  }
}

.password-button {
  width: 322rpx;
  height: 64rpx;
  background: #ffffff;
  border-radius: 10rpx;
  border: 2px solid #863fce;
  display: flex;
  align-items: center;
  justify-content: center;

  .password-text {
    font-size: 32rpx;
    font-weight: 500;
    color: #7c3aed;
  }

  &:active {
    background: #f5f3ff;
  }
}

.tip-text {
  font-size: 24rpx;
  color: #999999;
  line-height: 34rpx;
}
</style>
