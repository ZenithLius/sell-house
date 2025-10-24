<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'我的卖房'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +30+ 'px' }">
      <MyHouseList
        :list="houseList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMoreHouses"
        @itemClick="handleItemClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MyHouseList from './components/MyHouseList.vue'

interface HouseItem {
  id: string | number
  title: string
  price: string
  area: string
  size: string
  address: string
  date: string
}

const houseList = ref<HouseItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 加载房源列表
const loadHouses = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // const res = await uni.request({
    //   url: '/api/myHouse/list',
    //   data: { page: page.value, pageSize: 10 }
    // })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: HouseItem[] = [
      {
        id: 1,
        title: '天朗御湖',
        price: '150万元',
        area: '新城区',
        size: '150㎡',
        address: '新城区XXXXXXXXXXXXXXXXXX',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 2,
        title: '天朗御湖',
        price: '150万元',
        area: '新城区',
        size: '150㎡',
        address: '新城区XXXXXXXXXXXXXXXXXX',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '天朗御湖',
        price: '150万元',
        area: '新城区',
        size: '150㎡',
        address: '新城区XXXXXXXXXXXXXXXXXX',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 4,
        title: '绿地世纪城',
        price: '200万元',
        area: '雁塔区',
        size: '180㎡',
        address: '雁塔区YYYYYYYYYYYYYYYYYY',
        date: '2025.09.03 14:30:00',
      },
      {
        id: 5,
        title: '万科金域华府',
        price: '180万元',
        area: '高新区',
        size: '160㎡',
        address: '高新区ZZZZZZZZZZZZZZZZ',
        date: '2025.09.04 16:00:00',
      },
    ]

    if (page.value === 1) {
      houseList.value = mockData
    } else {
      houseList.value.push(...mockData)
    }

    // 模拟没有更多数据
    if (page.value >= 2) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载房源列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMoreHouses = () => {
  page.value++
  loadHouses()
}

// 点击房源项
const handleItemClick = (item: HouseItem) => {
  console.log('点击房源:', item)
  // TODO: 跳转到详情页
  // uni.navigateTo({
  //   url: `/pagesMy/myHouse/detail?id=${item.id}`
  // })
}

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

// 初始化加载
onMounted(() => {
  loadHouses()
})
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f5f5f5;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
