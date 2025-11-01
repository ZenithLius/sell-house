<template>
  <view class="date-picker-popup" v-if="show" @tap="handleMaskClick">
    <view class="picker-content" @tap.stop>
      <view class="picker-header">请选择</view>

      <view class="picker-body">
        <view class="picker-columns">
          <!-- 年份列 -->
          <picker-view
            class="picker-view"
            :indicator-style="indicatorStyle"
            :value="[yearIndex]"
            @change="onYearChange"
          >
            <picker-view-column>
              <view v-for="year in years" :key="year" class="picker-item">{{ year }}年</view>
            </picker-view-column>
          </picker-view>

          <!-- 月份列 -->
          <picker-view
            class="picker-view"
            :indicator-style="indicatorStyle"
            :value="[monthIndex]"
            @change="onMonthChange"
          >
            <picker-view-column>
              <view v-for="month in months" :key="month" class="picker-item">{{ month }}月</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>

      <view class="picker-footer">
        <view class="btn-cancel" @tap="handleCancel">取消</view>
        <view class="btn-confirm" @tap="handleConfirm">确认</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  show: boolean
  defaultYear?: number
  defaultMonth?: number
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm', year: number, month: number): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  defaultYear: () => new Date().getFullYear(),
  defaultMonth: () => new Date().getMonth() + 1,
})

const emit = defineEmits<Emits>()

// 生成年份列表（当前年份前后各5年）
const currentYear = new Date().getFullYear()
const years = ref<number[]>([])
for (let i = currentYear - 5; i <= currentYear + 5; i++) {
  years.value.push(i)
}

// 生成月份列表
const months = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

// 选中的索引
const yearIndex = ref(0)
const monthIndex = ref(0)

// 选中的年月
const selectedYear = computed(() => years.value[yearIndex.value])
const selectedMonth = computed(() => months.value[monthIndex.value])

// 中间选中区域的样式
const indicatorStyle =
  'height: 90rpx; background: rgba(134, 63, 206, 0.14); border-radius: 18rpx; margin: 0 20rpx;'

// 初始化索引
const initIndex = () => {
  yearIndex.value = years.value.findIndex((y) => y === props.defaultYear)
  if (yearIndex.value === -1) yearIndex.value = 5 // 默认选中当前年份
  monthIndex.value = props.defaultMonth - 1
}

// 监听显示状态变化
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      initIndex()
    }
  },
  { immediate: true },
)

// 年份改变
const onYearChange = (e: any) => {
  yearIndex.value = e.detail.value[0]
}

// 月份改变
const onMonthChange = (e: any) => {
  monthIndex.value = e.detail.value[0]
}

const handleMaskClick = () => {
  emit('update:show', false)
}

const handleCancel = () => {
  emit('update:show', false)
}

const handleConfirm = () => {
  emit('confirm', selectedYear.value, selectedMonth.value)
  emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.date-picker-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.picker-content {
  width: 100%;
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.picker-header {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 31rpx;
  color: #020202;
  line-height: 42rpx;
}

.picker-body {
  padding: 40rpx 0;
  position: relative;
}

.picker-columns {
  display: flex;
  justify-content: center;
  padding: 0 40rpx;
}

.picker-view {
  flex: 1;
  height: 400rpx;
}

.picker-item {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #606266;
  line-height: 80rpx;
}

.picker-footer {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  padding: 24rpx 40rpx 40rpx;
}

.btn-cancel,
.btn-confirm {
  width: 248rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
}

.btn-cancel {
  background: #ffffff;
  border-radius: 10rpx;
  border: 2px solid #eaeaea;
  color: #606266;
  color: #202020;
}

.btn-confirm {
  background: #863fce;
  border-radius: 10rpx;
  color: #ffffff;
}
</style>
