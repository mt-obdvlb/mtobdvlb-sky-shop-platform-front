export type SetmealDish = {
  id?: number
  dishId: number
  setmealId?: number
  name: string
  price: number
  copies: number
}

export type SetmealStatus = 0 | 1

export type SetmealAddRequest = {
  name: string
  categoryId: number
  price: number
  status?: SetmealStatus
  description?: string
  image: string
  setmealDishes: SetmealDish[]
  id?: number
}

export type SetmealUpdateRequest = Omit<SetmealAddRequest, 'id'> & { id: number }

export type SetmealPageRequest = {
  page: number
  pageSize: number
  name?: string
  status?: SetmealStatus
  categoryId?: number
}

export type SetmealGetByIdResponse = {
  id: number
  name: string
  categoryId: number
  price: number
  status: SetmealStatus
  description: string
  image: string
  setmealDishes: SetmealDish[]
  updateTime: string
  categoryName: string
}

export type SetmealPageResponse = SetmealGetByIdResponse
