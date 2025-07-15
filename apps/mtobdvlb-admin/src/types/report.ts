export type ReportRequest = {
  begin: string
  end: string
}

export type ReportTurnoverResponse = {
  turnoverList: string
  dateList: string
}

export type ReportOrderResponse = {
  dateList: string
  /** 每日订单数，以逗号分隔，例如："260,210,215" */
  orderCountList: string

  /** 每日有效订单数，以逗号分隔，例如："20,21,10" */
  validOrderCountList: string

  /** 订单总数 */
  totalOrderCount: number

  /** 有效订单数 */
  validOrderCount: number

  /** 订单完成率 */
  orderCompletionRate: number
}

export type ReportUserResponse = {
  dateList: string
  totalUserList: string
  newUserList: string
}

export type ReportTop10Response = {
  nameList: string
  numberList: string
}
