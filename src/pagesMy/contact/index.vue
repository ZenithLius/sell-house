<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'客服热线'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +30+ 'px' }">
      <ContactList
        :list="contactList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMoreContacts"
        @makeCall="handleMakeCall"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContactList from './components/ContactList.vue'
import { getContactListAPI, type ContactItem as APIContactItem } from '../services/contact'

const contactList = ref<APIContactItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 加载客服列表
const loadContacts = async () => {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getContactListAPI()

    if (res.code === 200) {
      const mappedData: APIContactItem[] = res.data.list || []

      if (page.value === 1) {
        contactList.value = mappedData
      } else {
        contactList.value.push(...mappedData)
      }

      // 判断是否还有更多数据
      const total = res.data?.total || 0
      const currentPage = res.data?.current_page || page.value
      const perPage = res.data?.per_page || mappedData.length
      hasMore.value = currentPage * perPage < total
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('加载客服列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMoreContacts = () => {
  page.value++
  loadContacts()
}

// 拨打电话
const handleMakeCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
    success: () => {
      console.log('拨打电话成功')
    },
    fail: (err) => {
      console.error('拨打电话失败:', err)
      uni.showToast({
        title: '拨打失败',
        icon: 'none',
      })
    },
  })
}

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

// 初始化加载
onMounted(() => {
  loadContacts()
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
