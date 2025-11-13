<script setup lang="ts">
import type { BannerItem, CategoryItem, HomeItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { nextTick, ref, watch } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import SellBoard from './components/SellBoard.vue'
import FilterList from './components/FilterList.vue'
import ShSearchBar from '@/components/ShSearchBar.vue'
import ShLoginPopup from '@/components/ShLoginPopup.vue'
import { useFilterState } from './composables/useFilterState.ts'
import { useScrollRefresh } from '@/composables/testUseScroller'
const { safeAreaInsets } = uni.getSystemInfoSync()
import { useMemberStore } from '@/stores'

import {
  getIndexBannerAPI,
  getIndexHouseListAPI,
  getIndexNoticeAPI,
  type HouseListParams,
} from '@/services/index/page'

/**
 * ==========================================================================
 *                                 @异步请求
 * ==========================================================================
 */

// 首页轮播
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getIndexBannerAPI()
  if (res.code === 200) {
    bannerList.value = res.data
  }
}

// 首页公告
const noticeList = ref<BannerItem[]>([])
const getHomeNoticeData = async () => {
  const res = await getIndexNoticeAPI()
  if (res.code === 200) {
    noticeList.value = res.data
  }
}

/**
 * ==========================================================================
 *                                 @分类快捷点击相关
 * ==========================================================================
 */

// 分类数据
const categoryList = ref<CategoryItem[]>([
  {
    id: '1',
    name: '我要卖房',
    icon: '/static/index/sellHouse.png',
    url: '/pages/house/index',
  },
  {
    id: '2',
    name: '我的房源',
    icon: '/static/index/houseSource.png',
    url: '/pages/index/index',
  },
  {
    id: '3',
    name: '资讯',
    icon: '/static/index/news.png',
    url: '/pages/consult/index',
  },
  {
    id: '4',
    name: '我的订单',
    icon: '/static/index/order.png',
    url: '/pages/index/index',
  },
])

/**
 * ==========================================================================
 *                                 @房源列表相关
 * ==========================================================================
 */

// 当前筛选参数
const currentFilterParams = ref<HouseListParams>({
  is_recommend: 1,
})

const fetchHomeListData = async (page: number): Promise<HomeItem[]> => {
  try {
    const params: HouseListParams = {
      ...currentFilterParams.value,
      page,
      per_page: 10,
    }
    const res = await getIndexHouseListAPI(params)
    return res.data.list || []
  } catch (error) {
    return []
  }
}

const {
  list: homeList,
  isLoading: isLoadingMore,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
  refresh: refreshHomeList,
} = useScrollRefresh<HomeItem>({
  fetchData: fetchHomeListData,
  pageSize: 10,
  initialPage: 1,
  lowerThreshold: 100,
  enableRefresh: true,
  enableLoadMore: true,
  immediate: true,
  onRefreshStart: () => {},
  onRefreshEnd: (data) => {},
  onLoadMoreStart: () => {},
  onLoadMoreEnd: (data) => {},
  onError: (error, type) => {},
  onEmpty: () => {},
})

// 筛选抽屉是否打开，用于锁定页面滚动
const isFilterDrawerOpen = ref(false)
const { drawerVisible, initFilterData } = useFilterState()
// 导航栏显示状态
const showNavbar = ref(false)
// 记录滚动位置
const scrollTop = ref(0)
// 用于打开抽屉时回到顶部的值，繁殖呗裁剪
const programmaticScrollTop = ref(0)

onLoad(async () => {
  await Promise.all([getHomeBannerData(), getHomeNoticeData(), initFilterData()])
})

const showTopFilter = ref(false)

// 头部导航栏控制
const onScroll = (e: any) => {
  const currentScrollTopHeight = e.detail.scrollTop
  currentScrollTop.value = e.detail.scrollTop
  // 小于50px
  if (currentScrollTopHeight <= 50) {
    showNavbar.value = false
  } else {
    // 向上滚动，显示导航栏
    showNavbar.value = true
  }

  if (currentScrollTopHeight <= 470) {
    showTopFilter.value = false
  } else {
    // 向上滚动，显示导航栏
    showTopFilter.value = true
  }

  scrollTop.value = currentScrollTopHeight
}

const currentScrollTop = ref(0)

// 抽屉状态变化
const handleDrawerChange = (visible: boolean) => {
  isFilterDrawerOpen.value = visible
  showNavbar.value = false

  if (visible) {
    programmaticScrollTop.value = Math.random()
    nextTick(() => {
      programmaticScrollTop.value = 0
    })
  }
}

const searchKeyword = ref('')
const handleSearch = async (value?: string) => {
  const params: HouseListParams = {
    is_recommend: 1,
    keyword: searchKeyword.value,
    page: 1,
    per_page: 10,
  }
  const res = await getIndexHouseListAPI(params)
  homeList.value = res.data.list
}

