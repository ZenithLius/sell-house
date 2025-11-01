<template>
  <uni-popup ref="popup" type="center" :mask-click="false" background-color="transparent">
    <view class="popup-container">
      <view class="popup-content">
        <!-- 头像图标 -->

        <image class="avatar-icon" :src="avatarUrl" mode="aspectFit"></image>

        <!-- 姓名 -->
        <text class="name-text">{{ name }}</text>

        <!-- 电话号码 -->
        <text class="phone-text">{{ phone }}</text>

        <!-- 按钮组 -->
        <view class="button-group">
          <view class="btn btn-cancel" @tap="handleCancel">
            <text class="btn-text">关闭</text>
          </view>
          <view class="btn btn-confirm" @tap="handleConfirm">
            <text class="btn-text">立即拨打</text>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  name?: string
  phone?: string
  avatarUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '李三',
  phone: '13212345678',
  avatarUrl: '/pagesIndex/static/phonecall.png',
})

const emit = defineEmits<{
  cancel: []
  confirm: [phone: string]
}>()

const popup = ref<{ open: () => void; close: () => void } | null>(null)

// 打开弹窗
const open = () => {
  popup.value?.open()
}

// 关闭弹窗
const close = () => {
  popup.value?.close()
}

// 取消按钮
const handleCancel = () => {
  close()
  emit('cancel')
}

// 确定按钮
const handleConfirm = () => {
  close()
  emit('confirm', props.phone)
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.avatar-icon {
  width: 108rpx;
  height: 113rpx;
}
.popup-container {
  width: 600rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx 40rpx;
}

.name-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16rpx;
  margin-top: 23rpx;
}

.phone-text {
  font-size: 48rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 48rpx;
  letter-spacing: 2rpx;
}

.button-group {
  display: flex;
  gap: 24rpx;
  width: 100%;
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .btn-text {
    font-size: 32rpx;
    font-weight: 500;
  }
}

.btn-cancel {
  background: #ffffff;
  border-radius: 10rpx;
  border: 2px solid #eaeaea;

  .btn-text {
    color: #666666;
  }

  &:active {
    background: #ebebeb;
  }
}

.btn-confirm {
  background: #863fce;
  border-radius: 10rpx;

  .btn-text {
    color: #ffffff;
  }

  &:active {
    opacity: 0.9;
  }
}
</style>
