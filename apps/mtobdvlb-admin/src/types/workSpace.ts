export type WorkSpaceBusinessResponse = {
  turnover: number // 营业额
  validOrderCount: number // 有效订单数
  orderCompletionRate: number // 订单完成率
  unitPrice: number // 平均客单价
  newUsers: number // 新增用户数
}

export type WorkSpaceOrderOverViewResponse = {
  waitingOrders: number // 待接单数量
  deliveredOrders: number // 待派送数量
  completedOrders: number // 已完成数量
  cancelledOrders: number // 已取消数量
  allOrders: number // 全部订单
}

export type WorkSpaceDishOverViewResponse = {
  sold: number // 已启售数量
  discontinued: number // 已停售数量
}

export type WorkSpaceSetmealOverViewResponse = WorkSpaceDishOverViewResponse
