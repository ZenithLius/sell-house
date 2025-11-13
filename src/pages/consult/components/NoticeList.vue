<script setup lang="ts">
import { ref } from 'vue'

interface NoticeItem {
  id: string | number
  title: string
  create_time: string
  add_time: string
  cover_url: string
  subtitle: string
}

const props = defineProps({
  list: {
    type: Array as () => NoticeItem[],
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
  itemClick: [item: NoticeItem]
}>()

// 点击列表项
const handleItemClick = (item: NoticeItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <view class="notice-list">
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="notice-item" @tap="handleItemClick(item)">
        <view class="item-content">
          <image class="label-icon" src="/static/consult/label1.png" mode="aspectFit" />
          <view class="item-main">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-date">{{ item.create_time }}</text>
          </view>
        </view>
        <image class="quote-icon" src="/static/consult/label2.png" mode="aspectFit" />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无公告</text>
      </view>

      <view class="space" :style="{ height: '100rpx' }"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.notice-list {
  width: 100%;
}

.list-container {
  padding-top: 20rpx;
}

.notice-item {
  position: relative;
  margin: 0 30rpx 24rpx;
  padding: 34rpx 18rpx;
  background: #faf5ff;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: 13rpx;
  position: relative;
  z-index: 1;
}

.label-icon {
  width: 34rpx;
  height: 34rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 30rpx;
  color: #1a1a1e;
  line-height: 44rpx;
  word-break: break-all;
}

.item-date {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #959595;
  line-height: 42rpx;
}

.quote-icon {
  position: absolute;
  right: 0rpx;
  bottom: 0rpx;
  width: 89rpx;
  height: 68rpx;
  opacity: 0.3;
  z-index: 0;
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
