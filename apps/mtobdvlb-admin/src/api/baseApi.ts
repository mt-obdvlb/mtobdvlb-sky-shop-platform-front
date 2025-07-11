// src/store/api/baseApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithErrorHandling } from '@/api/baseQueryWithErrorHandling.ts'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}), // 初始空，后续模块扩展
  tagTypes: ['ShopStatus', 'Employee', 'Dish', 'Category']
})
