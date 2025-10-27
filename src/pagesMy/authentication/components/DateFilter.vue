<template>
  <view class="date-filter-container" :class="{ 'back-f5': !showLabel }">
    <text v-if="showLabel" class="filter-label">筛选</text>

    <view class="date-picker-wrapper" :class="{ 'back-white': !showLabel }">
      <uni-datetime-picker
        v-model="startDate"
        type="date"
        :clear-icon="false"
        placeholder="开始日期"
        @change="handleStartDateChange"
      >
        <template #default>
          <view class="date-picker-input">
            <text :class="['date-text', { placeholder: !startDate }]">
              {{ startDate || '开始日期' }}
            </text>
          </view>
        </template>
      </uni-datetime-picker>
      <image class="date-icon" src="@/pagesMy/static/date.png"></image>
    </view>

    <image class="date-separator" src="@/pagesMy/static/dateLine.png"></image>

    <view class="date-picker-wrapper" :class="{ 'back-white': !showLabel }">
      <uni-datetime-picker
        v-model="endDate"
        type="date"
        :clear-icon="false"
        placeholder="结束日期"
        @change="handleEndDateChange"
      >
        <template #default>
          <view class="date-picker-input">
            <text :class="['date-text', { placeholder: !endDate }]">
              {{ endDate || '结束日期' }}
            </text>
          </view>
        </template>
      </uni-datetime-picker>
      <image class="date-icon" src="@/pagesMy/static/date.png"></image>
    </view>

    <text v-if="!showLabel" class="filter-reset">重置</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  startDate?: string
  endDate?: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  startDate: '',
  endDate: '',
  showLabel: true,
})

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
  dateChange: [startDate: string, endDate: string]
}>()

const startDate = ref(props.startDate)
const endDate = ref(props.endDate)

const handleStartDateChange = (value: any) => {
  const dateValue = Array.isArray(value) ? value[0] : String(value)
  startDate.value = dateValue
  emit('update:startDate', startDate.value)
  emit('dateChange', startDate.value, endDate.value)
}

const handleEndDateChange = (value: any) => {
  const dateValue = Array.isArray(value) ? value[0] : String(value)
  endDate.value = dateValue
  emit('update:endDate', endDate.value)
  emit('dateChange', startDate.value, endDate.value)
}
</script>

<style lang="scss" scoped>
.date-filter-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  background: #fff;
}
.back-white {
  background: #fff !important;
}

.back-f5 {
  background: #f5f5f5 !important;
}
.filter-reset {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #863fce;
  line-height: 42rpx;
}

.filter-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #030509;
  white-space: nowrap;
}

.date-picker-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 20rpx;
  height: 76rpx;
  background: #f6f6f6;
  border-radius: 38rpx;
  justify-content: space-between;
}

.date-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.date-picker-input {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.date-text {
  font-size: 28rpx;
  color: #333;

  &.placeholder {
    color: #999;
  }
}

.date-separator {
  width: 16rpx;
  height: 3rpx;
}
</style>
