<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
    background-color="transparent"
    :z-index="9999"
  >
    <view class="login-popup">
      <view class="popup-content">
        <!-- 左上角图标和标题 -->
        <view class="header">
          <image class="logo" src="@/pagesMy/static/loginLogo.png" mode="aspectFit"></image>
          <text class="title">欢迎使用</text>
        </view>

        <!-- 微信授权登录按钮 -->
        <!--    @getphonenumber="onGetphonenumber" -->
        <button class="login-btn" open-type="getPhoneNumber" @tap="handleWxLogin">
          <image class="wx-icon" src="@/pagesMy/static/weixin.png" mode="aspectFit"></image>
          <text>微信授权登录</text>
        </button>

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
                <text class="link" @tap.stop="handleProtocol(24)">《安全协议》</text>
                和
                <text class="link" @tap.stop="handleProtocol(26)">《隐私政策》</text>
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
import { useMemberStore, useUserStore } from '@/stores'
import { getUserInfoAPI, postLoginWxMinAPI } from '@/services/login'
import type { LoginResult } from '@/types/member'

const emit = defineEmits<{
  (e: 'login-status', status: boolean): void
}>()

const popup = ref<any>(null)
const agreed = ref(false)

const open = () => {
  popup.value?.open()
}

const close = () => {
  popup.value?.close()
}
const loginSuccess = async (profile: LoginResult) => {
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)

  const userStore = useUserStore()
  const res = await getUserInfoAPI()
  if (res.data) {
    userStore.setUserInfo(res.data)
  }
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}
const handleProtocol = (id: number) => {
  uni.navigateTo({
    url: `/pagesMy/agreement/index?id=${id}`,
  })
}
const handleWxLogin = async () => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先阅读并同意协议',
      icon: 'none',
    })
    return
  }

  // const { code } = await wx.login()
  const res = await postLoginWxMinAPI({ code: '15555155555', type: '2' })
  if (res.code == 200) {
    loginSuccess(res.data)
  } else {
    uni.showToast({
      icon: 'none',
      title: '登录失败',
    })
  }
  close()
}

const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  // if (!agreed.value) {
  //   uni.showToast({
  //     title: '请先阅读并同意协议',
  //     icon: 'none',
  //   })
  //   return
  // }
  // // #ifdef MP-WEIXIN
  // try {
  //   const { code } = await wx.login()
  //   console.log('code1111', code)
  //   const { encryptedData, iv } = ev.detail
  //   // const { code } = await wx.login()
  //   console.log('encryptedData1111', encryptedData)
  //   console.log('iv2222111', iv)
  //   if (!encryptedData || !iv) {
  //     uni.showToast({
  //       title: '授权失败或已取消',
  //       icon: 'none',
  //     })
  //     return
  //   }
  //   console.log('1111111', code)
  //   console.log('encryptedData22222', encryptedData)
  //   console.log('iv33333', iv)
  //   // type
  //   // 1是正式，2模拟
  //   const res = await postLoginWxMinAPI({ code, type: '2' })
  //   const memberStore = useMemberStore()
  //   memberStore.setProfile(res.result)
  //   uni.showToast({
  //     icon: 'success',
  //     title: '登录成功',
  //   })
  //   close()
  // } catch (err) {
  //   uni.showToast({
  //     title: '登录失败，请重试',
  //     icon: 'none',
  //   })
  // }
  // #endif
}

const handleCancel = () => {
  close()
}

const handleAgreementChange = (e: any) => {
  agreed.value = e.detail.value.length > 0
}

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
      &::after {
        border: none;
      }

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
