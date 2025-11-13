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
        :refreshing="refreshing"
        @loadMore="loadMoreHouses"
        @itemClick="handleItemClick"
        @refresh="onRefresh"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MyHouseList from './components/MyHouseList.vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMySellHouseAPI, type HouseItem as ApiHouseItem } from '@/pagesMy/services'

// 适配后的房源项类型
interface HouseItem {
  title: string
  area: string
  created_at: string
  province_name: string
  city_name: string
  district_name: string
  street_name: string
  address: string
  price: string
  add_time: string
}

const houseList = ref<HouseItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const refreshing = ref(false)

// 加载房源列表
const loadHouses = async () => {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getMySellHouseAPI({
      page: page.value,
      per_page: 10,
    })
    console.log('我的卖房接口返回数据', res)

    if (res.code === 200 && res.data) {
      const { list: houseData, current_page, per_page } = res.data

      if (page.value === 1) {
        houseList.value = houseData
        console.log('homelist===================', houseList.value)
      } else {
        houseList.value.push(...houseData)
      }

      hasMore.value = houseData.length >= per_page
      page.value = current_page
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
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

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  page.value = 1
  await loadHouses()
  refreshing.value = false
}

// 点击房源项
const handleItemClick = (item: HouseItem) => {
  console.log('点击房源:', item)
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
