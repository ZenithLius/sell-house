<template>
  <scroll-view @scroll="onScroll" scroll-y class="viewport">
    <ShNavbar
      @back="handleBack"
      v-show="showNavbar"
      :title="'我的'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="header-bg">
      <image class="bg-image" src="@/pagesMy/static/bgpic.png"></image>
    </view>
    <view class="back" :style="{ top: safeAreaInsets!.top +10 + 'px' }">
      <image
        class="back-icon"
        @tap="handleBack"
        src="/static/tabs/backWhite.png"
        mode="aspectFit"
      ></image>
    </view>

    <!-- 用户信息卡片 -->
    <view class="user-info-card" :style="{ marginTop: safeAreaInsets!.top + 60 + 'px' }">
      <!-- 编辑按钮 -->

      <view v-if="userInfo" class="logined">
        <view class="edit-btn" @tap="handleEdit">
          <image class="edit-icon" src="/static/my/edit.png"></image>
          <text class="edit-text">编辑</text>
        </view>
        <!-- 头像 -->
        <view class="avatar-wrapper">
          <image class="avatar" :src="userInfo?.avatar"></image>
        </view>

        <!-- 用户信息 -->
        <view class="user-details">
          <!-- 第一行：姓名和角色 -->
          <view class="name-row">
            <text class="user-name">{{ userInfo?.nickname }}</text>
            <text class="role-tag">{{ userInfo?.role1 }}</text>
            <text class="role-tag">{{ userInfo?.role2 }}</text>
          </view>

          <!-- 第二行：手机号 -->
          <view class="phone-row">
            <image class="phone-icon" src="@/static/customers/phone.png"></image>
            <text class="phone-number">{{ userInfo?.mobile }}</text>
          </view>

          <view class="company-row">
            <text class="company-text">所属公司：{{ userInfo?.company_tile }}</text>
          </view>
        </view>
      </view>

      <view
        v-else
        @tap="handleLogin"
        class="not-logined"
        :style="{ marginTop: safeAreaInsets!.top + 0 + 'px' }"
      >
        去登录
      </view>
    </view>

    <view class="menu-list-wrapper">
      <MenuList @login="handleLogin" />
    </view>

    <!-- 其他管理 -->
    <OtherManage @login="handleLogin" />

    <!-- 联系我们和关于我们 -->
    <ContactAbout />

    <view class="space"></view>
  </scroll-view>

  <uni-popup ref="share" type="share" backgroundColor="#fff">
    <uni-popup-share></uni-popup-share>
  </uni-popup>

  <!-- 登录弹窗 -->
  <ShLoginPopup ref="loginPopup" />

  <ShMainTabbar />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MenuList from './components/MenuList.vue'
import OtherManage from './components/OtherManage.vue'
import ContactAbout from './components/ContactAbout.vue'
import { useUserStore } from '@/stores'
const showNavbar = ref(false)

const handleLogin = () => {
  loginPopup.value?.open()
}

// 用户信息
const userInfo = computed(() => useUserStore().userInfo)
const share = ref<any>(null)
const loginPopup = ref<any>(null)
const handleEdit = () => {
  uni.navigateTo({
    url: '/pagesCustomer/editInfo',
  })
}

const onScroll = (e: any) => {
  const currentScrollTopHeight = e.detail.scrollTop
  // 小于50px
  if (currentScrollTopHeight <= 50) {
    showNavbar.value = false
  } else {
    // 向上滚动，显示导航栏
    showNavbar.value = true
  }
  scrollTop.value = currentScrollTopHeight
}
const scrollTop = ref(0)

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss">
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}
.not-logined {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  border: 1px solid #cacaca;
  background: rgba(255, 255, 255, 0.34);
  border-radius: 47rpx;
  width: 470rpx;
  height: 94rpx;
  margin: 0 auto;
}
.space {
  height: calc(env(safe-area-inset-bottom) + 30rpx);
}

