<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'查看'"
      :showBack="true"
      class="navbar-fixed"
    />

    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

      <!-- 浏览记录 -->
      <DetailRecordList
        v-if="activeTab === 'viewHistory'"
        :list="viewHistoryList"
        :loading="viewHistoryLoading"
        :hasMore="viewHistoryHasMore"
        @loadMore="loadViewHistory"
        @itemClick="handleItemClick"
      />

      <!-- 关注记录 -->
      <DetailRecordList
        v-if="activeTab === 'followRecord'"
        :list="followRecordList"
        :loading="followRecordLoading"
        :hasMore="followRecordHasMore"
        @loadMore="loadFollowRecord"
        @itemClick="handleItemClick"
      />

      <!-- 开锁记录 -->
      <DetailRecordList
        v-if="activeTab === 'openLockRecord'"
        :list="openLockRecordList"
        :loading="openLockRecordLoading"
        :hasMore="openLockRecordHasMore"
        @loadMore="loadOpenLockRecord"
        @itemClick="handleItemClick"
      />
    </view>

    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailRecordList from './components/DetailRecordList.vue'
import BottomTabbar from './components/BottomTabbar.vue'

interface RecordItem {
  id: string | number
  time: string
  userName: string
  phone: string
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// Tab 配置
const tabs = [
  { label: '浏览记录', value: 'viewHistory', badge: false },
  { label: '关注记录', value: 'followRecord', badge: false },
  { label: '开锁记录', value: 'openLockRecord', badge: false },
]
const activeTab = ref('viewHistory')
const handleTabChange = (value: string) => {
  console.log('当前选中的 tab:', value)
}

// 浏览记录数据
const viewHistoryList = ref<RecordItem[]>([
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
  {
    id: 3,
    time: '2025.09.01 10:00:00',
    userName: '用户名',
    phone: '13212345678',
  },
])
const viewHistoryLoading = ref(false)
const viewHistoryHasMore = ref(true)
const viewHistoryPage = ref(1)

// 关注记录数据
const followRecordList = ref<RecordItem[]>([
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '关注用户',
    phone: '13312345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '关注用户',
    phone: '13312345678',
  },
])
const followRecordLoading = ref(false)
const followRecordHasMore = ref(true)
const followRecordPage = ref(1)

// 开锁记录数据
const openLockRecordList = ref<RecordItem[]>([
  {
    id: 1,
    time: '2025.09.01 10:00:00',
    userName: '开锁用户',
    phone: '13412345678',
  },
  {
    id: 2,
    time: '2025.09.01 10:00:00',
    userName: '开锁用户',
    phone: '13412345678',
  },
])
const openLockRecordLoading = ref(false)
const openLockRecordHasMore = ref(true)
const openLockRecordPage = ref(1)

// 加载浏览记录
const loadViewHistory = () => {
  if (viewHistoryLoading.value || !viewHistoryHasMore.value) {
    return
  }

  viewHistoryLoading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData: RecordItem[] = [
      {
        id: viewHistoryList.value.length + 1,
        time: '2025.09.02 14:20:00',
        userName: '用户名',
        phone: '13212345678',
      },
    ]

    viewHistoryList.value.push(...newData)
    viewHistoryPage.value++

    // 模拟没有更多数据
    if (viewHistoryPage.value >= 4) {
      viewHistoryHasMore.value = false
    }

    viewHistoryLoading.value = false
  }, 1000)
}

// 加载关注记录
const loadFollowRecord = () => {
  if (followRecordLoading.value || !followRecordHasMore.value) {
    return
  }

  followRecordLoading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData: RecordItem[] = [
      {
        id: followRecordList.value.length + 1,
        time: '2025.09.02 14:20:00',
        userName: '关注用户',
        phone: '13312345678',
      },
    ]

    followRecordList.value.push(...newData)
    followRecordPage.value++

    // 模拟没有更多数据
    if (followRecordPage.value >= 4) {
      followRecordHasMore.value = false
    }

    followRecordLoading.value = false
  }, 1000)
}

// 加载开锁记录
const loadOpenLockRecord = () => {
  if (openLockRecordLoading.value || !openLockRecordHasMore.value) {
    return
  }

  openLockRecordLoading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData: RecordItem[] = [
      {
        id: openLockRecordList.value.length + 1,
        time: '2025.09.02 14:20:00',
        userName: '开锁用户',
        phone: '13412345678',
      },
    ]

    openLockRecordList.value.push(...newData)
    openLockRecordPage.value++

    // 模拟没有更多数据
    if (openLockRecordPage.value >= 4) {
      openLockRecordHasMore.value = false
    }

    openLockRecordLoading.value = false
  }, 1000)
}

// 点击记录项
const handleItemClick = (item: RecordItem) => {
  console.log('点击了记录项:', item)
  // TODO: 可以在这里跳转到详情页等
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
