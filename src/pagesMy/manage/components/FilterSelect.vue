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
          <template v-if="groupMode">
            <view
              v-for="(group, gIdx) in currentGroups"
              :key="group.key || gIdx"
              class="group-section"
            >
              <view class="group-title">{{ group.title }}</view>
              <view class="group-options">
                <view
                  v-for="(option, idx) in group.options"
                  :key="idx"
                  class="option-item"
                  :class="{
                    selected: tempGroupSelected[getGroupKey(group, gIdx)] === option.value,
                  }"
                  @tap="handleSelectGroupOption(getGroupKey(group, gIdx), option.value)"
                >
                  <text class="option-text">{{ option.label }}</text>
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view
              v-for="(option, idx) in currentOptions"
              :key="idx"
              class="option-item"
              :class="{ selected: tempSelectedValue === option.value }"
              @tap="handleSelectOption(option.value)"
            >
              <text class="option-text">{{ option.label }}</text>
            </view>
          </template>
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
import type { FilterOption, FilterConfig, FilterGroup } from '@/types/filter'

interface Props {
  filters: FilterConfig[]
  modelValue?: Record<number, string | number | Record<string, string | number>> // 支持分组
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  modelValue: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<number, string | number | Record<string, string | number>>]
  filterChange: [filterIndex: number, value: string | number | Record<string, string | number>]
  close: []
}>()

const activeFilters = ref<Record<number, string | number | Record<string, string | number>>>(
  props.modelValue,
)
const showPopup = ref(false)
const currentFilterIndex = ref<number | null>(null)
const currentOptions = ref<FilterOption[]>([])
const currentGroups = ref<FilterGroup[]>([])
const tempSelectedValue = ref<string | number | undefined>(undefined)
const tempGroupSelected = ref<Record<string, string | number | undefined>>({})
// 为每个tab维护临时选择状态
const tempSelections = ref<
  Record<
    number,
    {
      value?: string | number
      groupSelected?: Record<string, string | number | undefined>
    }
  >
>({})

const groupMode = computed(() => currentGroups.value && currentGroups.value.length > 0)
const getGroupKey = (group: FilterGroup, index: number) => group.key || String(index)

const getFilterLabel = (filter: FilterConfig, index: number) => {
  const selectedValue = activeFilters.value[index]
  if (filter.groups && filter.groups.length > 0) {
    if (selectedValue && typeof selectedValue === 'object') {
      const count = Object.values(selectedValue as Record<string, any>).filter(
        (v) => v !== undefined && v !== '' && v !== 'all',
      ).length
      return count > 0 ? `${filter.label}(${count})` : filter.label
    }
    return filter.label
  }
  // 平铺模式
  if (
    selectedValue !== undefined &&
    (typeof selectedValue === 'string' || typeof selectedValue === 'number')
  ) {
    const option = filter.options.find((opt) => opt.value === selectedValue)
    return option ? option.label : filter.label
  }
  return filter.label
}

// 点击过滤器
const handleFilterClick = (index: number) => {
  // 若再次点击当前已展开的项：折叠、清空选中并关闭
  if (currentFilterIndex.value === index && showPopup.value) {
    handleReset()
    // 不关闭弹窗，仅清空内容与状态
    currentFilterIndex.value = null
    currentOptions.value = []
    currentGroups.value = []
    tempSelectedValue.value = undefined
    tempGroupSelected.value = {}
    return
  }

  // 保存当前tab的临时选择
  if (currentFilterIndex.value !== null) {
    tempSelections.value[currentFilterIndex.value] = {
      value: tempSelectedValue.value,
      groupSelected: { ...tempGroupSelected.value },
    }
  }

  const filter = props.filters[index]
  if (!filter || !filter.options || filter.options.length === 0) {
    // 如果无平铺 options，但存在分组，也允许展示
    if (!filter.groups || filter.groups.length === 0) return
  }

  currentFilterIndex.value = index
  // 初始化分组/平铺数据
  if (filter.groups && filter.groups.length > 0) {
    currentGroups.value = filter.groups
    currentOptions.value = []
    // 优先从临时选择中恢复，否则从activeFilters恢复
    const tempData = tempSelections.value[index]
    const prev = tempData?.groupSelected || activeFilters.value[index]
    const init: Record<string, string | number | undefined> = {}
    currentGroups.value.forEach((g, gi) => {
      const k = getGroupKey(g, gi)
      if (tempData?.groupSelected) {
        init[k] = tempData.groupSelected[k]
      } else if (prev && typeof prev === 'object') {
        init[k] = (prev as Record<string, string | number | undefined>)[k]
      } else {
        init[k] = undefined
      }
    })
    tempGroupSelected.value = init
  } else {
    currentGroups.value = []
    currentOptions.value = filter.options
    // 优先从临时选择中恢复，否则从activeFilters恢复
    const tempData = tempSelections.value[index]
    tempSelectedValue.value =
      tempData?.value !== undefined
        ? tempData.value
        : (activeFilters.value[index] as string | number | undefined)
  }
  showPopup.value = true
}

