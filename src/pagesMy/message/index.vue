<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'消息'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +30+ 'px' }">
      <MessageList
        :list="messageList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMoreMessages"
        @itemClick="handleItemClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MessageList from './components/MessageList.vue'

interface MessageItem {
  id: string | number
  title: string
  date: string
  houseCode: string
  houseName: string
}

const messageList = ref<MessageItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 加载消息列表
const loadMessages = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // const res = await uni.request({
    //   url: '/api/message/list',
    //   data: { page: page.value, pageSize: 10 }
    // })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: MessageItem[] = [
      {
        id: 1,
        title: '房源危险池通知',
        date: '2025.09.02',
        houseCode: '123456',
        houseName: '未央区 天朗御湖1-1-603西南朝向 精装三室一厅...',
      },
      {
        id: 2,
        title: '房源危险池通知',
        date: '2025.09.02',
        houseCode: '123456',
        houseName: '未央区 天朗御湖1-1-603西南朝向 精装三室一厅...',
      },
      {
        id: 3,
        title: '房源危险池通知',
        date: '2025.09.02',
        houseCode: '123456',
        houseName: '未央区 天朗御湖1-1-603西南朝向 精装三室一厅...',
      },
      {
        id: 4,
        title: '房源危险池通知',
        date: '2025.09.03',
        houseCode: '789012',
        houseName: '雁塔区 绿地世纪城2-2-808东南朝向 豪华装修...',
      },
      {
        id: 5,
        title: '房源危险池通知',
        date: '2025.09.04',
        houseCode: '345678',
        houseName: '高新区 万科金域华府3-1-506南北通透 精装...',
      },
    ]

    if (page.value === 1) {
      messageList.value = mockData
    } else {
      messageList.value.push(...mockData)
    }

    // 模拟没有更多数据
    if (page.value >= 2) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载消息列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMoreMessages = () => {
  page.value++
  loadMessages()
}

// 点击消息项
const handleItemClick = (item: MessageItem) => {
  console.log('点击消息:', item)
  // TODO: 跳转到详情页
  // uni.navigateTo({
  //   url: `/pagesMy/message/detail?id=${item.id}`
  // })
}

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

// 初始化加载
onMounted(() => {
  loadMessages()
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
