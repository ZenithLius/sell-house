<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="isRegister ? '负责人' : '身份认证'"
      :showBack="true"
      class="navbar-fixed"
      :home="false"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <view v-if="!isRegister" class="not-register">
        <ShAuthRegisterSection :type="type" @view-agreement="handleViewAgreement" />
      </view>
      <view v-else class="isRegister">
        <view class="head">
          <image src="@/pagesMy/static/upload.png" mode="aspectFit" class="head-icon"></image>
          <view class="label">负责人：</view>
          <view class="value">{{ manageName }}</view>
          <!-- 测试用：切换身份按钮 -->
          <!-- <view class="role-switch" @tap="switchRole">
            <text class="role-text">{{ userRole }}</text>
          </view> -->
        </view>

        <view class="tab">
          <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />
        </view>

        <view class="list">
          <RenovationList
            :list="currentList"
            :loading="loading"
            :hasMore="hasMore"
            :actionButtons="getActionButtons"
            @loadMore="handleLoadMore"
            @buttonClick="handleButtonClick"
          />
        </view>
      </view>

      <ShPopup
        ref="shPopupRef"
        title="上报完工"
        @cancel="handlePopupCancel"
        @confirm="handlePopupConfirm"
        confirmText="提交"
      >
        <view class="popup-content">
          <view class="content-1">确认上报装修完成</view>
          <view class="content-2">将由工长进行完成审核确认</view>
        </view>
      </ShPopup>

      <ShPopup
        ref="shPopupRef2"
        title="完工审核"
        @cancel="handlePopupCancel"
        @confirm="handlePopupConfirm"
        confirmText="提交"
      >
        <ShCustomForm v-model="formData" :fields="fields" />
      </ShPopup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CustomFormField } from '@/types/customFormField'
import RenovationList, {
  type RenovationItem,
  type ActionButton,
  type AuditProgress,
} from './components/RenovationList.vue'
import ShPopup from '@/components/ShPopup.vue'
import { getForemanListAPI, getRenovationListAPI } from './services'

/**
 * ==========================================================================
 *                                 @认证相关
 * ==========================================================================
 */
import { useUserStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
const userStore = useUserStore()

const isRegister = computed(() => {
  return userStore.userInfo?.is_project_manager === 1 || userStore.userInfo?.is_foreman === 1
})
// 当前角色 project_manager 装修负责人 foreman 工长
const currentRole = computed(() => {
  if (userStore.userInfo?.is_project_manager === 1) {
    return 'project_manager'
  } else if (userStore.userInfo?.is_foreman === 1) {
    return 'foreman'
  }
  return null
})
const type = ref('renovation')

const handleViewAgreement = () => {
  console.log('查看协议')
}

/**
 * ==========================================================================
 *                                 认证相关结束
 * ==========================================================================
 */

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

onLoad(() => {
  getRenovationListReq()
})

/**
 * ==================================获取房源列表========================================
 */
const manageName = ref('')
const getRenovationListReq = async () => {
  const params = {
    page: 1,
    per_page: 10,
    [currentRole.value === 'project_manager' ? 'allocate_status' : 'status']: activeTab.value,
  }
  const res =
    currentRole.value === 'project_manager'
      ? await getRenovationListAPI(params)
      : await getForemanListAPI(params)

  currentList.value = res.data.list.list
  manageName.value = res.data.nickname
}

// =========================================弹窗相关=============================================
const shPopupRef = ref<InstanceType<typeof ShPopup> | null>(null)

const shPopupRef2 = ref<InstanceType<typeof ShPopup> | null>(null)
// 弹窗取消
const handlePopupCancel = () => {
  shPopupRef.value?.close()
}
// 弹窗确认
const handlePopupConfirm = () => {
  shPopupRef.value?.close()
}

const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
  verificationCode: '',
  company: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: 'none',
    head: '',
    type: 'radio-group',
    options: [
      { title: '审核通过', id: 'approved' },
      { title: '审核驳回', id: 'rejected' },
    ],
    placeholder: '',
  },
  {
    key: 'area',
    label: 'none',
    head: '驳回原因',
    type: 'textarea',
    placeholder: '请输入驳回原因',
    visible: (form) => form.communityName === 'rejected',
  },
]

// =========================================弹窗相关=============================================

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

// 用户身份类型
const userRole = ref<'admin' | 'manager' | 'worker'>('admin') // 示例：admin-管理员, manager-经理, worker-工人

// 测试用：切换身份
const switchRole = () => {
  const roles: Array<'admin' | 'manager' | 'worker'> = ['admin', 'manager', 'worker']
  const currentIndex = roles.indexOf(userRole.value)
  const nextIndex = (currentIndex + 1) % roles.length
  userRole.value = roles[nextIndex]

  const roleNames = {
    admin: '管理员',
    manager: '负责人',
    worker: '工长',
  }

  uni.showToast({
    title: `切换为${roleNames[userRole.value]}`,
    icon: 'none',
  })
}

