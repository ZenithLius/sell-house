<template>
  <view class="basic-info-section">
    <view class="section-title">{{ title }}</view>
    <view class="info-grid">
      <view
        v-for="(item, index) in infoList"
        :key="index"
        class="info-row"
        :class="{ 'full-width': item.fullWidth }"
      >
        <view class="info-label">{{ item.label }}</view>
        <view class="info-value">{{ item.value }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 类型定义
export interface InfoItem {
  label: string
  value: string | number
  fullWidth?: boolean // 是否占满整行
}

// Props
interface Props {
  title?: string
  infoList?: InfoItem[]
}

withDefaults(defineProps<Props>(), {
  title: '基本信息',
  infoList: () => [],
})
</script>

<style lang="scss" scoped>
.basic-info-section {
  margin: 30rpx;
  padding: 39rpx 74rpx 39rpx 16rpx;
  background: #ffffff;
  border-radius: 22rpx;
  box-shadow: $uni-box-shadow;
}

.section-title {
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 32rpx;
  color: #212121;
  margin-bottom: 29rpx;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-row {
  width: 50%;
  display: flex;
  margin-bottom: 32rpx;

  &.full-width {
    width: 100%;
    flex-direction: row;

    .info-label {
      flex-shrink: 0;
    }

    .info-value {
      flex: 1;
      text-align: left;
    }
  }
}

.info-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  width: 116rpx;
  font-size: 26rpx;
  color: #797979;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.info-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #212121;
  flex: 1;
  word-break: break-all;
}
</style>
