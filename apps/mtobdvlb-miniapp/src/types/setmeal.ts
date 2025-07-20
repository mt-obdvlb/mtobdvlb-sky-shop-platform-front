import type { DishItem } from '@/types/dish'

export type SetmealStatus = 0 | 1 // 1启用 0禁用

export type Setmeal = {
  id: number
  name: string
  categoryId: number
  price: number
  image: string
  status: SetmealStatus
  description: string
  updateTime: string
  createTime: string
  createUser: number
  updateUser: number
  type: string // 'dish' or 'setmeal'
}

export type SetmealListResponse = Setmeal[]

export type SetmealDishListByIdResponse = DishItem[]
