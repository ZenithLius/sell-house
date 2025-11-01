<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/styles/fonts.scss';
@import '@/styles/base.scss';

page {
  --safe-area-bottom-padding: calc(env(safe-area-inset-bottom) + 350rpx);
}

.uni-badge--primary {
  background-color: #863fce !important;
}
.uni-popup__wrapper {
  border-radius: 32rpx 32rpx 0 0 !important;
}
.uni-calendar-item--today {
  background-color: #863fce !important;
}

.uni-calendar-item__weeks-box-item.uni-calendar-item--checked,
.uni-calendar-item__weeks-box-item.uni-calendar-item--checked:hover {
  background-color: #863fce !important;
}
.uni-calendar-item__weeks-box-item.uni-calendar-item--before-checked,
.uni-calendar-item__weeks-box-item.uni-calendar-item--after-checked {
  background-color: rgba(134, 63, 206, 0.1) !important;
}
.uni-datetime-picker--btn {
  background-color: #863fce !important;
}
.uni-datetime-picker--btn:hover {
  background-color: rgba(134, 63, 206, 0.1) !important;
}
.uni-calendar--fixed {
  bottom: calc(env(safe-area-inset-bottom)) !important;
}
</style>
