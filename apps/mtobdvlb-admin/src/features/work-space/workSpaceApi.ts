import { baseApi } from '@/api/baseApi.ts'
import type { ApiResponse } from '@/types/global.ts'
import type {
  WorkSpaceBusinessResponse,
  WorkSpaceDishOverViewResponse,
  WorkSpaceOrderOverViewResponse,
  WorkSpaceSetmealOverViewResponse
} from '@/types/workSpace.ts'

const baseUrl = '/workspace'

const API = {
  businessData: '/businessData',
  overviewOrders: '/overviewOrders',
  overviewDishes: '/overviewDishes',
  overviewSetmeals: '/overviewSetmeals'
} as const

const workSpaceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getWorkSpaceBusinessData: builder.query<ApiResponse<WorkSpaceBusinessResponse>, void>({
      query: () => ({
        url: `${baseUrl}${API.businessData}`
      })
    }),
    getWorkSpaceOverviewOrders: builder.query<ApiResponse<WorkSpaceOrderOverViewResponse>, void>({
      query: () => ({
        url: `${baseUrl}${API.overviewOrders}`
      })
    }),
    getWorkSpaceOverviewDishes: builder.query<ApiResponse<WorkSpaceDishOverViewResponse>, void>({
      query: () => ({
        url: `${baseUrl}${API.overviewDishes}`
      })
    }),
    getWorkSpaceOverviewSetmeals: builder.query<
      ApiResponse<WorkSpaceSetmealOverViewResponse>,
      void
    >({
      query: () => ({
        url: `${baseUrl}${API.overviewSetmeals}`
      })
    })
  })
})

export const {
  useGetWorkSpaceBusinessDataQuery,
  useGetWorkSpaceOverviewDishesQuery,
  useGetWorkSpaceOverviewSetmealsQuery,
  useGetWorkSpaceOverviewOrdersQuery
} = workSpaceApi
