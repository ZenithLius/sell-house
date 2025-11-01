<template>
  <view class="floating-actions">
    <view class="action-item" @tap="handleFollow">
      <image
        v-if="!isFollowed"
        class="action-icon follow"
        src="@/pagesIndex/static/follow.png"
        mode="aspectFit"
      ></image>
      <image
        v-else
        class="action-icon follow"
        src="@/pagesIndex/static/followed.png"
        mode="aspectFit"
      ></image>
      <text class="action-text">关注</text>
    </view>
    <!-- <view class="space"></view> -->
    <view class="action-item" @tap="handleFeedback">
      <image class="action-icon feedback" src="/static/index/feedback.png" mode="aspectFit"></image>
      <text class="action-text">反馈</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Emits
const emit = defineEmits<{
  follow: []
  feedback: []
}>()

const isFollowed = ref(true)

const handleFollow = () => {
  emit('follow')
}

const handleFeedback = () => {
  emit('feedback')
}
</script>

<style lang="scss" scoped>
.floating-actions {
  position: fixed;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  height: 251rpx;
  width: 75rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 38rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
  }
}
.action-icon {
  margin-bottom: 12rpx;
  &.follow {
    width: 39rpx;
    height: 36rpx;
  }
  &.feedback {
    width: 35rpx;
    height: 34rpx;
  }
}

.action-text {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 24rpx;
  color: #999999;
  line-height: 1;
}
</style>
