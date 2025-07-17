import type { DishListResponse } from '@/types/dish'
import request from '@/utils/request'

const baseURL = '/dish'

const API = {
  list: '/list'
} as const

export const getDishList = (categoryId: number) =>
  request.get<DishListResponse>(`${baseURL}${API.list}`, {
    params: { categoryId }
  })
