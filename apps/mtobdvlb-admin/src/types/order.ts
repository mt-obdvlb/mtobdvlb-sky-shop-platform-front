// 订单状态
export const OrderStatus = {
  PENDING_PAYMENT: 1,
  TO_BE_CONFIRMED: 2,
  CONFIRMED: 3,
  DELIVERY_IN_PROGRESS: 4,
  COMPLETED: 5,
  CANCELLED: 6
} as const

// 支付状态
export const PayStatus = {
  UN_PAID: 0, // 未支付
  PAID: 1, // 已支付
  REFUND: 2 // 退款
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
export type PayStatus = (typeof PayStatus)[keyof typeof PayStatus]

export type OrderDetail = {
  id: number
  name: string
  orderId: number
  dishId?: number
  setmealId?: number
  dishFlavor: string
  number: number
  amount: number
  image: string
}

export interface Order {
  /** 订单ID */
  id: number

  /** 订单号 */
  number: string

  /** 订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款 */
  status: OrderStatus

  /** 下单用户id */
  userId: number

  /** 地址id */
  addressBookId: number

  /** 下单时间 */
  orderTime: string // ISO 8601 格式的日期字符串，例如 "2025-07-12T21:00:00"

  /** 结账时间 */
  checkoutTime: string

  /** 支付方式 1 微信，2支付宝 */
  payMethod: number

  /** 支付状态 0未支付 1已支付 2退款 */
  payStatus: PayStatus

  /** 实收金额 */
  amount: number // 对应 Java 的 BigDecimal，TS 里用 number

  /** 备注 */
  remark: string

  /** 用户名 */
  userName: string

  /** 手机号 */
  phone: string

  /** 地址 */
  address: string

  /** 收货人 */
  consignee: string

  /** 订单取消原因 */
  cancelReason: string

  /** 订单拒绝原因 */
  rejectionReason: string

  /** 订单取消时间 */
  cancelTime: string

  /** 预计送达时间 */
  estimatedDeliveryTime: string

  /** 配送状态 1立即送出 0选择具体时间 */
  deliveryStatus: number

  /** 送达时间 */
  deliveryTime: string

  /** 打包费 */
  packAmount: number

  /** 餐具数量 */
  tablewareNumber: number

  /** 餐具数量状态 1按餐量提供 0选择具体数量 */
  tablewareStatus: number
}

export interface OrderGetByIdResponse extends Order {
  orderDishes: string
  orderDetailList: OrderDetail[]
}

export type OrderPageRequest = {
  page: number
  pageSize: number
  number?: string
  phone?: string
  beginTime?: string
  endTime?: string
  status?: OrderStatus
  userId?: number
}

export type OrderPageResponse = OrderGetByIdResponse

export type OrderCancelRequest = {
  id: number
  cancelReason: string
}

export type OrderRejectionRequest = {
  id: number
  rejectionReason: string
}

export type OrderConfirmRequest = {
  id: number
  status: OrderStatus
}

export type OrderStatisticsResponse = {
  toBeConfirmed: number
  confirmed: number
  deliveryInProgress: number
}
