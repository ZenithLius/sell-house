import { ref, reactive } from 'vue'
import {
  getAreaListAPI,
  getPriceTotalListAPI,
  getPriceUnitListAPI,
  getLayoutListAPI,
  getTypeListAPI,
  getMoreAreaListAPI,
  getMoreOrientationListAPI,
  getMoreFeatureListAPI,
} from '@/services/index/page'
import type {
  AreaItem,
  PriceItem,
  LayoutItem,
  TypeItem,
  AreaRangeItem,
  OrientationItem,
  FeatureItem,
} from '@/types/home'

// 筛选项配置
export const filterItems = ref([
  { id: 'area', label: '区域', active: false },
  { id: 'price', label: '价格', active: false },
  { id: 'layout', label: '户型', active: false },
  { id: 'type', label: '类型', active: false },
  { id: 'more', label: '更多', active: false },
])

// 抽屉状态
export const drawerVisible = ref(false)
export const currentFilter = ref<any>(null)

// 抽屉内的筛选项
export const drawerFilterItems = ref([
  { id: 'area', label: '区域', active: false },
  { id: 'price', label: '价格', active: false },
  { id: 'layout', label: '户型', active: false },
  { id: 'type', label: '类型', active: false },
  { id: 'more', label: '更多', active: false },
])

// 筛选选项数据配置（使用 reactive 以确保嵌套变更可响应）
export const filterOptionsMap = reactive<Record<string, any[]>>({
  area: [{ id: 0, title: '不限', selected: true }],
  layout: [{ order_id: 0, selected: true }],
  type: [{ id: 0, title: '不限', selected: true }],
})

// 当前抽屉显示的选项
export const currentOptions = ref<any[]>([])

// 价格分组选项
export const priceTotalOptions = ref<PriceItem[]>([
  { id: 0, min_price: 0, max_price: 0, selected: true },
])
export const priceUnitOptions = ref<PriceItem[]>([
  { id: 0, min_price: 0, max_price: 0, selected: true },
])

// 更多分组选项
export const moreAreaOptions = ref<AreaRangeItem[]>([
  { id: 0, min_area: 0, max_area: 0, selected: true },
])
export const moreOrientationOptions = ref<OrientationItem[]>([
  { id: 0, title: '不限', selected: true },
])
export const moreFeatureOptions = ref<FeatureItem[]>([{ id: 0, title: '不限', selected: true }])

// 辅助函数：格式化价格显示文本
export const formatPriceLabel = (item: PriceItem): string => {
  if (item.id === 0) return '不限'
  if (item.max_price === 0) return `${item.min_price}万以上`
  if (item.min_price === 0) return `${item.max_price}万以下`
  return `${item.min_price}-${item.max_price}万`
}

// 辅助函数：格式化面积显示文本
export const formatAreaLabel = (item: AreaRangeItem): string => {
  if (item.id === 0) return '不限'
  if (item.max_area === 0) return `${item.min_area}㎡以上`
  if (item.min_area === 0) return `${item.max_area}㎡以下`
  return `${item.min_area}-${item.max_area}㎡`
}

// 辅助函数：格式化户型显示文本
export const formatLayoutLabel = (item: LayoutItem): string => {
  if (item.order_id === 0) return '不限'
  return `${item.order_id}室`
}

