<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import ShSearchBar from '@/components/ShSearchBar.vue'
import CustomNavbar from './CustomNavbar.vue'
import { useFilterState } from '../composables/useFilterState'

// 接收父组件传递的抽屉顶部位置
const props = defineProps<{
  drawerTop?: number
}>()

// 计算遮罩层的样式
const maskStyle = computed(() => {
  return {
    top: props.drawerTop ? `${props.drawerTop}px` : '0px',
  }
})

// 使用共享状态
const {
  filterItems,
  drawerVisible,
  currentFilter,
  drawerFilterItems,
  currentOptions,
  priceTotalOptions,
  priceUnitOptions,
  moreAreaOptions,
  moreOrientationOptions,
  moreFeatureOptions,
  handlePriceOptionClick,
  handleMoreOptionClick,
  handleFilterClick,
  handleDrawerFilterClick,
  handleOptionClick,
  closeDrawer,
  handleReset,
  handleConfirm,
  handleMaskClick,
  getAllSelectedFilters,
  formatPriceLabel,
  formatAreaLabel,
  formatLayoutLabel,
} = useFilterState()

// 搜索关键词
const searchKeyword = ref('')

// 定义 emit 事件
const emit = defineEmits<{
  (e: 'drawer-change', visible: boolean): void
  (e: 'filter-confirm', data: { filters: Record<string, any>; searchKeyword: string }): void
}>()

watch(drawerVisible, (val) => {
  emit('drawer-change', val)
})

// 处理确定按钮点击
const onConfirm = () => {
  handleConfirm((filters) => {
    emit('filter-confirm', {
      filters,
      searchKeyword: searchKeyword.value,
    })
  })
}
</script>

<template>
  <view class="filter-container">
    <view class="filter-list">
      <view
        v-for="item in filterItems"
        :key="item.id"
        class="filter-item"
        :class="{ active: item.active }"
        @tap="handleFilterClick(item)"
      >
        <text class="filter-label">{{ item.label }}</text>
        <text class="filter-icon" :class="{ rotate: item.active }">▼</text>
      </view>
    </view>

    <!-- 遮罩层 -->
    <view
      v-if="drawerVisible"
      class="drawer-mask"
      :style="maskStyle"
      @tap="handleMaskClick"
      @touchmove.stop.prevent
    ></view>

    <!-- 抽屉 -->

    <!--  :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px' }"  -->
    <view
      v-if="drawerVisible"
      class="drawer"
      :class="{ show: drawerVisible }"
      @touchmove.stop.prevent
    >
      <CustomNavbar />
      <!-- 1. 顶部标题栏 -->
      <view class="drawer-header">
        <view class="header-back" @tap="closeDrawer">
          <image class="back-icon" src="/static/tabs/back.png" mode="aspectFit"></image>
        </view>
        <text class="header-title">帮卖房筛选</text>
        <view class="header-placeholder"></view>
      </view>

      <!-- 2. 搜索栏 -->
      <view class="drawer-search">
        <ShSearchBar
          @clickButton="onConfirm"
          v-model="searchKeyword"
          placeholder="你想看什么呢?"
          background-color="#F6F6F6"
        />
      </view>

      <!-- 3. 抽屉内的筛选项 -->
      <view class="drawer-filter-list">
        <view
          v-for="item in drawerFilterItems"
          :key="item.id"
          class="drawer-filter-item"
          :class="{ active: item.active }"
          @tap="handleDrawerFilterClick(item)"
        >
          <text class="drawer-filter-label">{{ item.label }}</text>
          <text class="drawer-filter-icon" :class="{ rotate: item.active }">▼</text>
        </view>
      </view>

      <!-- 4. 数据展示区域 -->
      <scroll-view class="drawer-content" scroll-y>
        <template v-if="currentFilter && currentFilter.id === 'price'">
          <view class="group-title">总价</view>
          <view class="options-flex" style="padding-bottom: 24rpx">
            <view
              v-for="option in priceTotalOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handlePriceOptionClick('total', option)"
            >
              <text class="option-label">{{ formatPriceLabel(option) }}</text>
            </view>
          </view>

          <view class="group-title">单价</view>
          <view class="options-flex">
            <view
              v-for="option in priceUnitOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handlePriceOptionClick('unit', option)"
            >
              <text class="option-label">{{ formatPriceLabel(option) }}</text>
            </view>
          </view>
        </template>
        <template v-else-if="currentFilter && currentFilter.id === 'more'">
          <view class="group-title">建筑面积</view>
          <view class="options-flex" style="padding-bottom: 24rpx">
            <view
              v-for="option in moreAreaOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handleMoreOptionClick('area', option)"
            >
              <text class="option-label">{{ formatAreaLabel(option) }}</text>
            </view>
          </view>

          <view class="group-title">朝向</view>
          <view class="options-flex" style="padding-bottom: 24rpx">
            <view
              v-for="option in moreOrientationOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handleMoreOptionClick('orientation', option)"
            >
              <text class="option-label">{{ option.title }}</text>
            </view>
          </view>

          <view class="group-title">特色</view>
          <view class="options-flex">
            <view
              v-for="option in moreFeatureOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handleMoreOptionClick('feature', option)"
            >
              <text class="option-label">{{ option.title }}</text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="options-flex">
            <view
              v-for="option in currentOptions"
              :key="option.id || option.order_id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handleOptionClick(option)"
            >
              <text class="option-label">
                {{
                  currentFilter?.id === 'layout'
                    ? formatLayoutLabel(option)
                    : option.title || option.label
                }}
              </text>
            </view>
          </view>
        </template>
      </scroll-view>

      <!-- 5. 底部按钮 -->
      <view class="drawer-footer">
        <view class="footer-button reset-button" @tap="handleReset">
          <text class="button-text">重置</text>
        </view>
        <view class="footer-button confirm-button" @tap="onConfirm">
          <text class="button-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.filter-container {
  position: relative;
  background: #fff;
  height: 90rpx;
  width: 100%;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.filter-list {
  font-weight: 400;
  font-size: 28rpx;
  // margin-bottom: 30rpx;
  // margin-top: 30rpx;
  color: #030509;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: -12rpx 46rpx 32rpx 46rpx;
  // margin-left: 46rpx;
  // margin-right: 46rpx;
  position: relative;
  width: 100%;
  z-index: 10;
}

