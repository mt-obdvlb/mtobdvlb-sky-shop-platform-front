export type ApiResponse<T = undefined> = {
  data?: T
  msg: string
  code: number
}