// 根据用户身份配置按钮
const getActionButtons = computed((): ActionButton[] => {
  // 管理员：显示所有按钮
  if (activeTab.value === '0' && currentRole.value === 'project_manager') {
    return [
      { key: 'taskManage', label: '任务管理' },
      { key: 'renovationRecord', label: '装修记录' },
    ]
  }
  if (activeTab.value === '1' && currentRole.value === 'project_manager') {
    return [
      { key: 'taskManage', label: '任务管理' },
      { key: 'renovationRecord', label: '装修记录' },
      { key: 'reportComplete', label: '上报完工' },
    ]
  }
  if (activeTab.value === '2' && currentRole.value === 'project_manager') {
    return [
      { key: 'taskManage', label: '任务管理' },
      { key: 'approve', label: '审核中' },
    ]
  }
  if (activeTab.value === '3' && currentRole.value === 'project_manager') {
    return [
      { key: 'taskManage', label: '任务管理' },
      { key: 'renovationRecord', label: '装修记录' },
    ]
  }
  return []
})

// Tab 配置
const tabs = computed((): any[] => {
  if (currentRole.value === 'project_manager') {
    return [
      { title: '未施工', id: '0', badge: false },
      { title: '施工中', id: '1', badge: false },
      { title: '已完工', id: '2', badge: false },
      { title: '已交付', id: '3', badge: false },
    ]
  }

  return [
    { title: '待审核', id: '1', badge: false },
    { title: '已审核', id: '2', badge: false },
    { title: '全部', id: '0', badge: false },
  ]
})

const activeTab = ref('0')

// 列表数据
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 5 // 每页5条，方便测试分页

