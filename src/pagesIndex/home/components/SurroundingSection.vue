<template>
  <view class="surrounding-section">
    <view class="section-title">{{ title }}</view>

    <!-- Tab 选择器 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @tap="handleTabChange(tab.key)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <view v-if="activeTab === tab.key" class="tab-underline"></view>
      </view>
    </view>

    <!-- 交通内容 -->
    <view v-if="activeTab === 'traffic'" class="content">
      <!-- 地铁 -->
      <view v-if="trafficData.subway && trafficData.subway.length > 0" class="traffic-group">
        <view
          v-for="(item, index) in trafficData.subway"
          :key="'subway-' + index"
          class="traffic-item"
        >
          <!-- <image class="traffic-icon" src="/static/index/underground.png" mode="aspectFit"></image> -->
          <text class="traffic-text">{{ item }}</text>
        </view>
      </view>
      <view v-else class="content">
        <view class="empty-content">暂无数据</view>
      </view>
    </view>

    <!-- 教育内容 -->
    <view v-if="activeTab === 'education'" class="content">
      <!-- 地铁 -->
      <view v-if="trafficData.edu && trafficData.edu.length > 0" class="traffic-group">
        <view
          v-for="(item, index) in trafficData.edu"
          :key="'subway-' + index"
          class="traffic-item"
        >
          <!-- <image class="traffic-icon" src="/static/index/underground.png" mode="aspectFit"></image> -->
          <text class="traffic-text">{{ item }}</text>
        </view>
      </view>

      <view v-else class="content">
        <view class="empty-content">暂无数据</view>
      </view>
    </view>

    <!-- 医疗 -->
    <view v-if="activeTab === 'medical'" class="content">
      <!-- 地铁 -->
      <view v-if="trafficData.med && trafficData.med.length > 0" class="traffic-group">
        <view
          v-for="(item, index) in trafficData.med"
          :key="'subway-' + index"
          class="traffic-item"
        >
          <!-- <image class="traffic-icon" src="/static/index/underground.png" mode="aspectFit"></image> -->
          <text class="traffic-text">{{ item }}</text>
        </view>
      </view>

      <view v-else class="content">
        <view class="empty-content">暂无数据</view>
      </view>
    </view>

    <!-- 生活 -->
    <view v-if="activeTab === 'life'" class="content">
      <!-- 地铁 -->
      <view v-if="trafficData.life && trafficData.life.length > 0" class="traffic-group">
        <view
          v-for="(item, index) in trafficData.life"
          :key="'subway-' + index"
          class="traffic-item"
        >
          <!-- <image class="traffic-icon" src="/static/index/underground.png" mode="aspectFit"></image> -->
          <text class="traffic-text">{{ item }}</text>
        </view>
      </view>
      <view v-else class="content">
        <view class="empty-content">暂无数据</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 类型定义
export interface TrafficData {
  subway?: string[] // 地铁信息
  edu?: string[] // 教育信息
  med?: string[] //医疗
  life?: string[] //生活
}

export interface TabItem {
  key: string
  label: string
}

// Props
interface Props {
  title?: string
  tabs?: TabItem[]
  trafficData?: TrafficData
}

const props = withDefaults(defineProps<Props>(), {
  title: '周边配套',
  tabs: () => [
    { key: 'traffic', label: '交通' },
    { key: 'education', label: '教育' },
    { key: 'medical', label: '医疗' },
    { key: 'life', label: '生活' },
  ],
  trafficData: () => ({
    subway: [],
    bus: [],
  }),
})

// 当前激活的Tab
const activeTab = ref<string>('traffic')

// Tab切换
const handleTabChange = (key: string) => {
  activeTab.value = key
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';
.surrounding-section {
  margin: 30rpx;
  padding: 39rpx 74rpx 39rpx 17rpx;
  background: #ffffff;
  border-radius: 22rpx;
  box-shadow: $uni-box-shadow;
}

.section-title {
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 32rpx;
  color: #212121;
  margin-bottom: 28rpx;
}

.tabs {
  display: flex;
  gap: 48rpx;
  margin-bottom: 32rpx;
}

.tab-item {
  position: relative;
  padding-bottom: 16rpx;
  cursor: pointer;
}

.tab-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #797979;
  transition: color 0.3s;
}

.tab-item.active .tab-text {
  font-weight: 500;
  color: #212121;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background: #863fce;
  border-radius: 3rpx;
}

// 内容区域
.content {
  padding-top: 8rpx;
}

.traffic-group {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 30rpx;
}

.traffic-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.traffic-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.traffic-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #797979;
  line-height: 1.6;
  flex: 1;
}

.empty-content {
  text-align: center;
  padding: 60rpx 0;
  font-size: 28rpx;
  color: #999999;
}
</style>
