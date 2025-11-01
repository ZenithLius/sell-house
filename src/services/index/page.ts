import { http } from '@/utils/http'
import type { BannerItem } from '@/types/home'

// 轮播图
export const getIndexBannerAPI = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/api/news/banner',
  })
}
