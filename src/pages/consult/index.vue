<script setup lang="ts">
import { ref } from 'vue'
import NoticeList from './components/NoticeList.vue'
import StudyList from './components/StudyList.vue'

const back = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

// Tab 配置
const tabs = [
  { label: '公告', value: 'notice', badge: false },
  { label: '喜报', value: 'good-news', badge: true },
  { label: '学习天地', value: 'study', badge: false },
]

const activeTab = ref('notice')

const handleTabChange = (value: string) => {
  console.log('当前选中的 tab:', value)
}

// 公告列表数据
interface NoticeItem {
  id: string | number
  title: string
  date: string
}

const noticeList = ref<NoticeItem[]>([
  {
    id: 1,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 2,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 3,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
  },
])
const noticeLoading = ref(false)
const noticeHasMore = ref(true)

// 加载更多公告
const loadMoreNotice = async () => {
  if (noticeLoading.value || !noticeHasMore.value) return

  noticeLoading.value = true
  try {
    // TODO
    // const res = await getNoticeList({ page: currentPage.value, pageSize: 10 })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟数据
    const newData: NoticeItem[] = [
      {
        id: noticeList.value.length + 1,
        title: '公告标题内容公告标题内容公告标题内容公告标题内容',
        date: '2025.09.18',
      },
      {
        id: noticeList.value.length + 2,
        title: '公告标题内容公告标题内容公告标题内容公告标题内容',
        date: '2025.09.18',
      },
    ]

    noticeList.value = [...noticeList.value, ...newData]

    // 没有更多
    if (noticeList.value.length >= 20) {
      noticeHasMore.value = false
    }
  } catch (error) {
    console.error('加载公告失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    noticeLoading.value = false
  }
}

// 点击公告项
const handleNoticeClick = (item: NoticeItem) => {
  console.log('点击公告:', item)
  uni.navigateTo({ url: `/pagesConsult/detailConsult?id=${item.id}` })
}

// 学习天地列表数据
interface StudyItem {
  id: string | number
  title: string
  date: string
  cover: string
}

const studyList = ref<StudyItem[]>([
  {
    id: 1,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=1',
  },
  {
    id: 2,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=2',
  },
  {
    id: 3,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=3',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
  {
    id: 4,
    title: '公告标题内容公告标题内容公告标题内容公告标题内容',
    date: '2025.09.18',
    cover: 'https://picsum.photos/220/156?random=4',
  },
])
const studyLoading = ref(false)
const studyHasMore = ref(true)

// 加载更多学习内容
const loadMoreStudy = async () => {
  if (studyLoading.value || !studyHasMore.value) return

  studyLoading.value = true
  try {
    // TODO: 这里调用你的接口获取数据
    // const res = await getStudyList({ page: currentPage.value, pageSize: 10 })

    // 模拟接口请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟数据
    const newData: StudyItem[] = [
      {
        id: studyList.value.length + 1,
        title: '公告标题内容公告标题内容公告标题内容公告标题内容',
        date: '2025.09.18',
        cover: `https://picsum.photos/220/156?random=${studyList.value.length + 1}`,
      },
      {
        id: studyList.value.length + 2,
        title: '公告标题内容公告标题内容公告标题内容公告标题内容',
        date: '2025.09.18',
        cover: `https://picsum.photos/220/156?random=${studyList.value.length + 2}`,
      },
    ]

    studyList.value = [...studyList.value, ...newData]

    // 如果数据量达到一定数量，设置没有更多
    if (studyList.value.length >= 20) {
      studyHasMore.value = false
    }
  } catch (error) {
    console.error('加载学习内容失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    studyLoading.value = false
  }
}

// 点击学习项
const handleStudyClick = (item: StudyItem) => {
  console.log('点击学习内容:', item)
  // TODO: 跳转到学习详情页
  // uni.navigateTo({ url: `/pages/consult/study-detail?id=${item.id}` })
}
</script>

<template>
  <view class="container">
    <ShNavbar @back="back" :title="'资讯'" :showBack="true" />
    <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

    <view class="content">
      <NoticeList
        v-if="activeTab === 'notice'"
        :list="noticeList"
        :loading="noticeLoading"
        :has-more="noticeHasMore"
        @load-more="loadMoreNotice"
        @item-click="handleNoticeClick"
      />
      <NoticeList
        v-else-if="activeTab === 'good-news'"
        :list="noticeList"
        :loading="noticeLoading"
        :has-more="noticeHasMore"
        @load-more="loadMoreNotice"
        @item-click="handleNoticeClick"
      />
      <StudyList
        v-else-if="activeTab === 'study'"
        :list="studyList"
        :loading="studyLoading"
        :has-more="studyHasMore"
        @load-more="loadMoreStudy"
        @item-click="handleStudyClick"
      />
    </view>
  </view>
</template>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #fff;
}

.content {
  width: 100%;
}
</style>
