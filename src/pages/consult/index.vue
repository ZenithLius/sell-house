<script setup lang="ts">
import { ref } from 'vue'
import NoticeList from './components/NoticeList.vue'
import StudyList from './components/StudyList.vue'
import {
  getConsultListAPI,
  getConsultCategoryAPI,
  type ConsultCategoryItem,
  type ConsultListItem,
} from '@/services/consult'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScrollRefresh } from '@/composables/testUseScroller'

type TabItem = ConsultCategoryItem

onLoad(async () => {})

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

const currentTabId = ref(-1)

onShow(async () => {
  await getConsultCategoryReq()
  await refresh()
})

// 定义数据获取函数
const fetchConsultData = async (page: number) => {
  uni.showLoading({
    title: '加载中',
  })
  const res = await getConsultListAPI({
    type_id: currentTabId.value,
    page,
    per_page: 10,
  })
  uni.hideLoading()
  if (res.code === 200) {
    return res.data.list || res.data || []
  }
  return []
}

const {
  list: noticeList,
  isLoading,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
  refresh,
} = useScrollRefresh<ConsultListItem>({
  fetchData: fetchConsultData,
  pageSize: 10,
  immediate: false,
})

const getConsultCategoryReq = async () => {
  uni.showLoading({
    title: '加载中...',
  })
  const res = await getConsultCategoryAPI()
  tabs.value = res.data
  currentTabType.value = tabs.value[0].type
  currentTabId.value = tabs.value[0].id
  await refresh()
  uni.hideLoading()
}

const back = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

// Tab 配置
const tabs = ref<TabItem[]>([])

const activeTab = ref(101)
const currentTabType = ref(-1)
const handleTabChange = async (value: number) => {
  currentTabType.value = tabs.value.find((tab) => tab.id === value)?.type ?? -1
  currentTabId.value = value
  await refresh()
}

type NoticeItem = ConsultListItem

// 点击公告项
const handleNoticeClick = (item: NoticeItem) => {
  uni.navigateTo({ url: `/pagesConsult/detailConsult?id=${item.id}` })
}

// 学习天地列表数据
interface StudyItem {
  id: string | number
  title: string
  date: string
  cover: string
}
</script>

<template>
  <view class="container">
    <ShNavbar @back="back" :title="'资讯'" :showBack="true" />
    <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

    <scroll-view
      class="content"
      scroll-y
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
      @scrolltolower="handleScrollToLower"
    >
      <NoticeList
        v-if="currentTabType === 0"
        :list="noticeList"
        :loading="isLoading"
        :has-more="hasMore"
        @item-click="handleNoticeClick"
      />
      <StudyList
        v-else-if="currentTabType === 1"
        :list="noticeList"
        :loading="isLoading"
        :has-more="hasMore"
        @item-click="handleNoticeClick"
      />
    </scroll-view>

    <ShMainTabbar />
  </view>
</template>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.content {
  width: 100%;
  height: calc(100vh - env(safe-area-inset-top) - 180rpx);
}
</style>
