<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'任务管理-查看'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 60 + 'px' }">
      <!-- 房源名称 -->
      <view class="section-title">房源名称</view>

      <!-- 标签展示区域（只读，不可选中） -->
      <view class="tags-container">
        <view v-for="tag in taskTags" :key="tag.id" class="tag-item active">
          <text class="tag-text">{{ tag.name }}</text>
        </view>
      </view>

      <!-- 底部修改按钮 -->
      <view class="bottom-actions">
        <view class="edit-btn" @tap="handleEdit">
          <text class="edit-text">修改</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface TaskTag {
  id: number
  name: string
}

const { safeAreaInsets } = uni.getSystemInfoSync()

// 任务标签列表（只读）
const taskTags = ref<TaskTag[]>([])

// 页面参数
const pageParams = ref({
  id: '',
})

// 生成模拟数据（实际应该从接口获取）
const generateMockTags = (): TaskTag[] => {
  const tagNames = [
    '墙面翻新',
    '灯具安装',
    '拆除',
    '垃圾清运',
    '厨房改造',
    '门窗换新',
    '踢脚线',
    '吊顶',
  ]

  return tagNames.map((name, index) => ({
    id: index + 1,
    name,
  }))
}

// 返回
const handleBack = () => {
  uni.navigateBack()
}

// 跳转到修改页面
const handleEdit = () => {
  uni.navigateTo({
    url: `/pagesRenovation/taskManagement?id=${pageParams.value.id}`,
  })
}

// 页面加载
onLoad((options) => {
  if (options?.id) {
    pageParams.value.id = options.id as string
  }
})

// 初始化
onMounted(() => {
  // 模拟从接口获取数据
  taskTags.value = generateMockTags()

  // TODO: 实际应该调用接口获取数据
  // const res = await api.getTaskDetail(pageParams.value.id)
  // taskTags.value = res.data.tags
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #fff;

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
  padding: 0 30rpx 200rpx;
}

.section-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 36rpx;
  margin-bottom: 20rpx;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 120rpx;
}
.tag-item {
  height: 62rpx;
  min-width: 154rpx;
  background: #f7f7f7;
  border-radius: 12rpx;
  padding: 19rpx 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.8;
  }

  &.active {
    background: #eedeff;
    border-color: #863fce;

    .tag-text {
      color: #863fce;
    }
  }
}

.tag-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #863fce;
  line-height: 40rpx;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
}

.edit-btn {
  width: 100%;
  max-width: 690rpx;
  height: 80rpx;
  background: #863fce;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 80rpx 0 80rpx;

  &:active {
    opacity: 0.8;
  }
}

.edit-text {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #ffffff;
  line-height: 40rpx;
}
</style>
