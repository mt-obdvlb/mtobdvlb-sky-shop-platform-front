import { baseApi } from '@/api/baseApi.ts'
import type { ApiResponse } from '@/types/global.ts'
import type {
  ReportOrderResponse,
  ReportRequest,
  ReportTop10Response,
  ReportTurnoverResponse,
  ReportUserResponse
} from '@/types/report.ts'

const baseUrl = '/report'

const API = {
  turnoverStatistics: '/turnoverStatistics',
  userStatistics: '/userStatistics',
  ordersStatistics: '/ordersStatistics',
  top10: '/top10',
  export: '/export'
} as const

const reportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getReportTurnoverStatistics: builder.query<ApiResponse<ReportTurnoverResponse>, ReportRequest>({
      query: params => ({
        url: `${baseUrl}${API.turnoverStatistics}`,
        params
      })
    }),
    getReportUserStatistics: builder.query<ApiResponse<ReportUserResponse>, ReportRequest>({
      query: params => ({
        url: `${baseUrl}${API.userStatistics}`,
        params
      })
    }),
    getReportOrdersStatistics: builder.query<ApiResponse<ReportOrderResponse>, ReportRequest>({
      query: params => ({
        url: `${baseUrl}${API.ordersStatistics}`,
        params
      })
    }),
    getReportTop10: builder.query<ApiResponse<ReportTop10Response>, ReportRequest>({
      query: params => ({
        url: `${baseUrl}${API.top10}`,
        params
      })
    }),
    exportReport: builder.mutation<Blob, void>({
      async queryFn(_args, _queryApi, _extraOptions, baseQuery) {
        const response = await baseQuery({
          url: `${baseUrl}${API.export}`,
          method: 'GET',
          responseHandler: res => Promise.resolve(res.blob())
        })

        if (!response) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'No response or response error'
            }
          }
        }

        return { data: response.data as Blob }
      }
    })
  })
})

export const {
  useGetReportTurnoverStatisticsQuery,
  useGetReportUserStatisticsQuery,
  useGetReportOrdersStatisticsQuery,
  useGetReportTop10Query,
  useExportReportMutation
} = reportApi