// 模拟数据生成函数
const generateMockData = () => {
  const communities = [
    '封闭小区高端社区',
    '阳光花园小区',
    '绿城桂花园',
    '万科城市之光',
    '保利心语花园',
    '龙湖香醍漫步',
    '中海城市广场',
    '华润二十四城',
    '碧桂园凤凰城',
    '恒大绿洲',
    '融创壹号院',
    '金地格林小镇',
    '招商雍景湾',
    '绿地世纪城',
    '华侨城天鹅堡',
  ]

  const tags = [
    ['简装', '近公园', '交通便利'],
    ['精装', '学区房'],
    ['豪装', '近地铁', '商圈'],
    ['简装', '交通便利'],
    ['精装', '近公园', '学区房'],
    ['豪装', '近地铁', '商圈', '交通便利'],
    ['简装', '近公园'],
    ['精装', '学区房', '交通便利'],
  ]

  const addresses = [
    '陕西省西安市未央区汉城街道大明宫万达',
    '陕西省西安市雁塔区电子城街道高新路',
    '陕西省西安市碑林区南门外东大街',
    '陕西省西安市长安区韦曲街道长安路',
    '陕西省西安市灞桥区纺织城街道半坡路',
    '陕西省西安市高新区科技路',
    '陕西省西安市莲湖区北关街道北大街',
    '陕西省西安市新城区解放路',
  ]

  const workers = [
    '李四',
    '王五',
    '赵六',
    '孙七',
    '周八',
    '吴九',
    '郑十',
    '冯十一',
    '陈十二',
    '楚十三',
  ]

  const statuses: Record<string, string[]> = {
    'not-started': ['待施工', '准备中', '材料采购中', '方案设计中'],
    'in-progress': ['墙面翻修 进行中', '水电改造 进行中', '厨房装修 进行中', '卫生间改造 进行中'],
    completed: ['墙面翻修 已完成', '水电改造 已完成', '全屋装修 已完成', '局部翻新 已完成'],
    delivery: ['验收完成 已交付', '交付完成', '已交付'],
  }

  const result: Record<string, RenovationItem[]> = {
    'not-started': [],
    'in-progress': [],
    completed: [],
    delivery: [],
  }

  //mock
  Object.keys(result).forEach((status, statusIndex) => {
    for (let i = 0; i < 15; i++) {
      const id = statusIndex * 100 + i + 1
      const date = new Date(2025, 8, 4 - i) // 从9月4日往前推
      const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        '0',
      )}.${String(date.getDate()).padStart(2, '0')} ${String(10 + (i % 12)).padStart(
        2,
        '0',
      )}:${String((i * 5) % 60).padStart(2, '0')}:00`

      // 基础数据
      const item: RenovationItem = {
        id,
        datetime: dateStr,
        status: statuses[status][i % statuses[status].length],
        isCompleted: status === 'completed' || status === 'delivery', // 已完工和已交付显示绿色
        title: communities[i % communities.length],
        tags: tags[i % tags.length],
        address: `${addresses[i % addresses.length]}${10 + i}栋${(i % 3) + 1}单元${100 + i * 10}室`,
        roomNumber: String(100 + i),
        worker: workers[i % workers.length],
        workerPhone: `132${String(12345678 + i).slice(0, 8)}`,
      }

      // 为已完工状态的部分数据添加审核进度（模拟有的有，有的没有）
      if (status === 'completed') {
        // 每3条有1条包含审核进度
        if (i % 3 === 0) {
          const auditDate1 = new Date(2025, 9, 10 + i)
          const auditDateStr1 = `${auditDate1.getFullYear()}.${String(
            auditDate1.getMonth() + 1,
          ).padStart(2, '0')}.${String(auditDate1.getDate()).padStart(2, '0')} ${String(
            10 + (i % 12),
          ).padStart(2, '0')}:00`

          const auditStatuses = ['审核驳回', '审核通过', '待审核']
          const auditStatus = auditStatuses[i % auditStatuses.length]

          // 单条审核记录
          item.auditProgress = [
            {
              name: '完工审核',
              status: auditStatus,
              datetime: auditDateStr1,
              auditor: `张${i % 10}`,
              remark: auditStatus === '审核驳回' ? '驳回原因文案说明驳回原因文案说明' : undefined,
            },
          ]
        }

        // 第一条数据：添加多条审核通过记录
        if (i === 0) {
          item.auditProgress = [
            {
              name: '完工审核',
              status: '审核通过',
              datetime: '2025.10.10 10:00',
              auditor: '张三',
            },
            {
              name: '交付审核',
              status: '审核通过',
              datetime: '2025.10.10 10:00',
              auditor: '李四',
            },
          ]
        }
      }

      result[status].push(item)
    }
  })

  return result
}

// 模拟数据
const mockData: Record<string, RenovationItem[]> = generateMockData()

// 当前显示的列表
const allLists = ref<Record<string, RenovationItem[]>>({
  'not-started': [],
  'in-progress': [],
  completed: [],
  delivery: [],
})

const currentList = ref<any[]>([])

// 初始化加载
const initLoad = () => {
  loading.value = true
  currentPage.value = 1
  hasMore.value = true

  setTimeout(() => {
    const data = mockData[activeTab.value] || []
    allLists.value[activeTab.value] = data.slice(0, pageSize)
    hasMore.value = data.length > pageSize
    loading.value = false
  }, 500)
}

// Tab 切换
const handleTabChange = (value: string) => {
  console.log('切换tab', value)
  activeTab.value = value
  getRenovationListReq()
  if (allLists.value[value].length === 0) {
    initLoad()
  }
}

// 加载更多
const handleLoadMore = () => {
  if (loading.value || !hasMore.value) return

  console.log('触底加载更多，当前页:', currentPage.value)
  loading.value = true
  currentPage.value++

  setTimeout(() => {
    const data = mockData[activeTab.value] || []
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    const newData = data.slice(start, end)

    console.log(`加载第${currentPage.value}页，从${start}到${end}，新增${newData.length}条数据`)
    allLists.value[activeTab.value] = [...allLists.value[activeTab.value], ...newData]
    hasMore.value = end < data.length
    console.log(`当前共${allLists.value[activeTab.value].length}条数据，还有更多:${hasMore.value}`)
    loading.value = false
  }, 500)
}

// 统一的按钮点击处理
const handleButtonClick = (key: string, item: RenovationItem) => {
  console.log('按钮点击:', key, item)

  switch (key) {
    case 'taskManage':
      uni.navigateTo({ url: `/pagesRenovation/taskManagementView?id=${item.id}` })

      break
    case 'renovationRecord':
      console.log('装修记录', item)
      // TODO: 跳转到装修记录页面
      uni.navigateTo({ url: `/pagesMy/authentication/renovation?id=${item.id}` })
      break

    case 'reportComplete':
      console.log('上报完工', item)
      shPopupRef.value?.open()
      break

    case 'approve':
      console.log('审批', item)
      shPopupRef2.value?.open()
      break
    // case 'approve':
    //   shPopupRef2.value?.open()
    //   break
    default:
      console.warn('未知的按钮操作:', key)
  }
}

// 初始化
initLoad()
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 36rpx;
    row-gap: 10rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #3d0873;
    line-height: 42rpx;
  }
  .head {
    display: flex;
    align-items: center;
    column-gap: 20rpx;
    height: 92rpx;
    background: #eedeff;
    border-radius: 18rpx;
    margin: 20rpx 30rpx;
    padding: 24rpx 17rpx;
  }
  .head-icon {
    width: 32rpx;
    height: 32rpx;
  }
  .role-switch {
    margin-left: auto;
    padding: 8rpx 20rpx;
    background: #8b5cf6;
    border-radius: 30rpx;
    cursor: pointer;

    &:active {
      opacity: 0.8;
    }
  }
  .role-text {
    font-size: 24rpx;
    color: #ffffff;
  }
}
</style>
