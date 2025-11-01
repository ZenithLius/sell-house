<script setup lang="ts">
import { ref } from 'vue'

interface MessageItem {
  id: string | number
  title: string
  date: string
  houseCode: string // 房源编号
  houseName: string // 房源名称
}

const props = defineProps({
  list: {
    type: Array as () => MessageItem[],
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
  itemClick: [item: MessageItem]
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

// 点击查看详情
const handleViewDetail = (item: MessageItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="message-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="message-item">
        <!-- 头部：图标、标题、日期 -->
        <view class="item-header">
          <view class="header-left">
            <image class="message-logo" src="@/pagesMy/static/messageLogo.png" mode="aspectFill" />
            <text class="item-title">{{ item.title }}</text>
          </view>
          <text class="item-date">{{ item.date }}</text>
        </view>

        <!-- 内容 -->
        <view class="item-content">
          <view class="content-row">
            <text class="content-label">房源编号：</text>
            <text class="content-value">{{ item.houseCode }}</text>
          </view>
          <view class="content-row">
            <text class="content-label">房源名称：</text>
            <text class="content-value">{{ item.houseName }}</text>
          </view>
        </view>

        <!-- 底部：查看详情按钮 -->
        <view class="item-footer" @tap="handleViewDetail(item)">
          <text class="footer-text">查看详情</text>
          <image class="arrow-icon" src="@/pagesMy/static/messageRight.png" mode="aspectFit" />
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
        <text class="empty-text">暂无消息</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.message-list {
  height: calc(100vh - env(safe-area-inset-bottom));
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 25rpx 30rpx;
}

.message-item {
  margin-bottom: 24rpx;
  padding: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

// 头部
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26rpx;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.message-logo {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 21rpx;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 30rpx;
  color: #030509;
  line-height: 38rpx;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-date {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  flex-shrink: 0;
  margin-left: 20rpx;
}

.item-content {
  margin-bottom: 26rpx;
}

.content-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  line-height: 40rpx;
  min-width: 0;

  &:last-child {
    margin-bottom: 0;
  }
}

.content-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
  flex-shrink: 0;
}

.content-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #e8e4ed;
}

.footer-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 40rpx;
}

.arrow-icon {
  width: 10rpx;
  height: 18rpx;
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
