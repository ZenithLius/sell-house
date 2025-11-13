<script setup lang="ts">
import type { CategoryItem } from '@/types/home'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

defineProps<{
  list: CategoryItem[]
}>()

const emit = defineEmits(['login'])

const handleClick = (item: CategoryItem) => {
  if (!memberStore.profile && item.id !== '3') {
    emit('login')
    return
  }
  uni.switchTab({ url: item.url })
}
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      @click="handleClick(item)"
      v-for="item in list"
      :key="item.id"
    >
      <image class="icon" :src="item.icon"></image>
      <text class="text">{{ item.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss" scoped>
@import '../styles/category.scss';
</style>
