<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ShSearchBar from '@/components/ShSearchBar.vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
import CustomNavbar from './CustomNavbar.vue'

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

// 筛选项配置
const filterItems = ref([
  { id: 'area', label: '区域', active: false },
  { id: 'price', label: '价格', active: false },
  { id: 'layout', label: '户型', active: false },
  { id: 'type', label: '类型', active: false },
  { id: 'more', label: '更多', active: false },
])

// 抽屉状态
const drawerVisible = ref(false)
const currentFilter = ref<any>(null)

// 锁定鼓弄
const emit = defineEmits<{
  (e: 'drawer-change', visible: boolean): void
}>()

watch(drawerVisible, (val) => {
  emit('drawer-change', val)
})

// 抽屉内的筛选项
const drawerFilterItems = ref([
  { id: 'area', label: '区域', active: false },
  { id: 'price', label: '价格', active: false },
  { id: 'layout', label: '户型', active: false },
  { id: 'type', label: '类型', active: false },
  { id: 'more', label: '更多', active: false },
])

// 筛选选项数据配置
const filterOptionsMap: Record<string, any[]> = {
  area: [
    { id: 'xincheng', label: '新城区', selected: false },
    { id: 'beilin', label: '碑林区', selected: false },
    { id: 'lianhu', selected: false, label: '莲湖区' },
    { id: 'yanta', label: '雁塔区', selected: false },
    { id: 'weiyang', label: '未央区', selected: false },
    { id: 'yanta2', label: '雁塔区', selected: false },
    { id: 'baqiao', label: '灞桥区', selected: false },
    { id: 'lintong', label: '临潼区', selected: false },
    { id: 'changan', label: '长安区', selected: false },
    { id: 'gaoling', label: '高陵区', selected: false },
    { id: 'eyi', label: '鄠邑区', selected: false },
    { id: 'lantian', label: '蓝田县', selected: false },
    { id: 'zhouzhi', label: '周至县', selected: false },
    { id: 'xixian', label: '西安高新技术产业开发区', selected: false },
    { id: 'jingji', label: '经济技术开发区', selected: false },
    { id: 'qujiang', label: '曲江新区', selected: false },
    { id: 'yanliang', label: '阎良国家航空产业基地', selected: false },
    { id: 'chanba', label: '浐灞国际港', selected: false },
    { id: 'minhang', label: '国家民用航天产业基地', selected: false },
  ],
  price: [
    { id: 'p1', label: '50万以下', selected: false },
    { id: 'p2', label: '50-100万', selected: false },
    { id: 'p3', label: '100-150万', selected: false },
    { id: 'p4', label: '150-200万', selected: false },
    { id: 'p5', label: '200-300万', selected: false },
    { id: 'p6', label: '300万以上', selected: false },
  ],
  layout: [
    { id: 'l1', label: '一居', selected: false },
    { id: 'l2', label: '二居', selected: false },
    { id: 'l3', label: '三居', selected: false },
    { id: 'l4', label: '四居', selected: false },
    { id: 'l5', label: '五居及以上', selected: false },
  ],
  type: [
    { id: 't1', label: '普通住宅', selected: false },
    { id: 't2', label: '别墅', selected: false },
    { id: 't3', label: '公寓', selected: false },
    { id: 't4', label: '商住两用', selected: false },
  ],
  more: [
    { id: 'm1', label: '精装修', selected: false },
    { id: 'm2', label: '简装修', selected: false },
    { id: 'm3', label: '毛坯', selected: false },
    { id: 'm4', label: '南北通透', selected: false },
    { id: 'm5', label: '地铁房', selected: false },
    { id: 'm6', label: '学区房', selected: false },
  ],
}

// 当前抽屉显示的选项
const currentOptions = ref<any[]>([])
// ============================================start 选择互斥与混合选择===================================
// 价格分组选项（当 currentFilter 为 price 时启用）
const priceTotalOptions = ref([
  { id: 'pt0', label: '不限', selected: true },
  { id: 'pt1', label: '40万以下', selected: false },
  { id: 'pt2', label: '40-60万', selected: false },
  { id: 'pt3', label: '60-80万', selected: false },
  { id: 'pt4', label: '80-100万', selected: false },
])

const priceUnitOptions = ref([
  { id: 'pu0', label: '不限', selected: true },
  { id: 'pu1', label: '5000元/㎡ 以下', selected: false },
  { id: 'pu2', label: '5000元/㎡ - 8000元/㎡', selected: false },
  { id: 'pu3', label: '8000元/㎡ - 10000元/㎡', selected: false },
])

// 单选工具函数（同组内互斥）
const selectSingle = (list: any[], option: any) => {
  list.forEach((o) => (o.selected = false))
  option.selected = true
}

// 价格选项点击（区分总价与单价）
const handlePriceOptionClick = (group: 'total' | 'unit', option: any) => {
  if (group === 'total') {
    selectSingle(priceTotalOptions.value, option)
  } else {
    selectSingle(priceUnitOptions.value, option)
  }
}

// 更多分组选项
const moreAreaOptions = ref([
  { id: 'ma0', label: '不限', selected: true },
  { id: 'ma1', label: '50㎡以下', selected: false },
  { id: 'ma2', label: '50㎡-70㎡', selected: false },
  { id: 'ma3', label: '70㎡-90㎡', selected: false },
  { id: 'ma4', label: '90㎡-120㎡', selected: false },
])

