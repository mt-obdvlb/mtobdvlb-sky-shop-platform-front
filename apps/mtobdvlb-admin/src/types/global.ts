export interface ApiResponse<T = undefined> {
  code: number
  data: T
  msg: string
}

export interface PageResponse<T> {
  total: number
  records: T[]
}
