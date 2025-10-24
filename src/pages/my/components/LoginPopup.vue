<template>
  <uni-popup ref="popup" type="bottom" :safe-area="false" background-color="transparent">
    <view class="login-popup">
      <view class="popup-content">
        <!-- 左上角图标和标题 -->
        <view class="header">
          <image class="logo" src="@/static/my/loginLogo.png" mode="aspectFit"></image>
          <text class="title">欢迎使用</text>
        </view>

        <!-- 微信授权登录按钮 -->
        <view class="login-btn" @tap="handleWxLogin">
          <image class="wx-icon" src="@/static/my/weixin.png" mode="aspectFit"></image>
          <text>微信授权登录</text>
        </view>

        <!-- 取消授权按钮 -->
        <view class="cancel-btn" @tap="handleCancel">
          <text>取消授权</text>
        </view>

        <!-- 协议勾选 -->
        <view class="agreement">
          <checkbox-group @change="handleAgreementChange">
            <label class="agreement-label">
              <checkbox value="agreed" :checked="agreed" color="#863fce" />
              <text class="agreement-text">
                我已阅读并同意
                <text class="link" @tap.stop="handleProtocol">《安全协议》</text>
                和
                <text class="link" @tap.stop="handlePrivacy">《隐私政策》</text>
              </text>
            </label>
          </checkbox-group>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const popup = ref<any>(null)
const agreed = ref(false)

// 打开弹窗
const open = () => {
  popup.value?.open()
}

// 关闭弹窗
const close = () => {
  popup.value?.close()
}

// 微信授权登录
const handleWxLogin = () => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先阅读并同意协议',
      icon: 'none',
    })
    return
  }
  console.log('微信授权登录')
  uni.showToast({
    title: '微信登录功能待实现',
    icon: 'none',
  })
}

// 取消授权
const handleCancel = () => {
  close()
}

// 协议勾选变化
const handleAgreementChange = (e: any) => {
  agreed.value = e.detail.value.length > 0
}

// 查看安全协议
const handleProtocol = () => {
  console.log('查看安全协议')
  uni.showToast({
    title: '安全协议',
    icon: 'none',
  })
}

// 查看隐私政策
const handlePrivacy = () => {
  console.log('查看隐私政策')
  uni.showToast({
    title: '隐私政策',
    icon: 'none',
  })
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.mask-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.login-popup {
  position: relative;
  background: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  z-index: 1000;

  .popup-content {
    padding: 60rpx 64rpx 40rpx;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 60rpx;

      .logo {
        width: 46rpx;
        height: 46rpx;
        margin-right: 15rpx;
      }

      .title {
        font-family: Source Han Sans CN;
        font-weight: 400;
        font-size: 31rpx;
        color: #020202;
      }
    }

    .login-btn {
      width: 470rpx;
      height: 94rpx;
      background: #863fce;
      border-radius: 47rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;

      .wx-icon {
        width: 43rpx;
        height: 35rpx;
        margin-right: 15rpx;
      }

      text {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 32rpx;
        color: #ffffff;
      }
    }

    .cancel-btn {
      margin-top: 39rpx;
      width: 470rpx;
      height: 94rpx;
      background: #ffffff;
      border: 1px solid #cacaca;
      border-radius: 47rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 48rpx;
      margin-left: auto;
      margin-right: auto;
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 32rpx;
      color: #666666;
    }
    .agreement {
      display: flex;
      justify-content: center;

      .agreement-label {
        display: flex;
        align-items: center;

        checkbox {
          margin-right: 16rpx;
          transform: scale(0.8);
        }

        .agreement-text {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 36rpx;

          .link {
            color: #863fce;
          }
        }
      }
    }
  }
}
</style>
