import { baseApi } from '@/api/baseApi.ts'
import type {
  SetmealAddRequest,
  SetmealGetByIdResponse,
  SetmealPageRequest,
  SetmealPageResponse,
  SetmealStatus,
  SetmealUpdateRequest
} from '@/types/setmeal.ts'
import type { ApiResponse, PageResponse } from '@/types/global.ts'

const baseUrl = '/setmeal'

const API = {
  add: '',
  page: '/page',
  update: '',
  getById: '',
  deleteBatch: '',
  status: '/status'
} as const

const setmealApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addSetmeal: builder.mutation<ApiResponse, SetmealAddRequest>({
      query: body => ({
        url: baseUrl + API.add,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Setmeal']
    }),
    getSetmealPage: builder.query<
      ApiResponse<PageResponse<SetmealPageResponse>>,
      SetmealPageRequest
    >({
      query: body => ({
        url: baseUrl + API.page,
        method: 'GET',
        params: body
      }),
      providesTags: ['Setmeal']
    }),
    updateSetmeal: builder.mutation<ApiResponse, SetmealUpdateRequest>({
      query: body => ({
        url: baseUrl + API.update,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Setmeal']
    }),
    getSetmealById: builder.query<ApiResponse<SetmealGetByIdResponse>, number>({
      query: id => ({
        url: baseUrl + API.getById + '/' + id
      }),
      providesTags: ['Setmeal']
    }),
    deleteSetmeal: builder.mutation<ApiResponse, number[]>({
      query: ids => ({
        url: baseUrl + API.deleteBatch,
        method: 'DELETE',
        params: {
          ids
        }
      }),
      invalidatesTags: ['Setmeal']
    }),
    updateSetmealStatus: builder.mutation<
      ApiResponse,
      {
        id: number
        status: SetmealStatus
      }
    >({
      query: ({ id, status }) => ({
        url: `${baseUrl}${API.status}/${status}`,
        method: 'POST',
        params: {
          id
        }
      }),
      invalidatesTags: ['Setmeal']
    })
  })
})

export const {
  useAddSetmealMutation,
  useUpdateSetmealMutation,
  useDeleteSetmealMutation,
  useUpdateSetmealStatusMutation,
  useGetSetmealByIdQuery,
  useGetSetmealPageQuery
} = setmealApi
