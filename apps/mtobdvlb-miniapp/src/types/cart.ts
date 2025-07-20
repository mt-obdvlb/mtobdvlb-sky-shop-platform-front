export type ShoppingCart = {
  id: number
  name: string
  userId: number
  dishId?: number
  setmealId?: number
  dishFlavor?: string
  number: number
  amount: number // TypeScript 没有 BigDecimal，通常使用 number 表示金额
  image: string
  createTime: string // 或者 Date，根据实际情况处理
}

export type ShoppingCartRequest = {
  dishId?: number,
  setmealId?: number,
  dishFlavor?: string,
}

export type ShoppingCartListResponse = ShoppingCart[]