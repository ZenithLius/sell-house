import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue'

/**
 * 分页响应数据接口
 */
export interface PaginationResponse<T> {
  list: T[] // 数据列表
  total?: number // 总数（可选）
  hasMore?: boolean // 是否有更多数据（可选，如果不提供则根据 pageSize 判断）
}

/**
 * 配置选项
 */
export interface UseScrollRefreshOptions<T, P = any> {
  // ========== 必需参数 =========
  fetchData: (page: number, params?: P) => Promise<T[] | PaginationResponse<T>>

  // ========== 分页配置 ==========

  pageSize?: number

  initialPage?: number

  // ========== 滚动配置 ==========

  lowerThreshold?: number

  enableRefresh?: boolean

  enableLoadMore?: boolean

  // ========== 初始化配置 ==========

  immediate?: boolean

  initialData?: T[]

  // ========== 错误处理 ==========

  showErrorToast?: boolean

  errorToastText?: {
    refresh?: string
    loadMore?: string
  }

  // ========== 生命周期钩子 ==========
  /** 下拉刷新开始 */
  onRefreshStart?: () => void
  /** 下拉刷新结束 */
  onRefreshEnd?: (data: T[]) => void
  /** 上拉加载开始 */
  onLoadMoreStart?: () => void
  /** 上拉加载结束 */
  onLoadMoreEnd?: (data: T[]) => void
  /** 错误回调 */
  onError?: (error: any, type: 'refresh' | 'loadMore') => void
  /** 数据为空回调 */
  onEmpty?: () => void
}

/**
 * 返回值接口
 */
export interface UseScrollRefreshReturn<T, P = any> {
  // ========== 数据状态 ==========

  list: Ref<T[]>

  currentPage: Ref<number>

  hasMore: Ref<boolean>

  isLoading: Ref<boolean>

  isEmpty: ComputedRef<boolean>

  total: Ref<number>

  // ========== 刷新状态 ==========

  isTriggered: Ref<boolean>

  isRefreshing: Ref<boolean>

  // ========== 滚动控制 ==========

  programmaticScrollTop: Ref<number>

  // ========== 核心方法 ==========

  onRefresherrefresh: () => Promise<void>

  handleScrollToLower: () => Promise<void>

  refresh: (params?: P) => Promise<void>

  loadMore: (params?: P) => Promise<void>

  reset: () => void

  scrollToTop: () => void

  setList: (data: T[]) => void

  addItem: (item: T, position?: 'start' | 'end') => void

  removeItem: (predicate: (item: T) => boolean) => void

  updateItem: (predicate: (item: T) => boolean, updater: (item: T) => T) => void

  scrollViewProps: {
    refresherEnabled: boolean
    refresherTriggered: Ref<boolean>
    scrollTop: Ref<number>
    lowerThreshold: number
  }
}

/**
 * 通用滚动刷新 Hook
 */
