import { createSSRApp } from 'vue'
import App from './App.vue'

import pinia from './stores'
import uviewPlus from '@/uni_modules/uview-plus'
import { onShareAppMessage, onShareTimeline } from './composables/share'

export function createApp() {
  // 创建 vue 实例
  const app = createSSRApp(App)

  // 使用 pinia
  app.use(pinia)
  app.use(uviewPlus)
  app.mixin({
    onShareAppMessage,
    onShareTimeline,
  })

  return {
    app,
  }
}
