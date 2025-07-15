export type SocketType = 1 | 2 // 1下单， 2催单

export type SocketResponse = {
  type: SocketType
  orderId: number
  content: string
}
