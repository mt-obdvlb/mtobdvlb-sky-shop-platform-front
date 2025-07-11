export type DishStatus = 0 | 1 // 1启用 0禁用

export interface Dish {
  categoryId?: number
  createTime?: string
  createUser?: number
  description?: string
  id?: number
  image?: string
  name?: string
  price?: number
  status?: number
  updateTime?: string
  updateUser?: number
}

export type DishFlavor = {
  dishId?: number
  id?: number
  name: string
  value: string
}

export type DishUpdateRequest = {
  categoryId: number
  description?: string
  flavors?: DishFlavor[]
  id: number
  image: string
  name: string
  price: number
  status?: number
}

export type DishAddRequest = Omit<DishUpdateRequest, 'id'> & { id?: number }

export type DishPageRequest = {
  page: number
  pageSize: number
  name?: string
  categoryId?: number
  status?: DishStatus
}

export type DishGetByIdResponse = {
  categoryId: number
  categoryName: string
  description: string
  flavors: DishFlavor[]
  id: number
  image: string
  name: string
  price: number
  status: number
  updateTime: string
}

export type DishListResponse = Dish[]

export type DishPageResponse = DishGetByIdResponse