export function useScrollRefresh<T = any, P = any>(
  options: UseScrollRefreshOptions<T, P>,
): UseScrollRefreshReturn<T, P> {
  // ========== 解构配置 ==========
  const {
    fetchData,
    pageSize = 10,
    initialPage = 1,
    lowerThreshold = 100,
    enableRefresh = true,
    enableLoadMore = true,
    immediate = false,
    initialData = [],
    showErrorToast = true,
    errorToastText = {},
    onRefreshStart,
    onRefreshEnd,
    onLoadMoreStart,
    onLoadMoreEnd,
    onError,
    onEmpty,
  } = options

  // ========== 响应式状态 ==========
  const list = ref<T[]>(initialData) as Ref<T[]>
  const currentPage = ref(initialPage)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const isTriggered = ref(false)
  const isRefreshing = ref(false)
  const programmaticScrollTop = ref(0)
  const total = ref(0)

  // ========== 计算属性 ==========
  const isEmpty = computed(() => list.value.length === 0 && !isLoading.value && !isRefreshing.value)

  // ========== 内部状态锁 ==========
  let loadingLock = false

  /**
   * 处理获取到的数据
   */
  const handleFetchedData = (data: T[] | PaginationResponse<T>): T[] => {
    if (Array.isArray(data)) {
      return data
    } else {
      // 处理分页响应对象
      if (data.total !== undefined) {
        total.value = data.total
      }
      if (data.hasMore !== undefined) {
        hasMore.value = data.hasMore
      }
      return data.list
    }
  }

  /**
   * 下拉刷新
   */
  const onRefresherrefresh = async () => {
    if (!enableRefresh || isRefreshing.value || loadingLock) return

    loadingLock = true
    isRefreshing.value = true
    isTriggered.value = true
    onRefreshStart?.()

    try {
      currentPage.value = initialPage
      const response = await fetchData(currentPage.value)
      const data = handleFetchedData(response)

      list.value = data

      // 判断是否还有更多数据
      if (Array.isArray(response)) {
        hasMore.value = data.length >= pageSize
      }

      onRefreshEnd?.(data)

      // 检查是否为空
      if (data.length === 0) {
        onEmpty?.()
      }
    } catch (error) {
      console.error('[useScrollRefresh] Refresh error:', error)
      onError?.(error, 'refresh')

      if (showErrorToast) {
        uni.showToast({
          title: errorToastText.refresh || '刷新失败',
          icon: 'none',
        })
      }
    } finally {
      isTriggered.value = false
      isRefreshing.value = false
      loadingLock = false
    }
  }

  /**
   * 上拉加载更多
   */
  const handleScrollToLower = async () => {
    if (!enableLoadMore || !hasMore.value || isLoading.value || loadingLock) {
      return
    }

    loadingLock = true
    isLoading.value = true
    onLoadMoreStart?.()

    try {
      currentPage.value++
      const response = await fetchData(currentPage.value)
      const data = handleFetchedData(response)

      // 拼接数据
      list.value = [...list.value, ...data]

      // 判断是否还有更多数据
      if (Array.isArray(response)) {
        hasMore.value = data.length >= pageSize
      }

      onLoadMoreEnd?.(data)
    } catch (error) {
      console.error('[useScrollRefresh] Load more error:', error)
      currentPage.value-- // 回退页码
      onError?.(error, 'loadMore')

      if (showErrorToast) {
        uni.showToast({
          title: errorToastText.loadMore || '加载失败',
          icon: 'none',
        })
      }
    } finally {
      isLoading.value = false
      loadingLock = false
    }
  }

  /**
   * 主动刷新（不触发下拉动画）
   */
  const refresh = async (params?: P) => {
    if (isRefreshing.value || loadingLock) return

    loadingLock = true
    isRefreshing.value = true
    isLoading.value = true

    try {
      currentPage.value = initialPage
      const response = await fetchData(currentPage.value, params)
      const data = handleFetchedData(response)

      list.value = data

      // 判断是否还有更多数据
      if (Array.isArray(response)) {
        hasMore.value = data.length >= pageSize
      }

      // 检查是否为空
      if (data.length === 0) {
        onEmpty?.()
      }
    } catch (error) {
      console.error('[useScrollRefresh] Refresh error:', error)
      onError?.(error, 'refresh')

      if (showErrorToast) {
        uni.showToast({
          title: errorToastText.refresh || '刷新失败',
          icon: 'none',
        })
      }
    } finally {
      isLoading.value = false
      isRefreshing.value = false
      loadingLock = false
    }
  }

  /**
   * 加载更多（手动调用）
   */
  const loadMore = async (params?: P) => {
    if (!hasMore.value || isLoading.value || loadingLock) return

    loadingLock = true
    isLoading.value = true

    try {
      currentPage.value++
      const response = await fetchData(currentPage.value, params)
      const data = handleFetchedData(response)

      list.value = [...list.value, ...data]

      // 判断是否还有更多数据
      if (Array.isArray(response)) {
        hasMore.value = data.length >= pageSize
      }
    } catch (error) {
      console.error('[useScrollRefresh] Load more error:', error)
      currentPage.value--
      onError?.(error, 'loadMore')

      if (showErrorToast) {
        uni.showToast({
          title: errorToastText.loadMore || '加载失败',
          icon: 'none',
        })
      }
    } finally {
      isLoading.value = false
      loadingLock = false
    }
  }

  /**
   * 重置所有状态
   */
  const reset = () => {
    list.value = []
    currentPage.value = initialPage
    hasMore.value = true
    isLoading.value = false
    isTriggered.value = false
    isRefreshing.value = false
    total.value = 0
    loadingLock = false
  }

  /**
   * 滚动到顶部
   */
  const scrollToTop = () => {
    programmaticScrollTop.value = 0
    nextTick(() => {
      programmaticScrollTop.value = -1 // 重置以便下次可以再次滚动到顶部
    })
  }

  /**
   * 设置列表数据
   */
  const setList = (data: T[]) => {
    list.value = data
  }

  /**
   * 添加数据到列表
   */
  const addItem = (item: T, position: 'start' | 'end' = 'end') => {
    if (position === 'start') {
      list.value = [item, ...list.value]
    } else {
      list.value = [...list.value, item]
    }
  }

  /**
   * 移除列表项
   */
  const removeItem = (predicate: (item: T) => boolean) => {
    list.value = list.value.filter((item) => !predicate(item))
  }

  /**
   * 更新列表项
   */
  const updateItem = (predicate: (item: T) => boolean, updater: (item: T) => T) => {
    list.value = list.value.map((item) => (predicate(item) ? updater(item) : item))
  }

  // ========== 封装 scroll-view 属性 ==========
  const scrollViewProps = {
    refresherEnabled: enableRefresh,
    refresherTriggered: isTriggered,
    scrollTop: programmaticScrollTop,
    lowerThreshold,
  }

  // ========== 立即加载 ==========
  if (immediate) {
    refresh()
  }

  // ========== 返回 ==========
  return {
    // 数据状态
    list,
    currentPage,
    hasMore,
    isLoading,
    isEmpty,
    total,
    // 刷新状态
    isTriggered,
    isRefreshing,
    // 滚动控制
    programmaticScrollTop,
    // 核心方法
    onRefresherrefresh,
    handleScrollToLower,
    refresh,
    loadMore,
    reset,
    scrollToTop,
    setList,
    addItem,
    removeItem,
    updateItem,
    // scroll-view 属性
    scrollViewProps,
  }
}
