<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'关于我们'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="header-logo">
      <image
        class="about-image"
        src="@/pagesMy/static/aboutus.png"
        :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }"
        mode="aspectFill"
      ></image>
    </view>
    <scroll-view class="content" scroll-y>
      <view class="text-container">
        <!-- <view class="header">{{ header }} </view> -->
        <view class="text-content">
          <!-- 循环渲染解析后的内容 -->
          <block v-for="(item, index) in parsedContent" :key="index">
            <!-- 富文本部分 -->
            <rich-text
              v-if="item.type === 'html'"
              class="about-text"
              :nodes="item.content"
            ></rich-text>

            <!-- 视频部分 -->
            <video
              v-else-if="item.type === 'video'"
              class="content-video"
              :src="item.src"
              controls
              :show-fullscreen-btn="true"
              :show-play-btn="true"
              :enable-play-gesture="true"
            ></video>
          </block>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAgreementAPI } from '@/services/agreement'

const { safeAreaInsets } = uni.getSystemInfoSync()
const content = ref('')

interface ContentItem {
  type: 'html' | 'video'
  content?: string
  src?: string
}

const parsedContent = ref<ContentItem[]>([])

/**
 * 处理图片尺寸，使其自适应
 */
const processImages = (html: string): string => {
  // 移除img标签中的width和height属性，添加自适应样式
  return html.replace(
    /<img([^>]*?)(?:\s+width=["'][^"']*["'])?(?:\s+height=["'][^"']*["'])?([^>]*?)>/gi,
    (match, before, after) => {
      // 检查是否已有style属性
      const hasStyle = /style\s*=\s*["'][^"']*["']/i.test(before + after)
      if (hasStyle) {
        // 如果有style，在其中添加或替换相关属性
        return match.replace(/style\s*=\s*["']([^"']*)["']/i, (styleMatch, styleContent) => {
          let newStyle = styleContent
          // 移除可能存在的width和height
          newStyle = newStyle.replace(/width\s*:\s*[^;]+;?/gi, '')
          newStyle = newStyle.replace(/height\s*:\s*[^;]+;?/gi, '')
          // 添加自适应样式
          newStyle += '; max-width: 100%; height: auto; display: block;'
          return `style="${newStyle}"`
        })
      } else {
        // 如果没有style，直接添加
        return `<img${before}${after} style="max-width: 100%; height: auto; display: block;">`
      }
    },
  )
}

/**
 * 解析富文本，分离video标签
 */
const parseContent = (html: string): ContentItem[] => {
  const result: ContentItem[] = []

  if (!html || !html.trim()) {
    return result
  }

  // 先处理图片
  html = processImages(html)

  // 使用正则表达式匹配video标签
  const videoRegex = /<video[^>]*src=["']([^"']*)["'][^>]*>.*?<\/video>/gi
  let lastIndex = 0
  let match

  // 重置正则表达式的lastIndex
  videoRegex.lastIndex = 0

  while ((match = videoRegex.exec(html)) !== null) {
    // 添加video之前的HTML内容
    if (match.index > lastIndex) {
      const htmlContent = html.substring(lastIndex, match.index).trim()
      if (htmlContent) {
        result.push({
          type: 'html',
          content: htmlContent,
        })
      }
    }

    // 添加video
    result.push({
      type: 'video',
      src: match[1],
    })

    lastIndex = videoRegex.lastIndex
  }

  // 添加剩余的HTML内容
  if (lastIndex < html.length) {
    const htmlContent = html.substring(lastIndex).trim()
    if (htmlContent) {
      result.push({
        type: 'html',
        content: htmlContent,
      })
    }
  }

  // 如果没有找到video标签，返回整个处理后的html
  if (result.length === 0) {
    result.push({
      type: 'html',
      content: html,
    })
  }

  return result
}
const header = ref('')
onLoad(() => {
  getAgreementAPI('15').then((res) => {
    content.value = res.data?.content || ''
    // 解析内容
    parsedContent.value = parseContent(content.value)
    header.value = res.data?.title || ''
  })
})

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f7f8fc;
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
}

.content {
  flex: 1;
  height: 100%;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
  .header {
    padding: 30rpx 30rpx 10rpx 30rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
}

.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 93rpx;

  .about-image {
    width: 331rpx;
    height: 104rpx;
  }
}

.text-container {
  margin: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

.text-content {
  padding: 38rpx 54rpx 38rpx 49rpx;
}

.about-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 48rpx;
  word-break: break-all;
  white-space: pre-wrap;

  :deep(img) {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 20rpx 0;
  }
}

.content-video {
  width: 100%;
  height: 400rpx;
  margin: 20rpx 0;
  background-color: #000;
  border-radius: 10rpx;
  overflow: hidden;
}
</style>
