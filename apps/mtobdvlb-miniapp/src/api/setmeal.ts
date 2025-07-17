import request from '@/utils/request'
import type { SetmealDishListByIdResponse, SetmealListResponse } from '@/types/setmeal'

const baseURL = '/setmeal'

const API = {
  list: '/list',
  dish: '/dish'
} as const

export const getSetmealList = (categoryId: number) =>
  request.get<SetmealListResponse>(`${baseURL}${API.list}`, {
    params: {
      categoryId
    }
  })

export const getSetmealDishListById = (id: number) =>
  request.get<SetmealDishListByIdResponse>(`${baseURL}${API.dish}/${id}`)
