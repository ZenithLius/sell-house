<script setup lang="ts">
import { ref, computed } from 'vue'
import CardPoster from './components/CardPoster.vue'
import { useScrollRefresh } from '@/composables/testUseScroller'
import { useUserStore } from '@/stores'
import { onShow } from '@dcloudio/uni-app'
import { getVisitorListAPI } from '@/services/index/page'

const { safeAreaInsets } = uni.getSystemInfoSync()

const showNavbar = ref(true)

const back = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

const getFormatTime = (time: string) => {
  return time.slice(0, 10)
}

const userInfo = computed(() => useUserStore().userInfo)

// 访客数据接口
interface VisitorItem {
  id: number
  name: string
  phone: string
  date: string
}

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

onShow(async () => {
  await refresh()
})

//获取数据
const fetchVisitorData = async (page: number) => {
  uni.showLoading({
    title: '加载中',
  })
  const res = await getVisitorListAPI({
    page,
    per_page: 10,
  })
  uni.hideLoading()
  if (res.code === 200) {
    console.log('获取到访客数据:', res)
    return res.data.list || res.data || []
  }
  return []
}

const {
  list: recentVisitors,
  isLoading,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
  refresh,
} = useScrollRefresh<any>({
  fetchData: fetchVisitorData,
  pageSize: 10,
  immediate: false,
})

// 名片海报组件引用
const cardPosterRef = ref()

// 分享名片
const shareCard = () => {
  const userStore = useUserStore()
  console.log('分享名片', userStore.userInfo)
  uni.showToast({
    title: '分享名片',
    icon: 'none',
  })
}

// 保存名片
const saveCard = () => {
  if (!userInfo.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
    return
  }
  cardPosterRef.value?.openPoster(userInfo.value)
}

// 修改信息
const editInfo = () => {
  uni.navigateTo({
    url: '/pagesCustomer/editInfo',
  })
}

// 访客点击
const onVisitorClick = (visitor: VisitorItem) => {
  console.log('访客点击:', visitor)
}
</script>

<template>
  <view class="customers">
    <ShNavbar @back="back" v-show="showNavbar" :title="'获客'" :showBack="true" />

    <!-- 名片区域 -->
    <view class="card-section" v-if="userInfo">
      <view class="card-container">
        <image class="card-bg" src="/static/customers/cardbackground.png" mode="aspectFill"></image>
        <view class="card-content">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="name-row">
              <text class="name">{{ userInfo.nickname }}</text>
              <!-- TODO 级别单位 -->
              <!-- <text class="role">{{ userInfo.sex }}</text> -->
            </view>
            <text class="phone">{{ userInfo.mobile }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons" v-if="userInfo">
        <view class="action-item" @tap="shareCard">
          <image class="action-icon" src="/static/customers/share.png" mode="aspectFit"></image>
          <text class="action-text">分享名片</text>
        </view>
        <view class="action-item" @tap="saveCard">
          <image class="action-icon" src="/static/customers/save.png" mode="aspectFit"></image>
          <text class="action-text">保存名片</text>
        </view>
        <view class="action-item" @tap="editInfo">
          <image class="action-icon" src="/static/customers/edit.png" mode="aspectFit"></image>
          <text class="action-text">修改信息</text>
        </view>
      </view>
    </view>

    <!-- 最近访客区域 -->
    <view class="visitors-section">
      <view class="section-title">最近访客</view>
      <scroll-view
        class="visitors-list"
        scroll-y
        refresher-enabled
        :refresher-triggered="isTriggered"
        @refresherrefresh="onRefresherrefresh"
        @scrolltolower="handleScrollToLower"
      >
        <view
          class="visitor-item"
          v-for="visitor in recentVisitors"
          :key="visitor.agent_user_id"
          @tap="onVisitorClick(visitor)"
        >
          <view class="visitor-info">
            <text class="visitor-name">{{ visitor.nickname }}</text>
            <view class="visitor-phone">
              <image class="phone-icon" src="/static/customers/phone.png" mode="aspectFit"></image>
              <text class="phone-text">{{ visitor.mobile }}</text>
            </view>
          </view>
          <text class="visitor-date">{{ getFormatTime(visitor.create_time) }}</text>
        </view>

        <!-- 加载状态提示 -->
        <view v-if="isLoading" class="loading-text">加载中...</view>
        <view v-else-if="!hasMore && recentVisitors.length > 0" class="loading-text"
          >没有更多了</view
        >
        <view v-else-if="recentVisitors.length === 0" class="loading-text">暂无访客数据</view>

        <view class="space" :style="{ height: safeAreaInsets!.bottom + 50 + 'px' }"></view>
      </scroll-view>
    </view>

    <!-- 名片海报组件 -->
    <CardPoster ref="cardPosterRef" />

    <ShMainTabbar />
  </view>
</template>

<style lang="scss">
@import './styles/index.scss';
</style>
