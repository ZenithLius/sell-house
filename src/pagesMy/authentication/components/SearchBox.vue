<template>
  <view class="search-container" :class="{ 'back-f5': backWhite }">
    <view class="search-input-wrapper" :class="{ 'back-white': backWhite }">
      <image class="search-icon" src="@/static/index/search.png"></image>
      <input
        v-model="searchValue"
        class="search-input"
        type="text"
        :placeholder="placeholder"
        @confirm="handleSearch"
      />
      <view class="search-button" @tap="handleSearch">
        {{ buttonText }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  placeholder?: string
  buttonText?: string
  modelValue?: string
  backWhite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索房源名称',
  buttonText: '搜索',
  modelValue: '',
  backWhite: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const searchValue = ref(props.modelValue)

const handleSearch = () => {
  emit('update:modelValue', searchValue.value)
  emit('search', searchValue.value)
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  background: #fff;
}

.back-white {
  background: #fff !important;
}

.back-f5 {
  background: #f5f5f5;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 24rpx;
  height: 76rpx;
  background: #f6f6f6;
  border-radius: 38rpx;
}

.search-icon {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 100%;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #775796;

  &::placeholder {
    color: #999;
  }
}

.search-button {
  padding: 0 32rpx;
  height: 38rpx;
  background: #863fce;
  border-radius: 19rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
</style>
