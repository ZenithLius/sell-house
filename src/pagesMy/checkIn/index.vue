<template>
  <view class="viewport">
    <view class="header-bg">
      <image class="bg-image" src="@/pagesMy/static/checkBg.png"></image>
    </view>
    <view class="back" :style="{ top: safeAreaInsets!.top +10 + 'px' }">
      <image
        class="back-icon"
        @tap="handleBack"
        src="/static/tabs/back.png"
        mode="aspectFit"
      ></image>
    </view>
    <view class="title" :style="{ top: safeAreaInsets!.top +20 + 'px' }">{{ topTitle }}</view>

    <view class="checkRecord">
      <view class="left">打卡记录</view>
      <view class="right" @tap="handleCheck"
        ><view class="right">打卡</view>
        <image class="right-icon" src="@/pagesMy/static/checkArrow.png"></image
      ></view>
    </view>

    <view class="checkDate" @tap="showDatePicker">
      <view class="date-label">选择日期</view>
      <view class="date-value">{{ selectedDate }}</view>
      <view class="check-count">打卡：{{ checkCount }}次</view>
    </view>

    <!-- 打卡记录列表 -->
    <CheckInList
      :list="checkInList"
      :loading="listLoading"
      :hasMore="hasMore"
      :refreshing="refreshing"
      @loadMore="loadMore"
      @refresh="handleRefresh"
    />

    <!-- 日期选择器 -->
    <DatePicker
      v-model:show="datePickerVisible"
      :defaultYear="currentYear"
      :defaultMonth="currentMonth"
      @confirm="handleDateConfirm"
    />
  </view>
  <ShBottomTabbar />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DatePicker from './components/DatePicker.vue'
import CheckInList from './components/CheckInList.vue'
import { checkInListAPI, type CheckInItem } from '../services/staff'
import { onShow } from '@dcloudio/uni-app'

const { safeAreaInsets } = uni.getSystemInfoSync()

// 当前日期
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)

// 日期选择器显示状态
const datePickerVisible = ref(false)

// 选中的日期显示
const selectedDate = computed(() => {
  return `${currentYear.value}.${currentMonth.value}`
})

// 打卡记录列表数据
const checkInList = ref<CheckInItem[]>([])

const listLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const refreshing = ref(false)
const perPage = 10

// 显示日期选择器
const showDatePicker = () => {
  datePickerVisible.value = true
}

const handleCheck = () => {
  uni.navigateTo({
    url: '/pagesMy/checkIn/actionCheckIn',
  })
}

// 确认选择日期
const handleDateConfirm = (year: number, month: number) => {
  currentYear.value = year
  currentMonth.value = month
  // 重置列表
  resetList()
}

/**
 * ==========================================================================
 *                                 @异步请求
 * ==========================================================================
 */

// 重置列表
const resetList = () => {
  currentPage.value = 1
  checkInList.value = []
  hasMore.value = true
  loadCheckInList()
}

// 加载打卡记录列表
const loadCheckInList = async () => {
  if (listLoading.value) return
  listLoading.value = true

  try {
    const res = await checkInListAPI({
      month: `${currentYear.value}-${currentMonth.value}`,
      type: currentType.value, //1 员工 2 经理
      page: currentPage.value,
      per_page: perPage,
    })

    if (res.code === 200) {
      const newList = res.data.list || []
      if (currentPage.value === 1) {
        checkInList.value = newList
        checkCount.value = res.data.total as number
      } else {
        checkInList.value = [...checkInList.value, ...newList]
      }

      if (newList.length < perPage) {
        hasMore.value = false
      }
    }
  } catch (error) {
    console.error('加载打卡记录失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    listLoading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || listLoading.value) return
  currentPage.value++
  loadCheckInList()
}

// 下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  currentPage.value = 1
  hasMore.value = true

  try {
    const res = await checkInListAPI({
      month: `${currentYear.value}-${currentMonth.value}`,
      type: currentType.value,
      page: 1,
      per_page: perPage,
    })

    if (res.code === 200) {
      checkInList.value = res.data.list || []
      checkCount.value = res.data.total as number

      if ((res.data.list || []).length < perPage) {
        hasMore.value = false
      }
    }
  } catch (error) {
    console.error('刷新失败：', error)
  } finally {
    refreshing.value = false
  }
}

const handleBack = () => {
  uni.navigateBack()
}

const checkCount = ref(0)
const currentType = ref('1')
const topTitle = ref('员工打卡')
onShow(() => {
  const currentRole = uni.getStorageSync('currentOtherManageType')
  console.log('当前角色：', currentRole)
  if (currentRole === 'manager') {
    currentType.value = '2'
    topTitle.value = '经理打卡'
  } else {
    currentType.value = '1'
    topTitle.value = '员工打卡'
  }
  resetList()
})
</script>

<style lang="scss">
.viewport {
  height: 100vh;
  background-color: #fff;
  padding-bottom: 54rpx;
  .bg-image {
    width: 100%;
    height: 245rpx;
  }
  .checkRecord {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 34rpx;
      color: #303133;
      line-height: 42rpx;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 28rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 34rpx;
      color: #863fce;
      line-height: 42rpx;
    }
  }
  .footer {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  .right-icon {
    height: 22rpx;
    width: 12rpx;
  }
  .back {
    position: absolute;
    left: 38rpx;
    top: 0;
    .back-icon {
      width: 38rpx;
      height: 38rpx;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
  .checkRecord {
    height: 99rpx;
    background: #ffffff;
    border-radius: 18rpx;
    margin-top: -55rpx;
    z-index: 20;
    position: relative;
    padding: 33rpx 37rpx 34rpx 33rpx;
    margin-left: 30rpx;
    margin-right: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  }
  .checkDate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 99rpx;
    background: #ffffff;
    border-radius: 18rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    padding: 0 37rpx 0 33rpx;
    margin-right: 30rpx;
    .date-label {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 30rpx;
      color: #863fce;
      line-height: 42rpx;
      background: rgba(134, 63, 206, 0.13);
      border-radius: 26rpx;
      padding: 8rpx 20rpx;
    }
    .date-value {
      flex: 1;
      margin-left: 30rpx;
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #303133;
      line-height: 42rpx;
    }
    .check-count {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #303133;
      line-height: 42rpx;
    }
  }
}
</style>
