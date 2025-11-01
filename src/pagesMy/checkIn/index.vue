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
    <view class="title" :style="{ top: safeAreaInsets!.top +20 + 'px' }">员工打卡</view>

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
      @loadMore="loadMore"
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

// 打卡次数（这里是模拟数据，实际应该从接口获取）
const checkCount = ref(10000000)

// 打卡记录列表数据
const checkInList = ref([
  {
    id: 1,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 2,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 3,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 4,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 5,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 4,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 5,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 4,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
  {
    id: 5,
    name: '员工姓名',
    time: '2025.09.01 10:00:00',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
])

const listLoading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

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
  // TODO: 根据选中的年月，调用接口获取打卡次数和记录列表
  console.log('选中的日期：', year, month)
  // 重置列表
  currentPage.value = 1
  checkInList.value = []
  loadCheckInList()
}

// 加载打卡记录列表
const loadCheckInList = async () => {
  if (listLoading.value) return
  listLoading.value = true

  // TODO: 调用接口获取数据
  // 模拟接口请求
  setTimeout(() => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: currentPage.value * 10 + i + 1,
      name: '员工姓名',
      time: '2025.09.01 10:00:00',
      image: 'https://via.placeholder.com/120',
    }))

    checkInList.value = [...checkInList.value, ...mockData]
    listLoading.value = false

    // 模拟没有更多数据
    if (currentPage.value >= 3) {
      hasMore.value = false
    }
  }, 500)
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || listLoading.value) return
  currentPage.value++
  loadCheckInList()
}

const handleBack = () => {
  uni.navigateBack()
}
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
