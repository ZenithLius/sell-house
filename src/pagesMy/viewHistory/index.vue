<template>
  <view class="viewport">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'浏览记录'"
      :showBack="true"
      class="navbar-fixed"
    />

    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      :refresher-enabled="true"
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      class="scroll-view"
      :scroll-y="true"
      @scrolltolower="handleScrollToLower"
      :lower-threshold="100"
      :style="{ paddingTop: safeAreaInsets!.top + 44 + 'px' }"
    >
      <!-- 房子信息list -->
      <ShHomeList :showStats="true" :homeList="homeList" @card-click="handleHomeCardClick" />

      <!-- 加载状态 -->
      <view v-if="isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && homeList.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!isLoadingMore && homeList.length === 0" class="empty-wrapper">
        <text class="empty-text">暂无关注记录</text>
      </view>

      <view class="space"></view>
    </scroll-view>

    <!-- 登录弹窗 -->
    <ShLoginPopup @login-status="handleLoginStatus" ref="loginPopup" />
  </view>
</template>

<script setup lang="ts">
import type { HomeItem } from '@/types/home'
import { ref } from 'vue'
import ShHomeList from '@/components/ShHomeList.vue'
import ShLoginPopup from '@/components/ShLoginPopup.vue'
import { useScrollRefresh } from '@/composables/testUseScroller'
import { getViewListAPI, type FollowListParams } from '@/services/index/page'
import { useMemberStore } from '@/stores'

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// ========== 使用 useScrollRefresh Composable ==========
const fetchFollowListData = async (page: number): Promise<HomeItem[]> => {
  try {
    const params: FollowListParams = {
      page,
      per_page: 10,
    }
    const res = await getViewListAPI(params)
    // 转换 feature_house_title 为数组
    res.data.list.forEach((item) => {
      if (item.feature_house_title) {
        // 如果是字符串，则按逗号分割成数组
        if (typeof item.feature_house_title === 'string') {
          item.feature_house_title = item.feature_house_title
            .split(',')
            .filter((title) => title.trim() !== '')
        }
      }
    })

    console.log('获取浏览记录列表数据=====', res.data)
    // 返回列表数据
    return res.data.list || []
  } catch (error) {
    console.error('请求浏览记录列表失败:=========', error)
    return []
  }
}

// 使用 composable
const {
  list: homeList,
  isLoading: isLoadingMore,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
  refresh: refreshHomeList,
} = useScrollRefresh<HomeItem>({
  fetchData: fetchFollowListData,
  pageSize: 10,
  initialPage: 1,
  lowerThreshold: 100,
  enableRefresh: true,
  enableLoadMore: true,
  immediate: true, // 立即加载数据
  onRefreshStart: () => {
    console.log('开始刷新关注列表')
  },
  onRefreshEnd: (data) => {
    console.log('刷新完成，获取到数据:', data.length, '条')
  },
  onLoadMoreStart: () => {
    console.log('开始加载更多关注')
  },
  onLoadMoreEnd: (data) => {
    console.log('加载更多完成，获取到数据:', data.length, '条')
  },
  onError: (error, type) => {
    console.error(`${type} 错误:`, error)
  },
  onEmpty: () => {
    console.log('关注列表为空')
  },
})

// 登录弹窗引用
const loginPopup = ref<InstanceType<typeof ShLoginPopup> | null>(null)

// 登录状态
const isLoggedIn = ref(false)

// 处理登录状态
const handleLoginStatus = (status: boolean) => {
  isLoggedIn.value = status
  if (status) {
    // 登录成功后刷新列表
    refreshHomeList()
  }
}

// 处理房源卡片点击
const handleHomeCardClick = (item: HomeItem) => {
  const memberStore = useMemberStore()
  if (!memberStore.profile) {
    loginPopup.value?.open()
    return
  } else {
    uni.navigateTo({
      url: `/pagesIndex/home/detail?id=${item.id}`,
    })
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: white;
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.space {
  height: calc(env(safe-area-inset-bottom) + 150rpx);
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #bfbfbf;
}

.empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
