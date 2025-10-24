<template>
  <uni-popup ref="popup" type="bottom" background-color="transparent">
    <view class="popup-container">
      <!-- 标题 -->
      <view class="popup-header">
        <text class="title">分享至</text>
      </view>

      <!-- 分享选项 -->
      <view class="share-options">
        <view class="share-item" @tap="handleShare('wechat')">
          <view class="icon-wrapper">
            <image class="share-icon" src="/static/index/weixin.png" mode="aspectFit"></image>
          </view>
          <text class="share-text">微信好友</text>
        </view>

        <view class="share-item" @tap="handleShare('download')">
          <view class="icon-wrapper">
            <image class="share-icon" src="/static/index/download.png" mode="aspectFit"></image>
          </view>
          <text class="share-text">下载海报</text>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  share: [type: 'wechat' | 'download']
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

// 处理分享
const handleShare = (type: 'wechat' | 'download') => {
  close()
  emit('share', type)
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.popup-container {
  background: #ffffff;
  border-radius: 38rpx 38rpx 0 0;
  padding: 40rpx 40rpx 60rpx;
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
}

.popup-header {
  text-align: center;
  margin-bottom: 60rpx;

  .title {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 31rpx;
    color: #020202;
  }
}

.share-options {
  display: flex;
  justify-content: center;
  gap: 100rpx;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .share-icon {
    width: 92rpx;
    height: 92rpx;
  }
}

.share-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #020202;
}
</style>
