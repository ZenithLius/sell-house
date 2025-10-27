<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'选择投资人'"
      :showBack="true"
      class="navbar-fixed"
    />

    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <SearchBox v-model="searchKeyword" placeholder="搜索房源名称" @search="handleSearch" />

      <InvestorList
        :list="investorList"
        :loading="loading"
        :hasMore="hasMore"
        :selectedId="selectedInvestorId"
        @loadMore="handleLoadMore"
        @select="handleSelectInvestor"
      />
      <ShBottomBtns
        :backgroundColor="'#fff'"
        :paddingBottom="130"
        :buttons="bottomButtons"
        @click="handleButtonClick"
      />
    </view>
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import BottomTabbar from './components/BottomTabbar.vue'
import InvestorList from './components/InvestorList.vue'
import { ref } from 'vue'
import SearchBox from './components/SearchBox.vue'

interface InvestorItem {
  id: string | number
  name: string
  phone: string
}

const bottomButtons = [
  {
    text: '取消',
    background: '#FFFFFF;',
    color: '#202020',
  },
  {
    text: '保存',
    background: '#863FCE',
    color: '#ffffff',
  },
]
const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateBack()
  } else if (index === 1) {
    console.log('保存')
  }
}
const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// 搜索和筛选相关
const searchKeyword = ref('')
const dateRange = ref({
  startDate: '',
  endDate: '',
})

// 投资人列表数据
const investorList = ref<InvestorItem[]>([
  { id: 1, name: '投资人1', phone: '1321245678' },
  { id: 2, name: '投资人2', phone: '131***1234' },
  { id: 3, name: '投资人3', phone: '131***1234' },
  { id: 4, name: '投资人4', phone: '131***1234' },
  { id: 5, name: '投资人5', phone: '131***1234' },
  { id: 6, name: '投资人6', phone: '131***1234' },
  { id: 7, name: '投资人7', phone: '131***1234' },
  { id: 8, name: '投资人8', phone: '131***1234' },
  { id: 9, name: '投资人9', phone: '131***1234' },
  { id: 10, name: '投资人10', phone: '131***1234' },
  { id: 11, name: '投资人11', phone: '131***1234' },
  { id: 12, name: '投资人12', phone: '131***1234' },
])
const loading = ref(false)
const hasMore = ref(true)
const selectedInvestorId = ref<string | number | undefined>(undefined)

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

// 加载更多
const handleLoadMore = () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  setTimeout(() => {
    const newData: InvestorItem[] = []
    const startId = investorList.value.length + 1
    for (let i = 0; i < 20; i++) {
      newData.push({
        id: startId + i,
        name: `投资人${startId + i}`,
        phone: '131***1234',
      })
    }
    investorList.value.push(...newData)
    loading.value = false

    // 模拟没有更多数据
    if (investorList.value.length >= 30) {
      hasMore.value = false
    }
  }, 1000)
}

// 选择投资人
const handleSelectInvestor = (id: string | number) => {
  selectedInvestorId.value = id
  console.log('选中的投资人ID:', id)
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}
</style>
