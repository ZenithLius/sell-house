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
          v-if="activeTab === 'unreply'"
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

const activeTab = ref('unreply')
const tabs = [
  { label: '未回复', value: 'unreply', badge: false },
  { label: '已回复', value: 'reply', badge: true },
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
  if (value === 'unreply' && unreplyList.value.length === 0) {
    loadUnreplyList()
  } else if (value === 'reply' && replyList.value.length === 0) {
    loadReplyList()
  }
}

// 加载未回复列表
const loadUnreplyList = async () => {
  if (unreplyLoading.value) return

  unreplyLoading.value = true
  try {
    // const res = await uni.request({
    //   url: '/api/feedback/unreply',
    //   data: { page: unreplyPage.value, pageSize: 10 }
    // })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: FeedbackItem[] = [
      {
        id: 1,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 2,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
      },
    ]

    if (unreplyPage.value === 1) {
      unreplyList.value = mockData
    } else {
      unreplyList.value.push(...mockData)
    }

    // 模拟没有更多数据
    if (unreplyPage.value >= 2) {
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
    // const res = await uni.request({
    //   url: '/api/feedback/reply',
    //   data: { page: replyPage.value, pageSize: 10 }
    // })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: ReplyFeedbackItem[] = [
      {
        id: 1,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
        replyTime: '2025.09.02 10:00:00',
        replyContent:
          '反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍反馈内容文字介绍',
      },
      {
        id: 2,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修 婚装 南北通透',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
        replyTime: '2025.09.02 11:30:00',
        replyContent: '感谢您的反馈，我们已经收到您的意见，会尽快处理。',
      },
      {
        id: 3,
        title: '未央区 天朗御湖1-1-603西南朝向 精装修',
        community: '天朗御湖',
        content: '天朗御湖',
        date: '2025.09.02 10:00:00',
        replyTime: '2025.09.02 15:00:00',
        replyContent: '您好，关于您反馈的问题，我们已经核实并处理完成，感谢您的支持。',
      },
    ]

    if (replyPage.value === 1) {
      replyList.value = mockData
    } else {
      replyList.value.push(...mockData)
    }

    // 模拟没有更多数据
    if (replyPage.value >= 2) {
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
