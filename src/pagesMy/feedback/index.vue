<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'反馈记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +30+ 'px' }">
      <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />
      <view class="list-wrapper">
        <FeedbackList
          v-if="activeTab === '0'"
          :list="unreplyList"
          :loading="unreplyLoading"
          :hasMore="unreplyHasMore"
          @loadMore="loadMoreUnreply"
          @itemClick="handleItemClick"
        />
        <FeedbackReplyList
          v-else
          :list="replyList"
          :loading="replyLoading"
          :hasMore="replyHasMore"
          @loadMore="loadMoreReply"
          @itemClick="handleReplyItemClick"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FeedbackList from './components/FeedbackList.vue'
import { getFeedbackListAPI } from '@/services/my'
import type { FeedbackItem as ApiFeedbackItem } from '@/services/my'
import FeedbackReplyList from './components/FeedbackReplyList.vue'

interface FeedbackItem {
  id: string | number
  title: string
  community: string
  content: string
  date: string
}

interface ReplyFeedbackItem {
  id: string | number
  title: string
  community: string
  content: string
  date: string
  replyTime: string
  replyContent: string
}

const activeTab = ref('0')
const tabs = [
  { title: '未回复', id: '0', badge: false },
  { title: '已回复', id: '1', badge: true },
]

// 未回复列表数据
const unreplyList = ref<FeedbackItem[]>([])
const unreplyLoading = ref(false)
const unreplyHasMore = ref(true)
const unreplyPage = ref(1)

// 已回复列表数据
const replyList = ref<ReplyFeedbackItem[]>([])
const replyLoading = ref(false)
const replyHasMore = ref(true)
const replyPage = ref(1)

const handleTabChange = (value: string) => {
  console.log('当前选中的 tab:', value)
  // 切换tab时，如果列表为空则加载数据
  if (value === '0' && unreplyList.value.length === 0) {
    loadUnreplyList()
  } else if (value === '1' && replyList.value.length === 0) {
    loadReplyList()
  }
}

// 将 API 数据转换为未回复列表格式
const transformToFeedbackItem = (apiItem: ApiFeedbackItem): FeedbackItem => {
  return {
    id: apiItem.created_at || '', // 使用创建时间作为临时 ID
    title: apiItem.house_list_title || '未知房源',
    community: apiItem.pharmacist_title || '未知小区',
    content: apiItem.content || '',
    date: apiItem.created_time || apiItem.created_at || '',
  }
}

// 将 API 数据转换为已回复列表格式
const transformToReplyFeedbackItem = (apiItem: ApiFeedbackItem): ReplyFeedbackItem => {
  return {
    id: apiItem.created_at || '', // 使用创建时间作为临时 ID
    title: apiItem.house_list_title || '未知房源',
    community: apiItem.pharmacist_title || '未知小区',
    content: apiItem.content || '',
    date: apiItem.created_time || apiItem.created_at || '',
    replyTime: apiItem.created_at || '',
    replyContent: apiItem.answer_content || '暂无回复内容',
  }
}

// 加载未回复列表
const loadUnreplyList = async () => {
  if (unreplyLoading.value) return

  unreplyLoading.value = true
  try {
    // 调用后台接口获取未回复列表
    const res = await getFeedbackListAPI({ is_answer: '0' })

    const list = res.data.list || []
    const transformedList = list.map(transformToFeedbackItem)

    if (unreplyPage.value === 1) {
      unreplyList.value = transformedList
    } else {
      unreplyList.value.push(...transformedList)
    }

    // 判断是否还有更多数据
    if (list.length === 0 || (res.data.per_page && list.length < res.data.per_page)) {
      unreplyHasMore.value = false
    }
  } catch (error) {
    console.error('加载未回复列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    unreplyLoading.value = false
  }
}

// 加载更多未回复
const loadMoreUnreply = () => {
  unreplyPage.value++
  loadUnreplyList()
}

// 加载已回复列表
const loadReplyList = async () => {
  if (replyLoading.value) return

  replyLoading.value = true
  try {
    // 调用后台接口获取已回复列表
    const res = await getFeedbackListAPI({ is_answer: '1' })

    const list = res.data.list || []
    const transformedList = list.map(transformToReplyFeedbackItem)

    if (replyPage.value === 1) {
      replyList.value = transformedList
    } else {
      replyList.value.push(...transformedList)
    }

    // 判断是否还有更多数据
    if (list.length === 0 || (res.data.per_page && list.length < res.data.per_page)) {
      replyHasMore.value = false
    }
  } catch (error) {
    console.error('加载已回复列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    replyLoading.value = false
  }
}

// 加载更多已回复
const loadMoreReply = () => {
  replyPage.value++
  loadReplyList()
}

// 点击未回复列表项
const handleItemClick = (item: FeedbackItem) => {
  console.log('点击未回复反馈项:', item)
  // TODO: 跳转到详情页
  // uni.navigateTo({
  //   url: `/pagesMy/feedback/detail?id=${item.id}`
  // })
}

// 点击已回复列表项
const handleReplyItemClick = (item: ReplyFeedbackItem) => {
  console.log('点击已回复反馈项:', item)
  // TODO: 跳转到详情页
  // uni.navigateTo({
  //   url: `/pagesMy/feedback/detail?id=${item.id}`
  // })
}

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

// 初始化加载未回复列表
onMounted(() => {
  loadUnreplyList()
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

    .list-wrapper {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
