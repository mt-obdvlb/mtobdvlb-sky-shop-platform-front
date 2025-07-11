import { baseApi } from '@/api/baseApi.ts'
import type { ApiResponse, PageResponse } from '@/types/global.ts'
import type {
  CategoryAddRequest,
  CategoryGetByIdResponse,
  CategoryListByTypeResponse,
  CategoryPageRequest,
  CategoryPageResponse,
  CategoryStatus,
  CategoryType,
  CategoryUpdateRequest
} from '@/types/category.ts'

const baseUrl = '/category'

const API = {
  add: '',
  getPageList: '/page',
  getById: '',
  update: '',
  delete: '',
  status: '/status',
  listByType: '/list'
} as const

const categoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addCategory: builder.mutation<ApiResponse, CategoryAddRequest>({
      query: body => ({
        url: `${baseUrl}${API.add}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Category']
    }),
    getCategoryPageList: builder.query<
      ApiResponse<PageResponse<CategoryPageResponse>>,
      CategoryPageRequest
    >({
      query: params => ({
        url: `${baseUrl}${API.getPageList}`,
        params
      }),
      providesTags: ['Category']
    }),
    getCategoryById: builder.query<ApiResponse<CategoryGetByIdResponse>, number>({
      query: id => ({
        url: `${baseUrl}${API.getById}/${id}`
      })
    }),
    updateCategory: builder.mutation<ApiResponse, CategoryUpdateRequest>({
      query: body => ({
        url: `${baseUrl}${API.update}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Category']
    }),
    deleteCategory: builder.mutation<ApiResponse, number>({
      query: id => ({
        url: `${baseUrl}${API.delete}`,
        method: 'DELETE',
        params: {
          id
        }
      }),
      invalidatesTags: ['Category']
    }),
    updateCategoryStatus: builder.mutation<
      ApiResponse,
      {
        status: CategoryStatus
        id: number
      }
    >({
      query: ({ id, status }) => ({
        url: `${baseUrl}${API.status}/${status}`,
        method: 'POST',
        params: {
          id
        }
      }),
      invalidatesTags: ['Category']
    }),
    getCategoryListByType: builder.query<ApiResponse<CategoryListByTypeResponse>, CategoryType>({
      query: type => ({
        url: `${baseUrl}${API.listByType}`,
        params: {
          type
        }
      })
    })
  })
})

export const {
  useAddCategoryMutation,
  useGetCategoryPageListQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useGetCategoryListByTypeQuery
} = categoryApi
