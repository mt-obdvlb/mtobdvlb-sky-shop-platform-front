export type CategoryStatus = 1 | 0
export type CategoryType = 1 | 2

export type Category = {
  createTime?: string
  createUser?: number
  id?: number
  name?: string
  status?: CategoryStatus // 1 启用 0禁用
  sort?: number
  type?: CategoryType // 1 菜品分类 2 套餐分类
  updateTime?: string
  updateUser?: number
}

export type CategoryAddRequest = {
  name: string
  id?: number
  sort: number
  type: CategoryType
}

export type CategoryUpdateRequest = Omit<CategoryAddRequest, 'id'> & { id: number }

export type CategoryPageRequest = {
  page: number
  pageSize: number
  name?: string
  type?: CategoryType
}

export type CategoryPageResponse = Category

export type CategoryGetByIdResponse = Category

export type CategoryListByTypeResponse = Category[]
