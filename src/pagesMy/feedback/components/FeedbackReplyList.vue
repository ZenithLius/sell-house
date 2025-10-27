<script setup lang="ts">
import { ref } from 'vue'

interface ReplyFeedbackItem {
  id: string | number
  title: string
  community: string // 所属小区
  content: string // 反馈内容
  date: string // 反馈日期
  replyTime: string // 回复时间
  replyContent: string // 回复内容
}

const props = defineProps({
  list: {
    type: Array as () => ReplyFeedbackItem[],
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
  itemClick: [item: ReplyFeedbackItem]
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

// 点击列表项
const handleItemClick = (item: ReplyFeedbackItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="feedback-reply-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="feedback-item" @tap="handleItemClick(item)">
        <!-- 问题部分 -->
        <view class="question-section">
          <view class="item-title">{{ item.title }}</view>
          <view class="item-info">
            <text class="info-label">所属小区：</text>
            <text class="info-value">{{ item.community }}</text>
          </view>
          <view class="item-info">
            <text class="info-label">反馈内容：</text>
            <text class="info-value">{{ item.content }}</text>
          </view>
          <view class="item-info">
            <text class="info-label">反馈日期：</text>
            <text class="info-value">{{ item.date }}</text>
          </view>
        </view>

        <!-- 回复部分 -->
        <view class="reply-section">
          <image class="reply-icon" src="@/pagesMy/static/reply.png" mode="scaleToFill" />
          <view class="reply-time">回复 {{ item.replyTime }}</view>
          <view class="reply-content">{{ item.replyContent }}</view>
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
        <text class="empty-text">暂无已回复记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.feedback-reply-list {
  height: calc(100vh - 300rpx);
  width: 100%;
  background: #f5f5f5;
}
.reply-icon {
  position: absolute;
  width: 32rpx;
  height: 16rpx;
  left: 10%;
  top: -12rpx;
  transform: translateX(-50%) translateY(-20%);
  z-index: 1;
}

.list-container {
  padding: 25rpx 30rpx;
}

.feedback-item {
  position: relative;
  margin-bottom: 24rpx;
  padding: 37rpx 15rpx 40rpx 15rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

// 问题部分
.question-section {
  .item-title {
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-size: 30rpx;
    color: #030509;
    line-height: 38rpx;
    margin-bottom: 37rpx;
  }

  .item-info {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #6a6a6a;
    line-height: 40rpx;
    margin-bottom: 12rpx;

    &:last-child {
      margin-bottom: 21rpx;
    }
  }

  .info-label {
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
  }
}

// 分隔线
.divider {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30rpx 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1rpx;
    background: #e5e5e5;
  }

  &::before {
    margin-right: 20rpx;
  }

  &::after {
    margin-left: 20rpx;
  }
}

.divider-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #d9d9d9;
  letter-spacing: 2rpx;
}

// 回复部分
.reply-section {
  position: relative;
  background: #f3f5f7;
  border-radius: 20rpx;
  margin-top: 20rpx;
  padding: 24rpx;
}

.reply-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 40rpx;
  margin-bottom: 16rpx;
}

.reply-content {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #333333;
  line-height: 40rpx;
  word-break: break-all;
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
