import { baseApi } from '@/api/baseApi.ts'
import type { ApiResponse, PageResponse } from '@/types/global.ts'
import type {
  OrderCancelRequest,
  OrderConfirmRequest,
  OrderGetByIdResponse,
  OrderPageRequest,
  OrderPageResponse,
  OrderRejectionRequest,
  OrderStatisticsResponse
} from '@/types/order.ts'

const baseUrl = '/order'

const API = {
  getDetailById: '/details',
  conditionSearch: '/conditionSearch',
  confirm: '/confirm',
  cancel: '/cancel',
  rejection: '/rejection',
  statistics: '/statistics',
  delivery: '/delivery',
  complete: '/complete'
} as const

const orderApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOrderDetailById: builder.query<ApiResponse<OrderGetByIdResponse>, number>({
      query: id => ({
        url: `${baseUrl}${API.getDetailById}/${id}`
      }),
      providesTags: ['Order']
    }),
    getOrderPageList: builder.query<ApiResponse<PageResponse<OrderPageResponse>>, OrderPageRequest>(
      {
        query: params => ({
          url: `${baseUrl}${API.conditionSearch}`,
          params
        }),
        providesTags: ['Order']
      }
    ),
    completeOrder: builder.mutation<ApiResponse, number>({
      query: id => ({
        url: `${baseUrl}${API.complete}/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']
    }),
    deliveryOrder: builder.mutation<ApiResponse, number>({
      query: id => ({
        url: `${baseUrl}${API.delivery}/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']
    }),
    confirmOrder: builder.mutation<ApiResponse, OrderConfirmRequest>({
      query: body => ({
        url: `${baseUrl}${API.confirm}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Order']
    }),
    rejectOrder: builder.mutation<ApiResponse, OrderRejectionRequest>({
      query: body => ({
        url: `${baseUrl}${API.rejection}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Order']
    }),
    cancelOrder: builder.mutation<ApiResponse, OrderCancelRequest>({
      query: body => ({
        url: `${baseUrl}${API.cancel}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Order']
    }),
    getOrderStatistics: builder.query<ApiResponse<OrderStatisticsResponse>, void>({
      query: () => ({
        url: `${baseUrl}${API.statistics}`
      }),
      providesTags: ['Order']
    })
  })
})

export const {
  useGetOrderDetailByIdQuery,
  useGetOrderPageListQuery,
  useConfirmOrderMutation,
  useRejectOrderMutation,
  useCancelOrderMutation,
  useGetOrderStatisticsQuery,
  useCompleteOrderMutation,
  useDeliveryOrderMutation,
  util: { invalidateTags }
} = orderApi
