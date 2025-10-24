<template>
  <view class="collapse-panel">
    <view v-for="(item, index) in items" :key="index" class="collapse-item">
      <view class="collapse-header" @click="toggleItem(index)">
        <text class="collapse-title">{{ item.title }}</text>
        <view class="collapse-right">
          <text :class="getStatusClass(item.status)">{{ item.status }}</text>
          <image
            class="collapse-icon"
            :class="{ 'collapse-icon-active': activeIndex === index }"
            src="/static/my/downLogo.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <view class="collapse-content" :class="{ 'collapse-content-active': activeIndex === index }">
        <view class="collapse-content-inner">
          <view v-if="item.stages && item.stages.length > 0" class="stages-list">
            <view v-for="(stage, stageIndex) in item.stages" :key="stageIndex" class="stage-item">
              <view class="stage-header">
                <view class="stage-left">
                  <view class="stage-dot" :class="getStageStatusClass(stage.status)"></view>
                  <text class="stage-time">{{ stage.time }}</text>
                </view>
                <!-- <text class="stage-status-tag" :class="getStageTagClass(stage.status)">
                  {{ stage.status }}
                </text> -->
              </view>
              <view class="stage-body">
                <text class="stage-title">{{ stage.title }}</text>
                <text class="stage-person">负责人：{{ stage.person }}</text>
                <text class="stage-material">{{ stage.material }}</text>
                <view v-if="stage.images && stage.images.length > 0" class="stage-images">
                  <image
                    v-for="(img, imgIndex) in stage.images"
                    :key="imgIndex"
                    class="stage-image"
                    :src="img"
                    mode="aspectFill"
                    @click="previewImage(stage.images, img)"
                  />
                </view>
              </view>
            </view>
          </view>
          <slot v-else :name="`content-${index}`" :item="item">
            <text class="default-content">{{ item.content || '暂无内容' }}</text>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface StageItem {
  time: string
  status: string
  title: string
  person: string
  material: string
  images?: string[]
}

export interface CollapseItem {
  title: string
  status: string
  content?: string
  stages?: StageItem[]
}

interface Props {
  items: CollapseItem[]
}

defineProps<Props>()

const activeIndex = ref<number | null>(null)

const toggleItem = (index: number) => {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}

const getStageStatusClass = (status: string) => {
  if (status === '已完成') return 'dot-completed'
  if (status.includes('已完成-')) return 'dot-partial'
  return 'dot-pending'
}

const getStageTagClass = (status: string) => {
  if (status === '已完成') return 'tag-completed'
  if (status.includes('已完成-')) return 'tag-partial'
  return 'tag-pending'
}

const getStatusClass = (status: string) => {
  if (status === '未开始') return 'collapse-status'
  return 'status-pending'
}

const previewImage = (images: string[], currentUrl: string) => {
  uni.previewImage({
    urls: images,
    current: currentUrl,
  })
}
</script>

<style lang="scss" scoped>
.collapse-panel {
  width: 100%;
  background: #fff;
}

.collapse-item {
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 32rpx;
  background: #fff;
  transition: background-color 0.3s;

  &:active {
    background-color: #f8f8f8;
  }
}

.collapse-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;
}

.collapse-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.collapse-status {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 42rpx;
}

.collapse-icon {
  width: 16rpx;
  height: 10rpx;
}

.collapse-icon-active {
  transform: rotate(180deg);
}

.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.collapse-content-active {
  max-height: 10000rpx;
}

.collapse-content-inner {
  padding: 0 32rpx 32rpx 32rpx;
}

.default-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.stage-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.stage-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.stage-dot {
  width: 20rpx;
  height: 20rpx;
  background: #863fce;
  border-radius: 50%;
}

.dot-completed {
  background: #8b5cf6;
}

.dot-partial {
  background: #8b5cf6;
}

.dot-pending {
  background: #d1d5db;
}

.status-pending {
  color: #8b5cf6;
  font-weight: 400;
  font-size: 24rpx;
}

.stage-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.tag-completed {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.tag-partial {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.tag-pending {
  color: #6a6a6a;
  background: rgba(106, 106, 106, 0.1);
}

.stage-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.stage-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;
}

.stage-person {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908c94;
  line-height: 42rpx;
}

.stage-material {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 36rpx;
}

.stage-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 8rpx;
}

.stage-image {
  width: calc((100% - 64rpx) / 5);
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
</style>
