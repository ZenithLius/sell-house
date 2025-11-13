<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  title: string
  id: string | number
  badge?: boolean
}

const props = defineProps({
  tabs: {
    type: Array as () => TabItem[],
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const activeTab = ref(props.modelValue)

const handleTabClick = (value: string | number) => {
  activeTab.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <view class="consult-tabs">
    <view
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-item"
      :class="{ active: activeTab === tab.id }"
      @tap="handleTabClick(tab.id)"
    >
      <view class="tab-content">
        <text class="tab-label">{{ tab.title }}</text>
        <view v-if="tab.badge" class="badge-dot"></view>
      </view>
      <view v-if="activeTab === tab.id" class="tab-indicator"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.consult-tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  padding: 20rpx 0;
  // border-bottom: 1rpx solid #f5f5f5;
}

.tab-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}

.tab-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #262626;
}

.badge-dot {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 2rpx solid #fff;
}

.tab-indicator {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 39rpx;
  height: 6rpx;
  background: #863fce;
  border-radius: 3rpx;
}
</style>
