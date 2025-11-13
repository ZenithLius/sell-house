<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  placeholder?: string
  buttonText?: string
  backgroundColor?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '你想看什么呢？',
  buttonText: '搜索',
  backgroundColor: 'rgba(255, 255, 255, 0.34)',
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clickButton: [value: string]
}>()

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  },
)

const handleInput = (e: any) => {
  const value = e.detail.value
  inputValue.value = value
  emit('update:modelValue', value)
}

const handleConfirm = () => {
  emit('search', inputValue.value)
}

const handleButtonClick = () => {
  emit('clickButton', inputValue.value)
}
</script>

<template>
  <view class="search" :style="{ background: backgroundColor }">
    <view class="search-left">
      <image class="search-icon" src="@/static/index/search.png"></image>
      <input
        class="search-text"
        type="text"
        :placeholder="placeholder"
        :value="inputValue"
        @input="handleInput"
        @confirm="handleConfirm"
        confirm-type="search"
      />
    </view>
    <text class="search-button" @tap.stop="handleButtonClick">{{ buttonText }}</text>
  </view>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 76rpx;
  margin: 16rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  border-radius: 38rpx;
  pointer-events: auto;
}

.search-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
}

.search-text {
  flex: 1;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #775796;
  background: transparent;
  border: none;
  outline: none;
}

.search-text::placeholder {
  color: #775796;
}

.search-button {
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  margin-right: 15rpx;
  width: 91rpx;
  height: 38rpx;
  background: #863fce;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
