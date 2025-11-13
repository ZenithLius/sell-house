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
        :refreshing="refreshing"
        @loadMore="loadMoreMessages"
        @itemClick="handleItemClick"
        @refresh="onRefresh"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MessageList from './components/MessageList.vue'
import { getMessageListAPI, type MessageItem as ApiMessageItem } from '@/services/my'

// 前端展示用的消息项类型
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

// 将 API 数据转换为前端展示格式
const transformToMessageItem = (apiItem: ApiMessageItem): MessageItem => {
  return {
    id: apiItem.house_list_id || apiItem.created_at || '',
    title: '房源危险池通知',
    date: apiItem.create_time || apiItem.created_at || '',
    houseCode: apiItem.house_code || '',
    houseName: `${apiItem.pharmacist_title || ''} ${apiItem.house_list_title || ''} ${
      apiItem.exposure_house_title || ''
    } ${apiItem.decoration_house_title || ''}`.trim(),
  }
}
const refreshing = ref(false)

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  page.value = 1
  await loadMessages()
  refreshing.value = false
}

// 加载消息列表
const loadMessages = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // 调用后台接口获取消息列表
    const res = await getMessageListAPI({
      page: page.value,
      per_page: 10,
    })

    console.log('获取消息列表数据=====', res.data)

    // 获取列表数据
    const list = res.data.dangerList?.list || []
    const transformedList = list.map(transformToMessageItem)

    // 第一页替换，后续页追加
    if (page.value === 1) {
      messageList.value = transformedList
    } else {
      messageList.value.push(...transformedList)
    }

    // 判断是否还有更多数据
    const perPage = res.data.dangerList?.per_page || 10
    const total = res.data.dangerList?.total || 0
    const currentPage = res.data.dangerList?.current_page || page.value

    // 如果当前页数据少于每页数量，或者已经加载到最后一页
    if (list.length < perPage || messageList.value.length >= total) {
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
  if (!hasMore.value || loading.value) return
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
