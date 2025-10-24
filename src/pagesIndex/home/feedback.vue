<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <ShNavbar @back="handleBack" :title="'我要反馈'" />

    <scroll-view scroll-y class="scroll-view">
      <view class="form">
        <!-- 提示信息 -->
        <view class="tip">
          <image class="tip-icon" src="/static/index/notice.png" mode="aspectFit"></image>
          <text class="tip-text">请留下您的反馈内容,我们会第一时间进行处理</text>
        </view>

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
            <radio-group class="gender-group" @change="onGenderChange">
              <label class="radio-item">
                <radio value="male" :checked="formData.gender === 'male'" color="#8b5cf6" />
                <text class="radio-text">先生</text>
              </label>
              <label class="radio-item">
                <radio value="female" :checked="formData.gender === 'female'" color="#8b5cf6" />
                <text class="radio-text">女士</text>
              </label>
            </radio-group>
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

        <!-- 反馈内容 -->
        <view class="form-item">
          <view class="label">反馈内容</view>
          <textarea
            v-model="formData.content"
            class="textarea-style"
            placeholder="请描述你的问题"
            placeholder-class="placeholder"
            :maxlength="500"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 提交按钮（吸底） -->
    <view class="footer">
      <button class="submit-btn" @click="handleSubmit">提交</button>
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
  name: '',
  gender: 'male',
  phone: '',
  content: '',
})

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

  if (!formData.value.content) {
    uni.showToast({
      title: '请输入反馈内容',
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
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.05);

  .submit-btn {
    width: 100%;
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
