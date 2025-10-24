<template>
  <uni-popup ref="popup" type="center" :mask-click="maskClick">
    <view class="popup-container">
      <!-- 标题 -->
      <view class="popup-title">{{ title }}</view>

      <scroll-view scroll-y class="popup-content" :style="{ maxHeight: maxHeight }">
        <slot></slot>
      </scroll-view>

      <view class="popup-footer">
        <button class="btn btn-cancel" @tap="handleCancel">{{ cancelText }}</button>
        <button class="btn btn-confirm" @tap="handleConfirm">{{ confirmText }}</button>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  cancelText?: string
  confirmText?: string
  maxHeight?: string
  maskClick?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '标题',
  cancelText: '取消',
  confirmText: '保存',
  maxHeight: '70vh',
  maskClick: true,
})

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const popup = ref<any>(null)

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
  emit('cancel')
  close()
}

// 确认按钮
const handleConfirm = () => {
  emit('confirm')
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.popup-container {
  width: 650rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-title {
  padding: 38rpx 0 0 0;
  text-align: center;
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 40rpx;
  color: #080304;
  line-height: 42rpx;
}

.popup-content {
  padding: 0rpx;
  flex: 1;
  overflow-y: auto;
}

.popup-footer {
  display: flex;
  gap: 30rpx;
  padding: 40rpx 35rpx;

  .btn {
    flex: 1;
    width: 248rpx;
    height: 76rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 28rpx;
    line-height: 42rpx;

    &.btn-cancel {
      border: 2px solid #eaeaea;
      background: #ffffff;
      color: #202020;
    }

    &.btn-confirm {
      background: #863fce;
      color: #ffffff;
    }
  }
}
</style>
