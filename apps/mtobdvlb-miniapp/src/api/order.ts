import type { PageResponse } from "@/types/api"
import type { OrderGetByIdResponse, OrderPageRequest, OrderPageResponse, OrderPaymentRequest, OrderPaymentResponse, OrderSubmitRequest, OrderSubmitResponse } from "@/types/order"
import request from "@/utils/request"

const baseURL = '/order'

const API = {
  submit: '/submit',
  payment: '/payment',
  historyOrders: '/historyOrders',
  orderDetail: '/orderDetail',
  cancel: '/cancel',
  repetition: '/repetition',
  reminder: '/reminder'
} as const

export const submitOrder = (data: OrderSubmitRequest) => 
  request.post<OrderSubmitResponse>(`${baseURL}${API.submit}`, data)

export const payOrder = (data: OrderPaymentRequest) =>
  request.post<OrderPaymentResponse>(`${baseURL}${API.payment}`, data)

export const getHistoryOrders = (params: OrderPageRequest) =>
  request.get<PageResponse<OrderPageResponse>>(`${baseURL}${API.historyOrders}`, { params })

export const getOrderDetail = (id: number) =>
  request.get<OrderGetByIdResponse>(`${baseURL}${API.orderDetail}/${id}`)

export const cancelOrder = (id: number) =>
  request.post(`${baseURL}${API.cancel}/${id}`)

export const repetitionOrder = (id: number) =>
  request.post(`${baseURL}${API.repetition}/${id}`)

export const reminderOrder = (id: number) =>
  request.post(`${baseURL}${API.reminder}/${id}`)