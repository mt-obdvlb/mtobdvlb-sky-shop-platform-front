import { baseApi } from '@/api/baseApi.ts'
import type { ShopStatus } from '@/types/shop.ts'
import type { ApiResponse } from '@/types/global.ts'

const baseUrl = '/shop'

const API = {
  getStatus: '/status',
  setStatus: '/'
} as const

const shopApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getShopStatus: builder.query<ApiResponse<ShopStatus>, void>({
      query: () => ({
        url: baseUrl + API.getStatus
      }),
      providesTags: ['ShopStatus']
    }),
    setShopStatus: builder.mutation<ApiResponse, ShopStatus>({
      query: (shopStatus: ShopStatus) => ({
        url: baseUrl + API.setStatus + shopStatus,
        method: 'PUT'
      }),
      invalidatesTags: ['ShopStatus']
    })
  })
})

export const { useGetShopStatusQuery, useSetShopStatusMutation } = shopApi
