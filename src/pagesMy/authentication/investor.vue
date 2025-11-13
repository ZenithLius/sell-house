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
      <SearchBox v-model="searchKeyword" placeholder="搜索投资人" @search="handleSearch" />

      <InvestorList
        :list="investorList"
        :loading="loading"
        :hasMore="hasMore"
        :selectedId="selectedInvestorId"
        @loadMore="handleLoadMore"
        @select="handleSelectInvestor"
      />
    </view>
    <ShBottomBtns
      :backgroundColor="'#ffffff'"
      :paddingBottom="20"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
    <!-- <BottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
import BottomTabbar from './components/BottomTabbar.vue'
import InvestorList from './components/InvestorList.vue'
import { ref } from 'vue'
import SearchBox from './components/SearchBox.vue'
import { investorListAPI, setInvestorAPI } from '../services/staff'
import { onLoad } from '@dcloudio/uni-app'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

onLoad((options) => {
  houseListId.value = options?.house_list_id
  getInvestorListReq()
})

/**
 * ==================================搜索投资人========================================
 */

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  searchKeyword.value = keyword
  getInvestorListReq()
}

const getInvestorListReq = async () => {
  const params = {
    keyword: searchKeyword.value,
    type: 1,
    // 1投资人，2经纪人，3装修负责人
  }
  const res = await investorListAPI(params)
  investorList.value = res.data.list
}

interface InvestorItem {
  id: string | number
  nickname: string
  mobile: string
}

const bottomButtons = [
  {
    text: '取消',
    background: '#fff',
    color: '#202020',
  },
  {
    text: '保存',
    background: '#863FCE',
    color: '#ffffff',
  },
]

const houseListId = ref<string | number | undefined>(undefined)
const handleButtonClick = async (index: number) => {
  if (index === 0) {
    uni.navigateBack()
  } else if (index === 1) {
    if (!houseListId.value) {
      uni.showToast({
        title: '房源ID不能为空',
        icon: 'none',
      })
      return
    }
    if (!selectedInvestorId.value) {
      uni.showToast({
        title: '投资人ID不能为空',
        icon: 'none',
      })
      return
    }
    uni.showLoading({
      title: '保存中...',
    })
    const params = {
      investor_id: selectedInvestorId.value,
      house_list_id: houseListId.value,
    }
    const res = await setInvestorAPI(params)
    uni.hideLoading()
    if (res.code === 200) {
      uni.showToast({
        title: '保存成功',
        icon: 'none',
      })
      uni.navigateBack()
    } else {
      uni.showToast({
        title: '保存失败',
        icon: 'none',
      })
    }
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
const investorList = ref<InvestorItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const selectedInvestorId = ref<string | number | undefined>(undefined)

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
        nickname: `投资人${startId + i}`,
        mobile: '131***1234',
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
