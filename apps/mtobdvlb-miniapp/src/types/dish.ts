export type DishStatus = 0 | 1 // 1启用 0禁用

export type DishFlavor = {
  id: number
  name: string
  value: string
  dishId: number
}

export type Dish = {
  id: number
  name: string
  categoryId: number
  price: number
  image: string
  description: string
  status: DishStatus
  updateTime: string
  categoryName: string
  dishFlavors: DishFlavor[]
  type?: string // 'dish' or 'setmeal'
}

export type DishItem = {
  name: string
  copies: number
  image: string
  description: string
}

export type DishListResponse = Dish[]
