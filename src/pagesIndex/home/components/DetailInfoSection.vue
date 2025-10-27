<template>
  <view class="section">
    <view class="title">{{ title }}</view>

    <!-- 标签选择 -->
    <view class="tags-container">
      <!--  :class="{ 'tag-active': selectedTags.includes(index) }" -->
      <view
        v-for="(tag, index) in tags"
        :key="index"
        class="tag-item"
        @tap="handleToggleTag(index)"
      >
        {{ tag }}
      </view>
    </view>

    <!-- 房屋信息 -->
    <view class="house-info">
      <view class="info-item">
        <view class="info-value price">{{ houseInfo.totalPrice }}万</view>
        <view class="info-label">总价</view>
      </view>
      <view class="info-item">
        <view class="info-value">{{ houseInfo.layout }}</view>
        <view class="info-label">户型</view>
      </view>
      <view class="info-item">
        <view class="info-value">{{ houseInfo.area }}</view>
        <view class="info-label">建面</view>
      </view>
    </view>

    <!-- 中介费 -->
    <view class="commission-container">
      <image class="commission-icon" src="/static/images/commission.png" mode="aspectFit"></image>
      <text class="commission-text">{{ houseInfo.commission }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 类型定义
interface HouseInfo {
  totalPrice: string
  layout: string
  area: string
  commission: string
}

// Props
interface Props {
  title?: string
  tags?: string[]
  houseInfo?: HouseInfo
  initialSelectedTags?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  tags: () => [],
  houseInfo: () => ({
    totalPrice: '0',
    layout: '',
    area: '',
    commission: '',
  }),
  initialSelectedTags: () => [],
})

// Emits
const emit = defineEmits<{
  tagChange: [selectedTags: number[]]
}>()

// 已选中的标签索引
const selectedTags = ref<number[]>([...props.initialSelectedTags])

// 切换标签选中状态
const handleToggleTag = (index: number) => {
  const idx = selectedTags.value.indexOf(index)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(index)
  }
  emit('tagChange', selectedTags.value)
}
</script>

<style lang="scss" scoped>
$card-radius: 22rpx;

.section {
  position: relative;
  margin: -80rpx 30rpx 30rpx 30rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: $card-radius;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  z-index: 10;

  .title {
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 34rpx;
    color: #030509;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 24rpx;
    margin-bottom: 32rpx;
  }

  .tag-item {
    font-size: 22rpx;
    color: #7b678f;
    background-color: #f7f5fa;
    padding: 8rpx 20rpx;
    font-weight: 400;
    height: 32rpx;
    border-radius: 4rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .house-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .info-value {
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 36rpx;
    color: #030509;
    margin-bottom: 8rpx;

    &.price {
      font-weight: bold;
      font-size: 40rpx;
      color: #f9432e;
    }
  }

  .info-label {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #797979;
  }

  .commission-container {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 16rpx 20rpx;
    background: #fff3f3;
    border-radius: 8rpx;
  }

  .commission-icon {
    width: 32rpx;
    height: 32rpx;
    flex-shrink: 0;
  }

  .commission-text {
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-size: 24rpx;
    color: #363333;
  }
}
</style>