.filter-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 20rpx;
  padding: 8rpx 0;
  transition: all 0.3s ease;
  width: 20%;

  &.active {
    .filter-label {
      color: #863fce;
    }

    .filter-icon {
      color: #863fce;
    }
  }
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  transition: color 0.3s ease;
}

.filter-icon {
  font-size: 20rpx;
  color: #999;
  transition: all 0.3s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  overflow: hidden;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-height: 85vh;
  background-color: #f5f5f5;
  z-index: 999;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0 0 32rpx 32rpx;

  &.show {
    transform: translateY(0);
  }
}

.drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rpx 30rpx 20rpx 30rpx;
  background-color: #fff;
}

.header-back {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 38rpx;
  height: 38rpx;
}

.header-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 29rpx;
  color: #16181b;
}

.header-placeholder {
  display: none;
}

.drawer-search {
  background-color: #fff;
  padding: 0rpx 30rpx 20rpx 30rpx;
}

.drawer-filter-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10rpx 30rpx;
  background-color: #fff;
}

.drawer-filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  transition: all 0.3s ease;

  &.active {
    .drawer-filter-label {
      color: #863fce;
    }

    .drawer-filter-icon {
      color: #863fce;
    }
  }
}

.drawer-filter-label {
  font-size: 28rpx;
  color: #333;
  transition: color 0.3s ease;
}

.drawer-filter-icon {
  font-size: 20rpx;
  color: #999;
  transition: all 0.3s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.drawer-content {
  background-color: #fff;
  flex: 0 1 auto;
  max-height: 50vh;
  padding: 30rpx;
  // overflow-y: auto;
  // margin-bottom: 20rpx;
}

.group-title {
  font-size: 26rpx;
  color: #666;
  margin: 8rpx 0 16rpx;
}

.options-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding-bottom: 100rpx;
}

.option-item {
  background: #f7f7f7;
  border-radius: 12rpx;
  padding: 19rpx 38rpx;
  min-height: 62rpx;
  font-weight: 400;
  font-size: 26rpx;
  text-align: center;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  white-space: nowrap;

  &.selected {
    background-color: #f0e1ff;
    // border-color: #863fce;

    .option-label {
      color: #6c27b3;
    }
  }
}

.option-label {
  font-size: 26rpx;
  color: #333;
  transition: color 0.3s ease;
}

.drawer-footer {
  display: flex;
  background-color: #fff;
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
</style>