.viewport {
  height: 100vh;
  background-color: #ffffff;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  .bg-image {
    width: 100%;
    height: 832rpx;
  }
  .footer {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .back {
    position: absolute;
    left: 38rpx;
    top: 0;
    .back-icon {
      width: 38rpx;
      height: 38rpx;
    }
  }

  .user-info-card {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 40rpx;
    z-index: 10;
    margin-bottom: 40rpx;

    .edit-btn {
      position: absolute;
      right: 0;
      top: 24rpx;
      display: flex;
      align-items: center;
      width: 131rpx;
      height: 64rpx;
      background: rgba(255, 255, 255, 0.54);
      border-radius: 32rpx 0rpx 0rpx 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 8rpx;

      .edit-icon {
        width: 28rpx;
        height: 28rpx;
      }

      .edit-text {
        font-size: 24rpx;
        color: #333;
        margin-bottom: 5rpx;
      }
    }

    .avatar-wrapper {
      display: flex;
      justify-content: start;
      margin-bottom: 24rpx;

      .avatar {
        width: 131rpx;
        height: 131rpx;
        border-radius: 50%;
        border: 2px solid #5e1ca2;
      }
    }

    .user-details {
      text-align: center;

      .name-row {
        display: flex;
        justify-content: start;
        align-items: baseline;
        margin-bottom: 16rpx;

        .user-name {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 42rpx;
          color: #0d0e14;
          line-height: 72rpx;
          margin-right: 31rpx;
        }

        .role-tag {
          font-size: 24rpx;
          color: #333;
          padding: 4rpx 10rpx;
          margin-right: 12rpx;
          height: 16rpx;
          line-height: 16rpx;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .phone-row {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-bottom: 16rpx;
        padding: 8rpx 20rpx;
        height: 34rpx;
        background: rgba(255, 255, 255, 0);
        border-radius: 17rpx;
        border: 1px solid #be7eff;
        width: fit-content;
        .phone-icon {
          width: 15rpx;
          height: 20rpx;
          margin-right: 12rpx;
        }

        .phone-number {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 22rpx;
          color: #863fce;
          line-height: 38rpx;
        }
      }

      .company-row {
        display: flex;
        .company-text {
          font-family: Source Han Sans CN;
          font-weight: 300;
          font-size: 24rpx;
          color: #6c6c6c;
          line-height: 38rpx;
        }
      }
    }
  }

  .menu-list-wrapper {
    position: relative;
    margin-top: -280rpx;
    z-index: 20;
  }

  .logo {
    position: absolute;
    left: 38rpx;
    top: 0;
    .logo-image {
      width: 190rpx;
      height: 38rpx;
    }
  }

  .form {
    padding: 24rpx 32rpx;
  }

  .form-item {
    margin-bottom: 32rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      font-weight: 500;
    }

    .name-gender-row {
      display: flex;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      height: 88rpx;
      padding-left: 28rpx;
      padding-right: 28rpx;

      .input-style {
        flex: 1;
        height: 100%;
        background: transparent;
        border: none;
        font-size: 28rpx;
        color: #333;
      }
    }

    .unit {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #863fce;
      margin-left: 16rpx;
      flex-shrink: 0;
    }

    .input-name {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .gender-group {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
    }

    .radio-item {
      display: flex;
      align-items: center;
      margin-left: 24rpx;

      radio {
        transform: scale(0.8);
      }

      .radio-text {
        font-size: 28rpx;
        color: #666;
        margin-left: 8rpx;
      }
    }

    .input {
      width: 100%;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      height: 88rpx;
      box-sizing: border-box;
    }
    .form {
      padding: 24rpx 32rpx;
    }

    .textarea {
      width: 100%;
      background-color: #f7f7f7;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      min-height: 400rpx;
      box-sizing: border-box;
    }

    .placeholder {
      color: #999;
    }
  }
}
</style>
