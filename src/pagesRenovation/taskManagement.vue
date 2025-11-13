<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'任务管理-修改'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 60 + 'px' }">
      <!-- 房源名称 -->
      <view class="section-title">房源名称</view>

      <!-- 提示信息 -->
      <view class="tip-box">
        <view class="tip-icon">
          <image class="tip-icon" src="/static/index/notice.png" mode="aspectFit"></image
        ></view>
        <text class="tip-text">选择下面流程创建任务，可多选。</text>
      </view>

      <!-- 标签选择区域 -->
      <view class="tags-container">
        <view
          v-for="tag in taskTags"
          :key="tag.id"
          class="tag-item"
          :class="{ active: tag.selected }"
          @tap="toggleTag(tag.id)"
        >
          <text class="tag-text">{{ tag.name }}</text>
        </view>

        <!-- 新增按钮 -->
        <view class="tag-item add-btn" @tap="handleAddTag">
          <text class="add-icon">+</text>
          <text class="add-text">新增</text>
        </view>
      </view>

      <!-- 底部操作区 -->
      <view class="bottom-actions">
        <view class="select-all-box" @tap="toggleSelectAll">
          <view class="checkbox" :class="{ checked: isAllSelected }">
            <text v-if="isAllSelected" class="check-icon">✓</text>
          </view>
          <text class="select-all-text">全选</text>
        </view>

        <view class="save-btn" @tap="handleSave">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 新增标签弹窗 -->
    <view v-if="showAddDialog" class="dialog-overlay" @tap="closeAddDialog">
      <view class="dialog-container" @tap.stop>
        <view class="dialog-title">新增步骤</view>

        <view class="dialog-content">
          <view class="input-row">
            <text class="input-label">步骤名称：</text>
            <input
              v-model="newTagName"
              class="input-field"
              placeholder="请输入"
              placeholder-class="input-placeholder"
              :maxlength="20"
              :cursor-spacing="20"
            />
          </view>
        </view>

        <view class="dialog-actions">
          <view class="dialog-btn cancel-btn" @tap="closeAddDialog">
            <text class="btn-text">取消</text>
          </view>
          <view class="dialog-btn confirm-btn" @tap="confirmAddTag">
            <text class="btn-text">保存</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTaskListAPI } from './services'
import { onShow } from '@dcloudio/uni-app'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

onShow(() => {
  getTaskListReq()
})

//  获取所有任务列表数据
const getTaskListReq = async () => {
  uni.showLoading({
    title: '加载中',
  })
  const res = await getTaskListAPI({})
  console.log('res====================', res)

  // 将后台返回的数据转换为 TaskTag 格式
  if (res.data && Array.isArray(res.data)) {
    taskTags.value = res.data.map((item: any) => ({
      id: item.id,
      name: item.title,
      selected: false,
    }))
  }

  uni.hideLoading()
}

interface TaskTag {
  id: number
  name: string
  selected: boolean
}

const { safeAreaInsets } = uni.getSystemInfoSync()

// 任务标签列表
const taskTags = ref<TaskTag[]>([])

// 弹窗相关
const showAddDialog = ref(false)
const newTagName = ref('')

// 是否全选
const isAllSelected = computed(() => {
  return taskTags.value.length > 0 && taskTags.value.every((tag) => tag.selected)
})

// 切换标签选中状态
const toggleTag = (id: number) => {
  const tag = taskTags.value.find((t) => t.id === id)
  if (tag) {
    tag.selected = !tag.selected
  }
}

// 切换全选
const toggleSelectAll = () => {
  const newState = !isAllSelected.value
  taskTags.value.forEach((tag) => {
    tag.selected = newState
  })
}

// 打开新增标签弹窗
const handleAddTag = () => {
  showAddDialog.value = true
  newTagName.value = ''
}

// 关闭新增标签弹窗
const closeAddDialog = () => {
  showAddDialog.value = false
  newTagName.value = ''
}

// 确认新增标签
const confirmAddTag = () => {
  const trimmedName = newTagName.value.trim()

  if (!trimmedName) {
    uni.showToast({
      title: '请输入步骤名称',
      icon: 'none',
    })
    return
  }

  // 检查是否已存在
  const exists = taskTags.value.some((tag) => tag.name === trimmedName)
  if (exists) {
    uni.showToast({
      title: '该步骤已存在',
      icon: 'none',
    })
    return
  }

  // 生成新的ID（取当前最大ID + 1）
  const maxId = taskTags.value.reduce((max, tag) => Math.max(max, tag.id), 0)
  const newTag: TaskTag = {
    id: maxId + 1,
    name: trimmedName,
    selected: false,
  }

  // 添加到列表
  taskTags.value.push(newTag)

  uni.showToast({
    title: '添加成功',
    icon: 'success',
  })

  // 关闭弹窗
  closeAddDialog()

  // TODO: 调用接口保存新标签
}

// 保存
const handleSave = () => {
  const selectedTags = taskTags.value.filter((tag) => tag.selected)
  console.log('选中的标签:', selectedTags)

  if (selectedTags.length === 0) {
    uni.showToast({
      title: '请至少选择一个任务',
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: `已选择${selectedTags.length}个任务`,
    icon: 'success',
  })

  // TODO: 调用保存接口
}

// 返回
const handleBack = () => {
  uni.navigateBack()
}

// 初始化
// onMounted(() => {
//   // 模拟从接口获取数据
//   taskTags.value = generateMockTags()
// })
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

.tip-box {
  display: flex;
  align-items: center;
  height: 60rpx;
  gap: 13rpx;
  background: #f5ecff;
  border-radius: 18rpx;
  margin-bottom: 32rpx;
  padding: 18rpx;
}

.tip-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
  font-size: 32rpx;
  color: #863fce;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #863fce;
  line-height: 42rpx;
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
  color: #1c1c1c;
  line-height: 40rpx;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #ffffff;
  border-radius: 12rpx;
  border: 1px solid #863fce;

  &:active {
    opacity: 0.8;
  }
}

.add-icon {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #863fce;
  line-height: 40rpx;
}

.add-text {
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
  gap: 24rpx;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
}

.select-all-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &.checked {
    background: #863fce;
    border-color: #863fce;
  }
}

.check-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

.select-all-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #494949;
  line-height: 42rpx;
}

.save-btn {
  flex: 1;
  height: 88rpx;
  background: #863fce;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }
}

.save-text {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #ffffff;
  line-height: 40rpx;
}

// 弹窗样式
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.dialog-container {
  width: 100%;
  background: #fff;
  border-radius: 38rpx 38rpx 0 0;
  padding: 48rpx 40rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.dialog-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 31rpx;
  color: #020202;
  line-height: 42rpx;
  text-align: center;
  margin-bottom: 40rpx;
}

.dialog-content {
  margin-bottom: 48rpx;
}

.input-row {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #f5f6f7;
  border-radius: 12rpx;
}

.input-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #1d1d1d;
  line-height: 42rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #1c1c1c;
  line-height: 40rpx;
  margin-left: 16rpx;
}

.input-placeholder {
  color: #999;
}

.dialog-actions {
  display: flex;
  gap: 24rpx;
  padding: 0 50rpx 0 50rpx;
}

.dialog-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }

  .btn-text {
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-size: 32rpx;
    line-height: 40rpx;
  }
}

.cancel-btn {
  background: #fff;
  border: 2px solid #eaeaea;
  width: 248rpx;

  .btn-text {
    color: #1c1c1c;
  }
}

.confirm-btn {
  background: #863fce;
  width: 248rpx;

  .btn-text {
    color: #fff;
  }
}
</style>
