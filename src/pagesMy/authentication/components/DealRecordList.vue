<script setup lang="ts">
import { ref } from 'vue'

const handleAudit = (item: DealRecordItem) => {
  emit('audit', item)
}

interface DealRecordItem {
  id: string | number
  time: string
  broker: string // 成交经纪人
  dealPrice: string // 成交价格
  agencyFee: string // 出房中介费
  dealBonus: string // 出房成交奖
  auditStatus: string // 审核状态
  auditTime?: string // 审核时间
  failReason?: string // 失败原因
  contractImages: string[] // 成交合同图片
}

const props = defineProps({
  list: {
    type: Array as () => DealRecordItem[],
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

const currentRole = uni.getStorageSync('currentOtherManageType')

const emit = defineEmits<{
  loadMore: []
  itemClick: [item: DealRecordItem]
  audit: [item: DealRecordItem]
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

// 点击记录项
const handleItemClick = (item: DealRecordItem) => {
  emit('itemClick', item)
}

// 预览图片
const previewImage = (images: string[], currentUrl: string) => {
  uni.previewImage({
    urls: images,
    current: currentUrl,
  })
}

// 判断审核状态是否失败
const isAuditFailed = (status: string) => {
  return status.includes('失败')
}

// 判断审核状态是否成功
const isAuditSuccess = (status: string) => {
  return status.includes('成功')
}
</script>

<template>
  <scroll-view
    class="deal-record-list"
    :class="{ 'has-bottom-btn': currentRole === 'manager' }"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="record-item">
        <!-- 标题和时间 -->
        <view class="record-header">
          <text class="record-title">成交状态</text>
          <text class="record-time">{{ item.time }}</text>
        </view>

        <!-- 详情信息 -->
        <view class="record-content">
          <!-- 成交经纪人 -->
          <view class="info-row">
            <text class="info-label">成交经纪人</text>
            <text class="info-value">{{ item.broker }}</text>
          </view>

          <!-- 成交价格 -->
          <view class="info-row">
            <text class="info-label">成交价格</text>
            <text class="info-value">{{ item.dealPrice }}</text>
          </view>

          <!-- 出房中介费 -->
          <view class="info-row">
            <text class="info-label">出房中介费</text>
            <text class="info-value">{{ item.agencyFee }}</text>
          </view>

          <!-- 出房成交奖 -->
          <view class="info-row">
            <text class="info-label">出房成交奖</text>
            <text class="info-value">{{ item.dealBonus }}</text>
          </view>

          <!-- 审核状态 -->
          <view class="info-row">
            <text class="info-label">审核状态</text>
            <text
              class="info-value"
              :class="{
                'status-failed': isAuditFailed(item.auditStatus),
                'status-success': isAuditSuccess(item.auditStatus),
              }"
            >
              {{ item.auditStatus }}
              <text v-if="item.auditTime" class="audit-time">（{{ item.auditTime }}）</text>
            </text>
          </view>

          <!-- 失败原因 -->
          <view v-if="item.failReason" class="info-row">
            <text class="info-label">失败原因</text>
            <text class="info-value">{{ item.failReason }}</text>
          </view>

          <!-- 成交合同 -->
          <view
            v-if="item.contractImages && item.contractImages.length > 0"
            class="contract-section"
          >
            <text class="contract-label">成交合同</text>
            <view class="contract-images">
              <image
                v-for="(img, imgIndex) in item.contractImages"
                :key="imgIndex"
                class="contract-image"
                :src="img"
                mode="aspectFill"
                @click="previewImage(item.contractImages, img)"
              />
            </view>
          </view>

          <!-- 待审核的显示审核按钮 -->
          <view
            v-if="item.auditStatus === '待审核' && currentRole === 'manager'"
            class="action-section"
          >
            <view class="action-btn" @tap="handleAudit(item)">成交审核</view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading || isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无成交记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.deal-record-list {
  flex: 1;
  width: 100%;
  height: calc(100vh - env(safe-area-inset-bottom) - 400rpx);
  background: #fff;
}
.has-bottom-btn {
  height: calc(100vh - env(safe-area-inset-bottom) - 260rpx);
}
.action-btn {
  width: 236rpx;
  height: 63rpx;
  background: #863fce;
  border-radius: 20rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #ffffff;
  line-height: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto;
  margin-top: 30rpx;
}

.list-container {
  padding: 0 30rpx 30rpx 30rpx;
}

.record-item {
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rpx 30rpx 30rpx 20rpx;
  border-bottom: 1px solid #f3f3f3;
}

.record-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;
}

.record-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.record-content {
  padding: 30rpx 15rpx 30rpx 15rpx;
  background: #f8fafa;
  border-radius: 10rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908c94;
  line-height: 48rpx;
  width: 168rpx;
}

.info-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #1c1c1c;
  flex: 1;
  margin-left: 20rpx;
  text-align: start;
}

.status-failed {
  color: #ff0000;
}

.status-success {
  color: #00b050;
}

.audit-time {
  font-size: 24rpx;
  color: inherit;
}

.contract-section {
  margin-top: 30rpx;
  border-top: 1px solid #f3f3f3;
}

.contract-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #908c94;
  line-height: 42rpx;
  display: block;
  margin-bottom: 20rpx;
}

.contract-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.contract-image {
  width: calc((100% - 64rpx) / 5);
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
  background: #f5f5f5;
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
