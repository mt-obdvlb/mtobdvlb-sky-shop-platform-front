import type { CategoryListResponse, CategoryType } from '@/types/category'
import request from '@/utils/request'

const baseURL = '/category'

const API = {
  list: '/list'
} as const

export const getCategoryList = (type: CategoryType) =>
  request.get<CategoryListResponse>(`${baseURL}${API.list}`, {
    params: {
      type
    }
  })