// 关闭弹窗
const handleClosePopup = () => {
  // 保存当前tab的临时选择
  if (currentFilterIndex.value !== null) {
    tempSelections.value[currentFilterIndex.value] = {
      value: tempSelectedValue.value,
      groupSelected: { ...tempGroupSelected.value },
    }
  }

  showPopup.value = false
  currentFilterIndex.value = null
  currentOptions.value = []
  currentGroups.value = []
  tempSelectedValue.value = undefined
  tempGroupSelected.value = {}

  // 通知父组件弹窗已关闭
  emit('close')
}

// 选择选项
const handleSelectOption = (value: string | number) => {
  tempSelectedValue.value = value
}

// 分组内选择（同组单选）
const handleSelectGroupOption = (groupKey: string, value: string | number) => {
  tempGroupSelected.value = {
    ...tempGroupSelected.value,
    [groupKey]: value,
  }
}

// 重置
const handleReset = () => {
  if (groupMode.value) {
    // 清空分组选择
    tempGroupSelected.value = {}
  } else {
    tempSelectedValue.value = undefined
  }

  // 清除当前tab的临时选择
  if (currentFilterIndex.value !== null) {
    delete tempSelections.value[currentFilterIndex.value]
    const newFilters = { ...activeFilters.value }
    delete newFilters[currentFilterIndex.value]
    activeFilters.value = newFilters
    emit('update:modelValue', activeFilters.value)
  }
}

// 确定
const handleConfirm = () => {
  // 保存当前tab的临时选择
  if (currentFilterIndex.value !== null) {
    tempSelections.value[currentFilterIndex.value] = {
      value: tempSelectedValue.value,
      groupSelected: { ...tempGroupSelected.value },
    }
  }

  // 合并所有tab的选择到activeFilters
  const newFilters: Record<number, string | number | Record<string, string | number>> = {
    ...activeFilters.value,
  }

  // 遍历所有临时选择，合并数据并emit filterChange事件
  Object.keys(tempSelections.value).forEach((key) => {
    const index = Number(key)
    const tempData = tempSelections.value[index]
    const filter = props.filters[index]

    if (filter.groups && filter.groups.length > 0) {
      // 分组模式
      const selected: Record<string, string | number> = {}
      let count = 0
      if (tempData?.groupSelected) {
        Object.keys(tempData.groupSelected).forEach((gKey) => {
          const v = tempData.groupSelected![gKey]
          if (v !== undefined && v !== 'all') {
            selected[gKey] = v as string | number
            count++
          }
        })
      }
      if (count > 0) {
        newFilters[index] = selected
      } else {
        delete newFilters[index]
      }
    } else {
      // 平铺模式
      if (tempData?.value !== undefined) {
        newFilters[index] = tempData.value
      } else {
        delete newFilters[index]
      }
    }
  })

  activeFilters.value = newFilters
  emit('update:modelValue', activeFilters.value)

  // 清空所有临时选择
  tempSelections.value = {}

  handleClosePopup()
}
</script>

<style lang="scss" scoped>
.options-scroll {
  min-height: 200rpx;
  max-height: 400rpx;
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
  padding: 0rpx 32rpx 20rpx 32rpx;
  background: #f5f5f5;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  // border-radius: 32rpx;

  // &.active {
  //   background: #efe8f6;

  //   .filter-label {
  //     color: #863fce;
  //   }

  //   .filter-arrow {
  //     color: #863fce;
  //   }
  // }

  // &:active {
  //   opacity: 0.8;
  // }
}

.filter-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #333;
  transition: color 0.3s ease;
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-arrow {
  font-size: 20rpx;
  color: #999;
  transition: all 0.3s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.filter-item.active {
  .filter-label {
    color: #863fce;
  }

  .filter-arrow {
    color: #863fce;
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
  height: auto;
}

.group-section {
  width: 100%;
}

.group-title {
  font-size: 26rpx;
  color: #666;
  margin: 8rpx 0 10rpx 0;
}

.group-options {
  display: flex;
  flex-wrap: wrap;
}

.option-item {
  width: 154rpx;
  height: 62rpx;
  padding: 20rpx 24rpx;
  margin: 10rpx;
  background: #f7f7f7;
  border-radius: 12rpx;
  text-align: center;
  font-size: 26rpx;
  color: #202020;
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