//接口请求请求参数处理
const buildHouseListParams = (filters: Record<string, any>, keyword: string): HouseListParams => {
  const params: HouseListParams = {}

  // 关键词
  if (keyword) {
    params.keyword = keyword
  }

  // 区域 district_id
  if (filters.area) {
    params.district_id = filters.area.id
  }

  // 单价 min_price, max_price
  if (filters.priceUnit) {
    if (filters.priceUnit.min_price > 0) {
      params.min_price = filters.priceUnit.min_price
    }
    if (filters.priceUnit.max_price > 0) {
      params.max_price = filters.priceUnit.max_price
    }
  }

  // 总价 total_min_price, total_max_price
  if (filters.priceTotal) {
    if (filters.priceTotal.min_price > 0) {
      params.total_min_price = filters.priceTotal.min_price
    }
    if (filters.priceTotal.max_price > 0) {
      params.total_max_price = filters.priceTotal.max_price
    }
  }

  // 类型 style_house_id
  if (filters.type) {
    params.style_house_id = filters.type.id
  }

  // 户型 style_bedroom_num (使用 order_id)
  if (filters.layout) {
    params.style_bedroom_num = filters.layout.order_id
  }

  // 建筑面积 min_area, max_area
  if (filters.moreArea) {
    if (filters.moreArea.min_area > 0) {
      params.min_area = filters.moreArea.min_area
    }
    if (filters.moreArea.max_area > 0) {
      params.max_area = filters.moreArea.max_area
    }
  }

  // 朝向 exposure_house_id
  if (filters.moreOrientation) {
    params.exposure_house_id = filters.moreOrientation.id
  }

  // 特色 feature_house_ids
  if (filters.moreFeature) {
    params.feature_house_ids = filters.moreFeature.id
  }

  params.is_recommend = 1

  return params
}

// 处理筛选确定
const handleFilterConfirm = (data: { filters: Record<string, any>; searchKeyword: string }) => {
  const params = buildHouseListParams(data.filters, data.searchKeyword)

  currentFilterParams.value = params

  refreshHomeList()
}

watch(drawerVisible, (val) => {
  isFilterDrawerOpen.value = val
})

const back = () => {
  uni.navigateBack()
}

/**
 * ==========================================================================
 *                                 @登录相关
 * ==========================================================================
 */

// 登录弹窗引用
const loginPopup = ref<InstanceType<typeof ShLoginPopup> | null>(null)

// 登录状态
const isLoggedIn = ref(false)

// 处理登录状态
const handleLoginStatus = (status: boolean) => {
  isLoggedIn.value = status
}

// 处理登录
const handleLogin = () => {
  loginPopup.value?.open()
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

<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <ShNavbar
      @back="back"
      v-show="showNavbar"
      :title="'首页'"
      :showBack="false"
      class="navbar-fixed"
    />
    <up-sticky v-show="showTopFilter" :offset-top="safeAreaInsets!.top + 35">
      <FilterList @drawer-change="handleDrawerChange" @filter-confirm="handleFilterConfirm" />
    </up-sticky>
    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      :refresher-enabled="!isFilterDrawerOpen"
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      class="scroll-view"
      @scroll="onScroll"
      :scroll-y="!isFilterDrawerOpen"
      :scroll-top="programmaticScrollTop"
      @scrolltolower="handleScrollToLower"
      :lower-threshold="100"
    >
      <template>
        <!-- 轮播图容器 -->
        <view class="banner-container">
          <!-- 自定义轮播图 -->
          <ShSwiper :list="bannerList" />
          <!-- 悬浮的导航栏 -->
          <view
            class="floating-navbar"
            :style="{ paddingTop: (safeAreaInsets?.top || 0) + 10 + 'px' }"
          >
            <view class="logo">
              <image class="logo-image" src="@/static/images/logo.png"></image>
            </view>
            <!-- 搜索条 -->
            <ShSearchBar
              v-model="searchKeyword"
              @clickButton="handleSearch"
              @search="handleSearch"
            />
          </view>
        </view>
        <!-- 分类面板 -->
        <CategoryPanel @login="handleLogin" :list="categoryList" />
        <!-- 卖房公告 -->
        <SellBoard />
        <!-- 筛选功能 -->
        <FilterList
          v-show="!showTopFilter"
          @drawer-change="handleDrawerChange"
          @filter-confirm="handleFilterConfirm"
        />
        <!-- 房子信息list -->
        <ShHomeList :showCount="true" :homeList="homeList" @card-click="handleHomeCardClick" />

        <!-- 加载状态 -->
        <view v-if="isLoadingMore" class="loading-wrapper">
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 没有更多数据 -->
        <view v-else-if="!hasMore && homeList.length > 0" class="no-more">
          <text class="no-more-text">没有更多了</text>
        </view>

        <view class="space"></view>
      </template>
    </scroll-view>

    <!-- 登录弹窗 -->
    <ShLoginPopup @login-status="handleLoginStatus" ref="loginPopup" />

    <ShMainTabbar />
  </view>
</template>

<style lang="scss">
page {
  background-color: white;
  height: 100%;
  overflow: hidden;
}
.space {
  height: calc(env(safe-area-inset-bottom) + 150rpx);
}
.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.position {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  padding: 10rpx;
  text-align: center;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
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

.banner-container {
  position: relative;
}

.floating-navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }
  }
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
</style>
