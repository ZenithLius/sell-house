<script setup lang="ts">
import { ref } from 'vue'

interface ContactItem {
  id: string | number
  title: string
  time: string // 服务时间
  phone: string // 电话号码
}

const props = defineProps({
  list: {
    type: Array as () => ContactItem[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  loadMore: []
  makeCall: [phone: string]
}>()

const scrollTop = ref(0)
const isLoadingMore = ref(false)

// 触底加载
const handleScrollToLower = () => {
  if (isLoadingMore.value || !props.hasMore || props.loading) {
    return
  }
  isLoadingMore.value = true
  emit('loadMore')
  setTimeout(() => {
    isLoadingMore.value = false
  }, 500)
}

// 拨打电话
const handleMakeCall = (phone: string) => {
  emit('makeCall', phone)
}
</script>

<template>
  <scroll-view
    class="contact-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="contact-item">
        <!-- 左侧图标 -->
        <view class="icon-wrapper">
          <image class="phone-icon" src="@/static/my/contactPhone.png" mode="aspectFit" />
        </view>

        <!-- 中间内容 -->
        <view class="item-content">
          <text class="item-title">{{ item.title }} ({{ item.time }})</text>
          <text class="item-phone">{{ item.phone }}</text>
        </view>

        <!-- 右侧按钮 -->
        <view class="call-button" @tap="handleMakeCall(item.phone)">
          <text class="button-text">打电话</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading || isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
        <view class="space" :style="{ height: '200rpx' }"></view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无客服信息</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.contact-list {
  height: calc(100vh - 200rpx);
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 29rpx 30rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 41rpx 30rpx 38rpx 33rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

// 图标容器
.icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 24rpx;
}

.phone-icon {
  width: 72rpx;
  height: 75rpx;
}

// 内容区域
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #9f9f9f;
}

.item-phone {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #393939;
}

.call-button {
  width: 114rpx;
  height: 48rpx;
  background: #ffffff;
  border-radius: 24rpx;
  border: 1px solid rgba(63, 92, 151, 0.33);
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 22rpx;
  color: #426aff;
  line-height: 32rpx;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #bfbfbf;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #bfbfbf;
}
</style>
