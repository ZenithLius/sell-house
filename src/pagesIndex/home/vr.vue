<template>
  <view class="vr-page">
    <!-- 加载提示 -->
    <view v-if="isLoading" class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">VR加载中...</text>
      </view>
    </view>
    <!-- VR内容 -->
    <web-view v-if="vrUrl" :src="vrUrl" @load="handleLoad" @error="handleError"></web-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const vrUrl = ref('')
const isLoading = ref(true)

onLoad((option) => {
  if (option?.url) {
    vrUrl.value = decodeURIComponent(option.url)
    console.log('VR地址:', vrUrl.value)

    // 3秒后自动隐藏加载提示（防止 web-view 不触发 load 事件）
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  } else {
    uni.showToast({
      title: '缺少VR地址',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

// web-view 加载完成
const handleLoad = () => {
  console.log('VR加载完成')
  isLoading.value = false
}

// web-view 加载失败
const handleError = (e: any) => {
  console.error('VR加载失败:', e)
  isLoading.value = false
  uni.showToast({
    title: 'VR加载失败',
    icon: 'none',
  })
}
</script>

<style lang="scss" scoped>
.vr-page {
  width: 100%;
  height: 100vh;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #fff;
  font-size: 28rpx;
}
</style>
