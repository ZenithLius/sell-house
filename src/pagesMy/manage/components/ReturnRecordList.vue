<script setup lang="ts">
import { ref } from 'vue'

interface ReturnRecordItem {
  id: string | number
  status: string // 回款状态
  statusTime: string // 状态时间
  buyerName: string // 收房人
  sellerName: string // 出房人
  totalAmount: number // 回款金额
  houseTime: string // 出房时间
  returnTime: string // 回款时间
  actualHousePrice: number // 实际收房价
  houseCommission: number // 收房中介费
  houseBonus: number // 收房成交奖
  sellingPrice: number // 出房价
  sellingCommission: number // 出房中介费
  sellingBonus: number // 出房成交奖
  renovationCost: number // 装修成本
  waterElectricity: number // 物业水电费
  salesFee: number // 营销费
  otherFee: number // 其他费用
  profit: number // 利润
  note: string // 备注
}

const props = defineProps({
  list: {
    type: Array as () => ReturnRecordItem[],
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
  itemClick: [item: ReturnRecordItem]
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
const handleItemClick = (item: ReturnRecordItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="return-record-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="record-item" @tap="handleItemClick(item)">
        <!-- 头部：回款状态和时间 -->
        <view class="item-header">
          <text class="status-text">回款状态</text>
          <text class="status-time">{{ item.statusTime }}</text>
        </view>

        <!-- 基本信息 -->
        <view class="item-basic">
          <view class="basic-row">
            <text class="label">{{ item.status }}</text>
            <span class="name-label">收房人</span>
            <text class="name-value">{{ item.buyerName }}</text>
            <span class="name-label">出房人</span>
            <text class="name-value">{{ item.sellerName }}</text>
          </view>
          <view class="basic-row">
            <text class="amount-label">回款金额</text>
            <text class="amount-value">¥ {{ item.totalAmount.toFixed(2) }}</text>
          </view>
          <view class="basic-row">
            <text class="time-label">出房时间</text>
            <text class="time-value">{{ item.houseTime }}</text>
          </view>
          <view class="basic-row">
            <text class="time-label">回款时间</text>
            <text class="time-value">{{ item.returnTime }}</text>
          </view>
        </view>

        <!-- 收房信息 -->
        <view class="item-section">
          <view class="section-row">
            <text class="section-label">实际收房价</text>
            <text class="section-value">¥ {{ item.actualHousePrice.toFixed(2) }}</text>
            <text class="section-label right">收房价</text>
            <text class="section-value">¥ {{ item.sellingPrice.toFixed(2) }}</text>
          </view>
          <view class="section-row">
            <text class="section-label">收房中介费</text>
            <text class="section-value">¥ {{ item.houseCommission.toFixed(2) }}</text>
            <text class="section-label right">出房中介费</text>
            <text class="section-value">¥ {{ item.sellingCommission.toFixed(2) }}</text>
          </view>
          <view class="section-row">
            <text class="section-label">收房成交奖</text>
            <text class="section-value">¥ {{ item.houseBonus.toFixed(2) }}</text>
            <text class="section-label right">出房成交奖</text>
            <text class="section-value">¥ {{ item.sellingBonus.toFixed(2) }}</text>
          </view>
        </view>

        <!-- 费用信息 -->
        <view class="item-section">
          <view class="section-row">
            <text class="section-label">装修成本</text>
            <text class="section-value">¥ {{ item.renovationCost.toFixed(2) }}</text>
            <text class="section-label right">物业水电费</text>
            <text class="section-value">¥ {{ item.waterElectricity.toFixed(2) }}</text>
          </view>
          <view class="section-row">
            <text class="section-label">营销费</text>
            <text class="section-value">¥ {{ item.salesFee.toFixed(2) }}</text>
            <text class="section-label right">其他费用</text>
            <text class="section-value">¥ {{ item.otherFee.toFixed(2) }}</text>
          </view>
          <view class="section-row">
            <text class="section-label">利润</text>
            <text class="section-value">¥ {{ item.profit.toFixed(2) }}</text>
            <text class="section-label"></text>
            <text class="section-value"></text>
          </view>
        </view>

        <!-- 备注 -->
        <view v-if="item.note" class="item-note">
          <text class="note-label">备注：</text>
          <text class="note-content">{{ item.note }}</text>
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
        <text class="empty-text">暂无回款记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.return-record-list {
  height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 400rpx);
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 20rpx 30rpx;
}

.record-item {
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 30rpx 15rpx 24rpx 15rpx;

  &:active {
    opacity: 0.95;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.status-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;
}

.status-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.item-basic {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 20rpx;
}

.basic-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  span {
    color: #908c94;
  }
  text {
    color: #1c1c1c;
  }
}

.label {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 40rpx;
}

.name-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 34rpx;
}

.name-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #030509;
  line-height: 34rpx;
}

.amount-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #030509;
  line-height: 34rpx;
}

.amount-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #f9432e !important;
  line-height: 48rpx;
}

.time-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 34rpx;
}

.time-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 48rpx;
  color: #1c1c1c;
}

.item-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 31rpx 24rpx 32rpx 24rpx;
  background: #f8fafa;
  border-radius: 10rpx;
  margin-bottom: 24rpx;
}

.section-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.section-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #908c94 !important;
  line-height: 48rpx;
  flex: 1;

  &.right {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 22rpx;
    color: #1c1c1c;
    line-height: 48rpx;
    text-align: left;
    flex: 1;
    margin-left: 20rpx;
  }
}

.section-value {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 26rpx;
  color: #030509;
  line-height: 34rpx;
  flex: 1;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  margin-top: 8rpx;

  &.profit {
    color: #f9432e;
    font-weight: bold;
    font-size: 28rpx;
  }
}

.item-note {
  display: flex;
  padding: 16rpx;
  border-radius: 8rpx;
  margin-top: 16rpx;
}

.note-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 34rpx;
  flex-shrink: 0;
}

.note-content {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #030509;
  line-height: 34rpx;
  flex: 1;
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
