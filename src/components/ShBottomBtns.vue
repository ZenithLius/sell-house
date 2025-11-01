<template>
  <view
    :class="['bottom-btns', { 'bottom-btns--fixed': fixed }]"
    :style="{
      paddingBottom: `calc(${paddingBottom}rpx + env(safe-area-inset-bottom))`,
      background: backgroundColor,
    }"
  >
    <button
      v-for="(btn, index) in buttons"
      :key="index"
      class="btn"
      :style="{
        background: btn.background || '#863fce',
        color: btn.color || '#ffffff',
        border:
          btn.background === '#fff' || btn.background === '#ffffff' || btn.background === 'white'
            ? '2px solid #EAEAEA'
            : 'none',
      }"
      @tap="handleClick(index)"
    >
      {{ btn.text }}
    </button>
  </view>
</template>

<script setup lang="ts">
interface ButtonConfig {
  text: string
  background?: string
  color?: string
}

interface Props {
  buttons: ButtonConfig[]
  paddingBottom?: number
  backgroundColor?: string
  fixed?: boolean
}

withDefaults(defineProps<Props>(), {
  paddingBottom: 130,
  backgroundColor: '#f7f8fc',
  fixed: true,
})

const emit = defineEmits<{
  click: [index: number]
}>()

const handleClick = (index: number) => {
  emit('click', index)
}
</script>

<style lang="scss" scoped>
.bottom-btns {
  display: flex;
  gap: 30rpx;
  padding: 35rpx 60rpx;

  &--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .btn {
    flex: 1;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    border: none;
  }
}
</style>