const moreOrientationOptions = ref([
  { id: 'mo0', label: '不限', selected: true },
  { id: 'mo1', label: '南北', selected: false },
  { id: 'mo2', label: '朝南', selected: false },
  { id: 'mo3', label: '朝东', selected: false },
  { id: 'mo4', label: '朝北', selected: false },
  { id: 'mo5', label: '朝西', selected: false },
  { id: 'mo6', label: '东南', selected: false },
  { id: 'mo7', label: '东北', selected: false },
  { id: 'mo8', label: '西南', selected: false },
  { id: 'mo9', label: '西北', selected: false },
])

const moreFeatureOptions = ref([
  { id: 'mf0', label: '不限', selected: true },
  { id: 'mf1', label: '地铁房', selected: false },
  { id: 'mf2', label: '学区房', selected: false },
  { id: 'mf3', label: '无尾款', selected: false },
  { id: 'mf4', label: '额外奖励', selected: false },
])

// 更多选项点击（区分三组）
const handleMoreOptionClick = (group: 'area' | 'orientation' | 'feature', option: any) => {
  if (group === 'area') {
    selectSingle(moreAreaOptions.value, option)
  } else if (group === 'orientation') {
    selectSingle(moreOrientationOptions.value, option)
  } else {
    selectSingle(moreFeatureOptions.value, option)
  }
}

// 点击筛选项
const handleFilterClick = (item: any) => {
  console.log(safeAreaInsets)
  if (item.active) {
    item.active = false
    drawerVisible.value = false
    currentFilter.value = null
    return
  }

  // 关闭其他项
  filterItems.value.forEach((f) => {
    if (f.id !== item.id) {
      f.active = false
    }
  })

  // 激活当前项
  item.active = true
  currentFilter.value = item

  // 设置当前选项数据
  currentOptions.value = filterOptionsMap[item.id] || []

  // 同步抽屉内的筛选项状态
  drawerFilterItems.value.forEach((f) => {
    f.active = f.id === item.id
  })

  // 打开抽屉
  drawerVisible.value = true
}

// 抽屉内点击筛选项
const handleDrawerFilterClick = (item: any) => {
  // 关闭其他项
  drawerFilterItems.value.forEach((f) => {
    if (f.id !== item.id) {
      f.active = false
    }
  })

  // 切换当前项
  item.active = !item.active

  if (item.active) {
    currentFilter.value = item
    currentOptions.value = filterOptionsMap[item.id] || []
  } else {
    currentFilter.value = null
    currentOptions.value = []
  }
}

// 点击选项
const handleOptionClick = (option: any) => {
  option.selected = !option.selected
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
  filterItems.value.forEach((f) => {
    f.active = false
  })
  drawerFilterItems.value.forEach((f) => {
    f.active = false
  })
  currentFilter.value = null
}

// 重置
const handleReset = () => {
  if (currentFilter.value?.id === 'price') {
    priceTotalOptions.value.forEach((o, i) => (o.selected = i === 0))
    priceUnitOptions.value.forEach((o, i) => (o.selected = i === 0))
    return
  }
  if (currentFilter.value?.id === 'more') {
    moreAreaOptions.value.forEach((o, i) => (o.selected = i === 0))
    moreOrientationOptions.value.forEach((o, i) => (o.selected = i === 0))
    moreFeatureOptions.value.forEach((o, i) => (o.selected = i === 0))
    return
  }
  currentOptions.value.forEach((option) => {
    option.selected = false
  })
}

// 确定
const handleConfirm = () => {
  if (currentFilter.value?.id === 'price') {
    const selectedTotal = priceTotalOptions.value.find((o) => o.selected)
    const selectedUnit = priceUnitOptions.value.find((o) => o.selected)
    const selectedOptions = [selectedTotal, selectedUnit].filter(Boolean)
    console.log('选中的选项-价格', selectedOptions)
    closeDrawer()
    return
  }
  if (currentFilter.value?.id === 'more') {
    const selectedArea = moreAreaOptions.value.find((o) => o.selected)
    const selectedOrientation = moreOrientationOptions.value.find((o) => o.selected)
    const selectedFeature = moreFeatureOptions.value.find((o) => o.selected)
    const selectedOptions = [selectedArea, selectedOrientation, selectedFeature].filter(Boolean)
    console.log('选中的选项-更多', selectedOptions)
    closeDrawer()
    return
  }
  const selectedOptions = currentOptions.value.filter((option) => option.selected)
  console.log('选中的选项', selectedOptions)
  closeDrawer()
}

// 关闭
const handleMaskClick = () => {
  closeDrawer()
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
    <view class="drawer" :class="{ show: drawerVisible }" @touchmove.stop.prevent>
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
        <ShSearchBar placeholder="你想看什么呢?" background-color="#F6F6F6" />
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
              <text class="option-label">{{ option.label }}</text>
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
              <text class="option-label">{{ option.label }}</text>
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
              <text class="option-label">{{ option.label }}</text>
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
              <text class="option-label">{{ option.label }}</text>
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
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="options-flex">
            <view
              v-for="option in currentOptions"
              :key="option.id"
              class="option-item"
              :class="{ selected: option.selected }"
              @tap="handleOptionClick(option)"
            >
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </template>
      </scroll-view>

      <!-- 5. 底部按钮 -->
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

<style lang="scss" scoped>
.filter-container {
  position: relative;
}

.filter-list {
  font-weight: 400;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  color: #030509;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: -12rpx 46rpx 32rpx 46rpx;
  margin-left: 46rpx;
  margin-right: 46rpx;
  position: relative;
  z-index: 10;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 0;
  cursor: pointer;
  transition: all 0.3s ease;

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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
