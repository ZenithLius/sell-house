<script setup lang="ts">
// 定义 props
interface Props {
  placeholder?: string
  buttonText?: string
  backgroundColor?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '你想看什么呢？',
  buttonText: '搜索',
  backgroundColor: 'rgba(255, 255, 255, 0.34)',
})

// 定义事件
const emit = defineEmits<{
  search: []
  clickButton: []
}>()

const handleSearch = () => {
  emit('search')
}

const handleButtonClick = () => {
  emit('clickButton')
}
</script>

<template>
  <view class="search" :style="{ background: backgroundColor }" @tap="handleSearch">
    <view class="search-left">
      <image class="search-icon" src="@/static/index/search.png"></image>
      <text class="search-text">{{ placeholder }}</text>
    </view>
    <text class="search-button" @tap.stop="handleButtonClick">{{ buttonText }}</text>
  </view>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 76rpx;
  margin: 16rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  border-radius: 38rpx;
  cursor: pointer;
  pointer-events: auto;
}

.search-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
}

.search-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #775796;
}

.search-button {
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  margin-right: 15rpx;
  width: 91rpx;
  height: 38rpx;
  background: #863fce;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
