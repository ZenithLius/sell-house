<template>
  <view class="filter-select-wrapper">
    <view class="filter-select-container">
      <view
        v-for="(filter, index) in filters"
        :key="index"
        class="filter-item"
        :class="{ active: activeFilters[index] !== undefined || currentFilterIndex === index }"
        @tap="handleFilterClick(index)"
      >
        <text class="filter-label">{{ getFilterLabel(filter, index) }}</text>
        <text class="filter-arrow" :class="{ rotate: currentFilterIndex === index }">▼</text>
      </view>
    </view>

    <!-- 遮罩层 -->
    <view v-if="showPopup" class="popup-overlay" @tap="handleClosePopup"></view>

    <!-- 弹窗内容 -->
    <view v-if="showPopup" class="popup-content" @tap.stop>
      <view class="options-grid">
        <scroll-view class="options-scroll" scroll-y>
          <view
            v-for="(option, idx) in currentOptions"
            :key="idx"
            class="option-item"
            :class="{ selected: tempSelectedValue === option.value }"
            @tap="handleSelectOption(option.value)"
          >
            <text class="option-text">{{ option.label }}</text>
          </view>
        </scroll-view>
      </view>
      <view class="drawer-footer">
        <view class="footer-button reset-button" @tap="handleReset">
          <text class="button-text">重置</text>
        </view>
        <view class="footer-button confirm-button" @tap="handleConfirm">
          <text class="button-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterConfig {
  label: string // 默认显示的标签
  options: FilterOption[] // 可选项列表
}

interface Props {
  filters: FilterConfig[]
  modelValue?: Record<number, string | number> // 选中的值，key为filter索引，value为选中的值
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  modelValue: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<number, string | number>]
  filterChange: [filterIndex: number, value: string | number]
}>()

const activeFilters = ref<Record<number, string | number>>(props.modelValue)
const showPopup = ref(false)
const currentFilterIndex = ref<number | null>(null)
const currentOptions = ref<FilterOption[]>([])
const tempSelectedValue = ref<string | number | undefined>(undefined)

// 获取过滤器显示的标签
const getFilterLabel = (filter: FilterConfig, index: number) => {
  const selectedValue = activeFilters.value[index]
  if (selectedValue !== undefined) {
    const option = filter.options.find((opt) => opt.value === selectedValue)
    return option ? option.label : filter.label
  }
  return filter.label
}

// 点击过滤器
const handleFilterClick = (index: number) => {
  const filter = props.filters[index]
  if (!filter || !filter.options || filter.options.length === 0) {
    return
  }

  currentFilterIndex.value = index
  currentOptions.value = filter.options
  tempSelectedValue.value = activeFilters.value[index]
  showPopup.value = true
}

// 关闭弹窗
const handleClosePopup = () => {
  showPopup.value = false
  currentFilterIndex.value = null
  currentOptions.value = []
  tempSelectedValue.value = undefined
}

// 选择选项
const handleSelectOption = (value: string | number) => {
  tempSelectedValue.value = value
}

// 重置
const handleReset = () => {
  tempSelectedValue.value = undefined

  if (currentFilterIndex.value !== null) {
    const newFilters = { ...activeFilters.value }
    delete newFilters[currentFilterIndex.value]
    activeFilters.value = newFilters
    emit('update:modelValue', activeFilters.value)
  }
}

// 确定
const handleConfirm = () => {
  if (currentFilterIndex.value !== null) {
    if (tempSelectedValue.value !== undefined) {
      activeFilters.value = {
        ...activeFilters.value,
        [currentFilterIndex.value]: tempSelectedValue.value,
      }
      emit('update:modelValue', activeFilters.value)
      emit('filterChange', currentFilterIndex.value, tempSelectedValue.value)
    } else {
      const newFilters = { ...activeFilters.value }
      delete newFilters[currentFilterIndex.value]
      activeFilters.value = newFilters
      emit('update:modelValue', activeFilters.value)
    }
  }
  handleClosePopup()
}
</script>

<style lang="scss" scoped>
.options-scroll {
  height: 406rpx;
}
.drawer-footer {
  display: flex;
  background-color: none;
  gap: 0;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 0 0 32rpx 32rpx;
}

.footer-button {
  flex: 1;
  height: 110rpx;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &.reset-button {
    background-color: #f5f5f5;

    .button-text {
      color: #666;
    }

    &:active {
      background-color: #e8e8e8;
    }
  }

  &.confirm-button {
    background: #863fce;
    border: 1px solid #863fce;

    .button-text {
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

.button-text {
  font-size: 32rpx;
  font-weight: 500;
}
.filter-select-wrapper {
  position: relative;
}

.filter-select-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  background: #f7f8fc;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  cursor: pointer;

  &.active {
    background: #efe8f6;

    .filter-label {
      color: #863fce;
    }

    .filter-arrow {
      color: #863fce;
    }
  }

  &:active {
    opacity: 0.8;
  }
}

.filter-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #333;
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-arrow {
  font-size: 20rpx;
  color: #999;

  &.rotate {
    transform: rotate(180deg);
  }
}

.popup-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: none;
  animation: none;
}

.popup-content {
  position: absolute;
  top: 98%;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 0rpx 0rpx 38rpx 38rpx;
  max-height: 70vh;
  overflow: hidden;
  z-index: 1000;
  transition: none;
  animation: none;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-top: 20rpx;
  margin-bottom: 40rpx;
  margin-left: 47rpx;
  flex: 1;
  overflow-y: auto;
}

.option-item {
  padding: 20rpx 24rpx;
  margin: 10rpx;
  background: #f7f7f7;
  border-radius: 12rpx;
  text-align: center;
  font-size: 26rpx;
  color: #202020;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &.selected {
    background: #f0e1ff;

    .option-text {
      color: #6c27b3;
      font-size: 26rpx;
      font-weight: 400;
    }
  }

  &:active {
    opacity: 0.8;
  }
}

.option-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
}

.popup-actions {
  display: flex;
  gap: 24rpx;
  padding-top: 24rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  cursor: pointer;

  &.reset {
    background: #f6f6f6;

    .btn-text {
      color: #666;
    }
  }

  &.confirm {
    background: #863fce;

    .btn-text {
      color: #ffffff;
    }
  }

  &:active {
    opacity: 0.8;
  }
}

.btn-text {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  line-height: 44rpx;
}
</style>
