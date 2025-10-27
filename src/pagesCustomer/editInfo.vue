<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <ShNavbar @back="handleBack" :title="'个人信息'" />

    <scroll-view scroll-y class="scroll-view">
      <!-- 头像区域 -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @tap="chooseAvatar">
          <image class="avatar" :src="formData.avatar" mode="aspectFill"></image>
          <view class="edit-icon-wrapper">
            <image class="edit-icon" src="/static/customers/pen.png" mode="aspectFit"></image>
          </view>
        </view>
      </view>
      <view class="form">
        <!-- 姓名和性别 -->
        <view class="form-item">
          <view class="label">姓名</view>
          <view class="name-gender-row">
            <input
              v-model="formData.name"
              class="input-style name"
              placeholder="请输入姓名"
              placeholder-class="placeholder"
            />
          </view>
        </view>

        <!-- 联系电话 -->
        <view class="form-item">
          <view class="label">联系电话</view>
          <input
            v-model="formData.phone"
            class="input-style phone"
            placeholder="请输入联系电话"
            placeholder-class="placeholder"
          />
        </view>
        <!-- 所属公司 -->
        <view class="form-item">
          <view class="label">所属公司</view>
          <input
            v-model="formData.company"
            class="input-style phone"
            placeholder="请输入所属公司"
            placeholder-class="placeholder"
          />
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <button class="submit-btn" @click="handleSubmit">确认信息</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const handleBack = () => {
  uni.navigateBack()
}
// 表单数据
const formData = ref({
  avatar: '/static/customers/share.png', // 默认头像
  name: '',
  gender: 'male',
  phone: '',
  company: '',
})

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0]
      uni.showToast({
        title: '头像已更新',
        icon: 'success',
      })
    },
  })
}

// 性别选择
const onGenderChange = (e: any) => {
  formData.value.gender = e.detail.value
}

// 提交表单
const handleSubmit = () => {
  // 表单验证
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
    })
    return
  }

  if (!formData.value.phone) {
    uni.showToast({
      title: '请输入联系电话',
      icon: 'none',
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none',
    })
    return
  }

  if (!formData.value.company) {
    uni.showToast({
      title: '请输入所属公司',
      icon: 'none',
    })
    return
  }

  // TODO: 提交到后端
  console.log('提交表单:', formData.value)

  uni.showToast({
    title: '提交成功',
    icon: 'success',
  })

  // 延迟返回上一页
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.input-style {
  height: 90rpx;
  background: #f7f7f7;
  border-radius: 18rpx;
  padding: 0 28rpx;
}

.textarea-style {
  height: 550rpx;
  width: 100%;
  background: #f7f7f7;
  border-radius: 18rpx;
  padding: 28rpx 28rpx;
}
.tip-icon {
  width: 24rpx;
  height: 24rpx;
}
.container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  padding-bottom: 100rpx;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0 20rpx;

  .avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 80rpx;
      border: 2rpx solid #f0f0f0;
    }

    .edit-icon-wrapper {
      position: absolute;
      right: -3rpx;
      bottom: 0;
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .edit-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}

.form {
  padding: 24rpx 32rpx;
}

.tip {
  display: flex;
  align-items: center;
  column-gap: 13rpx;
  height: 60rpx;
  background: #f5ecff;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;

  .tip-icon {
    width: 24rpx;
    height: 24rpx;
  }

  .tip-text {
    flex: 1;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #863fce;
  }
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

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #fff;

  .submit-btn {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
