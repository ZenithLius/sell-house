<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'成交记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <DealRecordList
        :list="recordList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMore"
        @itemClick="handleItemClick"
      />
    </view>

    <BottomTabbar />
    <ShBottomBtns
      :buttons="bottomButtons"
      @click="handleButtonClick"
      :backgroundColor="'#ffffff'"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DealRecordList from './components/DealRecordList.vue'
import BottomTabbar from './components/BottomTabbar.vue'
interface DealRecordItem {
  id: string | number
  time: string
  broker: string
  dealPrice: string
  agencyFee: string
  dealBonus: string
  auditStatus: string
  auditTime?: string
  failReason?: string
  contractImages: string[]
}

const bottomButtons = [
  {
    text: '新增成交',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateTo({
      url: '/pagesMy/authentication/addDeal',
    })
  }
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const recordList = ref<DealRecordItem[]>([
  {
    id: 1,
    time: '2025.09.04 10:00:00',
    broker: '张三',
    dealPrice: '¥ 123456.00元',
    agencyFee: '¥ 10222.00元',
    dealBonus: '¥ 5000.00元',
    auditStatus: '审核失败',
    auditTime: '2025.09.01 10:00:00',
    failReason: '失败原因文字说明',
    contractImages: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    id: 2,
    time: '2025.09.03 15:30:00',
    broker: '李四',
    dealPrice: '¥ 98000.00元',
    agencyFee: '¥ 8000.00元',
    dealBonus: '¥ 3000.00元',
    auditStatus: '审核成功',
    auditTime: '2025.09.02 09:00:00',
    contractImages: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
])

const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

const handleBack = () => {
  uni.navigateBack()
}

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) {
    return
  }

  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData: DealRecordItem[] = [
      {
        id: recordList.value.length + 1,
        time: '2025.09.02 14:20:00',
        broker: '王五',
        dealPrice: '¥ 156000.00元',
        agencyFee: '¥ 12000.00元',
        dealBonus: '¥ 6000.00元',
        auditStatus: '审核中',
        contractImages: [
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        ],
      },
    ]

    recordList.value.push(...newData)
    currentPage.value++

    // 模拟没有更多数据
    if (currentPage.value >= 4) {
      hasMore.value = false
    }

    loading.value = false
  }, 1000)
}

// 点击记录项
const handleItemClick = (item: DealRecordItem) => {
  console.log('点击了记录项:', item)
  // 可以在这里跳转到详情页等
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  height: 100vh;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
