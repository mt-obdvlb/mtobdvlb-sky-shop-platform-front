export type CategoryType = 1 | 2 // 1: 菜品 2: 套餐
export type CategoryStatus = 0 | 1 // 0: 禁用 1: 启用

export type Category = {
  id: number
  type: CategoryType
  name: string
  sort: number
  status: CategoryStatus
  createTime: string
  updateTime: string
  createUser: number
  updateUser: number
}

export type CategoryListResponse = Category[]