// 初始化筛选数据
export const initFilterData = async () => {
  try {
    // 获取区域列表
    const areaRes = await getAreaListAPI()
    if (areaRes.data && areaRes.data.length > 0) {
      filterOptionsMap.area = [
        { id: 0, title: '不限', selected: true },
        ...areaRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取总价列表
    const priceTotalRes = await getPriceTotalListAPI()
    if (priceTotalRes.data && priceTotalRes.data.length > 0) {
      priceTotalOptions.value = [
        { id: 0, min_price: 0, max_price: 0, selected: true },
        ...priceTotalRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取单价列表
    const priceUnitRes = await getPriceUnitListAPI()
    if (priceUnitRes.data && priceUnitRes.data.length > 0) {
      priceUnitOptions.value = [
        { id: 0, min_price: 0, max_price: 0, selected: true },
        ...priceUnitRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取户型列表
    const layoutRes = await getLayoutListAPI()
    if (layoutRes.data && layoutRes.data.length > 0) {
      filterOptionsMap.layout = [
        { order_id: 0, selected: true },
        ...layoutRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取类型列表
    const typeRes = await getTypeListAPI()
    if (typeRes.data && typeRes.data.length > 0) {
      filterOptionsMap.type = [
        { id: 0, title: '不限', selected: true },
        ...typeRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取建筑面积列表
    const moreAreaRes = await getMoreAreaListAPI()
    if (moreAreaRes.data && moreAreaRes.data.length > 0) {
      moreAreaOptions.value = [
        { id: 0, min_area: 0, max_area: 0, selected: true },
        ...moreAreaRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取朝向列表
    const moreOrientationRes = await getMoreOrientationListAPI()
    if (moreOrientationRes.data && moreOrientationRes.data.length > 0) {
      moreOrientationOptions.value = [
        { id: 0, title: '不限', selected: true },
        ...moreOrientationRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }

    // 获取特色列表
    const moreFeatureRes = await getMoreFeatureListAPI()
    if (moreFeatureRes.data && moreFeatureRes.data.length > 0) {
      moreFeatureOptions.value = [
        { id: 0, title: '不限', selected: true },
        ...moreFeatureRes.data.map((item) => ({ ...item, selected: false })),
      ]
    }
  } catch (error) {
    console.error('筛选数据获取失败==', error)
  }
}

// 单选工具函数
export const selectSingle = (list: any[], option: any) => {
  list.forEach((o) => (o.selected = false))
  option.selected = true
}

// 价格选项点击
export const handlePriceOptionClick = (group: 'total' | 'unit', option: any) => {
  if (group === 'total') {
    selectSingle(priceTotalOptions.value, option)
  } else {
    selectSingle(priceUnitOptions.value, option)
  }
}

// 更多选项点击
export const handleMoreOptionClick = (group: 'area' | 'orientation' | 'feature', option: any) => {
  if (group === 'area') {
    selectSingle(moreAreaOptions.value, option)
  } else if (group === 'orientation') {
    selectSingle(moreOrientationOptions.value, option)
  } else {
    selectSingle(moreFeatureOptions.value, option)
  }
}

// 点击筛选项
export const handleFilterClick = (item: any) => {
  if (item.active) {
    item.active = false
    drawerVisible.value = false
    currentFilter.value = null
    return
  }

  // 关闭其他项
  filterItems.value.forEach((f) => {
    if (f.id !== item.id) {
      f.active = false
    }
  })

  // 激活当前项
  item.active = true
  currentFilter.value = item

  // 设置当前选项数据
  currentOptions.value = filterOptionsMap[item.id] || []

  // 同步抽屉内的筛选项状态
  drawerFilterItems.value.forEach((f) => {
    f.active = f.id === item.id
  })

  // 打开抽屉
  drawerVisible.value = true
}

// 抽屉内点击筛选项
export const handleDrawerFilterClick = (item: any) => {
  // 关闭其他项
  drawerFilterItems.value.forEach((f) => {
    if (f.id !== item.id) {
      f.active = false
    }
  })

  // 切换当前项
  item.active = !item.active

  if (item.active) {
    currentFilter.value = item
    currentOptions.value = filterOptionsMap[item.id] || []
  } else {
    currentFilter.value = null
    currentOptions.value = []
  }
}

// 点击选项
export const handleOptionClick = (option: any) => {
  selectSingle(currentOptions.value, option)
}

// 关闭抽屉
export const closeDrawer = () => {
  drawerVisible.value = false
  filterItems.value.forEach((f) => {
    f.active = false
  })
  drawerFilterItems.value.forEach((f) => {
    f.active = false
  })
  currentFilter.value = null
}

// 重置
export const handleReset = () => {
  // 1) 重置区域、户型、类型
  ;(['area', 'layout', 'type'] as const).forEach((key) => {
    const list = filterOptionsMap[key] || []
    list.forEach((o: any, i: number) => (o.selected = i === 0))
  })

  // 2) 重置价格（总价、单价）
  priceTotalOptions.value.forEach((o, i) => (o.selected = i === 0))
  priceUnitOptions.value.forEach((o, i) => (o.selected = i === 0))

  // 3) 重置更多（面积、朝向、特色）
  moreAreaOptions.value.forEach((o, i) => (o.selected = i === 0))
  moreOrientationOptions.value.forEach((o, i) => (o.selected = i === 0))
  moreFeatureOptions.value.forEach((o, i) => (o.selected = i === 0))

  // 4) 若当前是非分组项
  if (currentFilter.value && currentFilter.value.id && filterOptionsMap[currentFilter.value.id]) {
    currentOptions.value = filterOptionsMap[currentFilter.value.id]
  } else {
    currentOptions.value = []
  }
}

// 获取所有选中的筛选项
export const getAllSelectedFilters = () => {
  const result: Record<string, any> = {}
  // 区域
  const selectedArea = filterOptionsMap.area.find((o) => o.selected)
  if (selectedArea && selectedArea.id !== 0) {
    result.area = selectedArea
  }

  // 价格（总价  单价）
  const selectedPriceTotal = priceTotalOptions.value.find((o) => o.selected)
  const selectedPriceUnit = priceUnitOptions.value.find((o) => o.selected)
  if (selectedPriceTotal && selectedPriceTotal.id !== 0) {
    result.priceTotal = selectedPriceTotal
  }
  if (selectedPriceUnit && selectedPriceUnit.id !== 0) {
    result.priceUnit = selectedPriceUnit
  }

  // 户型
  const selectedLayout = filterOptionsMap.layout.find((o) => o.selected)
  if (selectedLayout && selectedLayout.order_id !== 0) {
    result.layout = selectedLayout
  }

  // 类型
  const selectedType = filterOptionsMap.type.find((o) => o.selected)
  if (selectedType && selectedType.id !== 0) {
    result.type = selectedType
  }

  // 更多（包含面积、朝向、特色）
  const selectedMoreArea = moreAreaOptions.value.find((o) => o.selected)
  const selectedMoreOrientation = moreOrientationOptions.value.find((o) => o.selected)
  const selectedMoreFeature = moreFeatureOptions.value.find((o) => o.selected)
  if (selectedMoreArea && selectedMoreArea.id !== 0) {
    result.moreArea = selectedMoreArea
  }
  if (selectedMoreOrientation && selectedMoreOrientation.id !== 0) {
    result.moreOrientation = selectedMoreOrientation
  }
  if (selectedMoreFeature && selectedMoreFeature.id !== 0) {
    result.moreFeature = selectedMoreFeature
  }

  return result
}

// 确定
export const handleConfirm = (callback?: (filters: Record<string, any>) => void) => {
  // 收集所有选中的筛选项
  const allSelectedFilters = getAllSelectedFilters()
  console.log('所有选中的筛选项11111111111', allSelectedFilters)

  // 回调
  if (callback) {
    callback(allSelectedFilters)
  }

  closeDrawer()
}

// 关闭
export const handleMaskClick = () => {
  closeDrawer()
}

export const useFilterState = () => {
  return {
    filterItems,
    drawerVisible,
    currentFilter,
    drawerFilterItems,
    filterOptionsMap,
    currentOptions,
    priceTotalOptions,
    priceUnitOptions,
    moreAreaOptions,
    moreOrientationOptions,
    moreFeatureOptions,
    selectSingle,
    handlePriceOptionClick,
    handleMoreOptionClick,
    handleFilterClick,
    handleDrawerFilterClick,
    handleOptionClick,
    closeDrawer,
    handleReset,
    handleConfirm,
    handleMaskClick,
    getAllSelectedFilters,
    initFilterData,
    formatPriceLabel,
    formatAreaLabel,
    formatLayoutLabel,
  }
}
