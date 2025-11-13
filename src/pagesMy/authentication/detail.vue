<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'查看'"
      :showBack="true"
      class="navbar-fixed"
    />

    <scroll-view
      class="content"
      :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }"
      scroll-y
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
      @scrolltolower="handleScrollToLower"
    >
      <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

      <DetailRecordList
        :list="list"
        :loading="isLoading"
        :hasMore="hasMore"
        @itemClick="handleItemClick"
      />
    </scroll-view>

    <!-- <BottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailRecordList from './components/DetailRecordList.vue'
import BottomTabbar from './components/BottomTabbar.vue'
import { followHistoryListAPI, lockRecordListAPI, viewRecordListAPI } from '../services/staff'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScrollRefresh } from '@/composables/testUseScroller'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

const houseListId = ref('')
onLoad((options) => {
  houseListId.value = options?.house_list_id || ''
})

onShow(async () => {
  await refresh()
})

/**
 * ==================================数据获取========================================
 */
interface RecordItem {
  created_at: string
  created_time: string
  id: number
  mobile: string
  nickname: string
  user_id: number
}

const fetchData = async (page: number) => {
  uni.showLoading({
    title: '加载中',
  })

  let res
  if (activeTab.value === 'viewHistory') {
    res = await viewRecordListAPI({
      house_list_id: houseListId.value,
      page,
      per_page: 10,
    })
  } else if (activeTab.value === 'followRecord') {
    res = await followHistoryListAPI({
      house_list_id: houseListId.value,
      page,
      per_page: 10,
    })
  } else {
    res = await lockRecordListAPI({
      house_list_id: houseListId.value,
      page,
      per_page: 10,
    })
  }

  uni.hideLoading()

  if (res.code === 200) {
    return res.data.list
  }
  return []
}

const { list, isLoading, hasMore, isTriggered, onRefresherrefresh, handleScrollToLower, refresh } =
  useScrollRefresh<RecordItem>({
    fetchData,
    pageSize: 10,
    immediate: false,
  })

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// Tab 配置
const tabs = [
  { title: '浏览记录', id: 'viewHistory', badge: false },
  { title: '关注记录', id: 'followRecord', badge: false },
  { title: '开锁记录', id: 'openLockRecord', badge: false },
]
const activeTab = ref('viewHistory')
const handleTabChange = async (value: string) => {
  await refresh()
}

// 点击记录项
const handleItemClick = (item: RecordItem) => {
  console.log('点击了记录项:', item)
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
  height: calc(100vh - env(safe-area-inset-bottom) - 50rpx);
  display: flex;
  flex-direction: column;
}
</style>
