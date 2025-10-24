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
      <image class="bg-image" src="@/static/my/bgpic.png"></image>
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
      <view class="edit-btn" @tap="handleEdit">
        <image class="edit-icon" src="@/static/my/edit.png"></image>
        <text class="edit-text">编辑</text>
      </view>

      <!-- 头像 -->
      <view class="avatar-wrapper">
        <image class="avatar" src="@/static/my/edit.png"></image>
      </view>

      <!-- 用户信息 -->
      <view class="user-details">
        <!-- 第一行：姓名和角色 -->
        <view class="name-row">
          <text class="user-name">{{ userInfo.name }}</text>
          <text class="role-tag">{{ userInfo.role1 }}</text>
          <text class="role-tag">{{ userInfo.role2 }}</text>
        </view>

        <!-- 第二行：手机号 -->
        <view class="phone-row">
          <image class="phone-icon" src="@/static/customers/phone.png"></image>
          <text class="phone-number">{{ userInfo.phone }}</text>
        </view>

        <view class="company-row">
          <text class="company-text">{{ userInfo.company }}</text>
        </view>
      </view>
    </view>

    <view class="menu-list-wrapper">
      <MenuList />
    </view>

    <!-- 其他管理 -->
    <OtherManage />

    <!-- 联系我们和关于我们 -->
    <ContactAbout />
  </scroll-view>

  <uni-popup ref="share" type="share" backgroundColor="#fff">
    <uni-popup-share></uni-popup-share>
  </uni-popup>

  <!-- 登录弹窗 -->
  <LoginPopup ref="loginPopup" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuList from './components/MenuList.vue'
import OtherManage from './components/OtherManage.vue'
import ContactAbout from './components/ContactAbout.vue'
import LoginPopup from './components/LoginPopup.vue'

const showNavbar = ref(false)

// 用户信息
const userInfo = ref({
  name: '王姓名',
  role1: '经理',
  role2: '经纪人',
  phone: '13212345678',
  company: '所属公司：西安福地领先卖房科技有限公司',
})

const back = () => {
  uni.navigateBack()
}
const share = ref<any>(null)
const loginPopup = ref<any>(null)
const handleEdit = () => {
  console.log('编辑用户信息')
  loginPopup.value?.open()
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
type CustomFormField = {
  key: string
  label: string
  type?: 'input' | 'textarea' | 'select'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: { label: string; value: any }[]
}
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
const handleSubmit = () => {
  console.log('1tijao1', formData.value)
}
const fields: CustomFormField[] = [
  { key: 'communityName', label: '小区名称', type: 'input', placeholder: '请输入小区名称' },
  { key: 'area', label: '面积', type: 'input', placeholder: '请输入', unit: '/m²' },
  { key: 'price', label: '价格', type: 'input', placeholder: '请输入', unit: '/万元' },
  {
    key: 'region',
    label: '区域',
    type: 'select',
    placeholder: '请选择所在区域',
    options: [
      { label: '新城区', value: '1' },
      { label: '碑林区', value: '2' },
      { label: '莲湖区', value: '3' },
      { label: '灞桥区', value: '4' },
      { label: '未央区', value: '5' },
      { label: '雁塔区', value: '6' },
      { label: '阎良区', value: '7' },
      { label: '临潼区', value: '8' },
      { label: '长安区', value: '9' },
      { label: '高陵区', value: '10' },
      { label: '鄠邑区', value: '11' },
      { label: '蓝田县', value: '12' },
      { label: '周至县', value: '13' },
      { label: '西安高新技术产业开发区', value: '14' },
    ],
  },
  {
    key: 'address',
    label: '详细地址',
    type: 'input',
    placeholder: '请输入详细地址',
  },
  { key: 'customerName', label: '姓名', type: 'input', placeholder: '请输入姓名', required: true },
  {
    key: 'phone',
    label: '电话',
    type: 'input',
    placeholder: '请输入电话',
    inputType: 'number',
    required: true,
  },
]

const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
})
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

.viewport {
  height: 100vh;
  background-color: #eff0ed;
  padding-bottom: 54rpx;
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
