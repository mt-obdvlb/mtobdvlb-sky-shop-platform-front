import { baseApi } from '@/api/baseApi.ts'
import type {
  DishAddRequest,
  DishGetByIdResponse,
  DishListResponse,
  DishPageRequest,
  DishPageResponse,
  DishUpdateRequest
} from '@/types/dish.ts'
import type { ApiResponse, PageResponse } from '@/types/global.ts'

const baseUrl = '/dish'

const API = {
  getDishListByCategoryId: '/list',
  getDishById: '',
  addDish: '',
  updateDish: '',
  deleteDishes: '',
  updateDishStatus: '/status',
  getDishPageList: '/page'
} as const

const dishApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDishListByCategoryId: builder.query<ApiResponse<DishListResponse>, number>({
      query: categoryId => ({
        url: `${baseUrl}${API.getDishListByCategoryId}`,
        params: {
          categoryId
        }
      }),
      providesTags: ['Dish']
    }),
    getDishById: builder.query<ApiResponse<DishGetByIdResponse>, number>({
      query: id => ({
        url: `${baseUrl}${API.getDishById}/${id}`
      })
    }),
    addDish: builder.mutation<ApiResponse, DishAddRequest>({
      query: body => ({
        url: `${baseUrl}${API.addDish}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Dish']
    }),
    updateDish: builder.mutation<ApiResponse, DishUpdateRequest>({
      query: body => ({
        url: `${baseUrl}${API.updateDish}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Dish']
    }),
    deleteDishes: builder.mutation<ApiResponse, number[]>({
      query: ids => ({
        url: `${baseUrl}${API.deleteDishes}`,
        method: 'DELETE',
        params: {
          ids
        }
      }),
      invalidatesTags: ['Dish']
    }),
    updateDishStatus: builder.mutation<
      ApiResponse,
      {
        id: number
        status: number
      }
    >({
      query: ({ id, status }) => ({
        url: `${baseUrl}${API.updateDishStatus}/${status}`,
        method: 'POST',
        params: { id }
      }),
      invalidatesTags: ['Dish']
    }),
    getDishPageList: builder.query<ApiResponse<PageResponse<DishPageResponse>>, DishPageRequest>({
      query: params => ({
        url: `${baseUrl}${API.getDishPageList}`,
        params
      }),
      providesTags: ['Dish']
    })
  })
})

export const {
  useGetDishListByCategoryIdQuery,
  useGetDishByIdQuery,
  useAddDishMutation,
  useUpdateDishMutation,
  useDeleteDishesMutation,
  useUpdateDishStatusMutation,
  useGetDishPageListQuery
} = dishApi
