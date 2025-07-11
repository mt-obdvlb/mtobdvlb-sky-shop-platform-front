import { baseApi } from '@/api/baseApi.ts'
import type {
  Employee,
  EmployeeAddRequest,
  EmployeePageRequest,
  EmployeePageResponse,
  EmployeeUpdateRequest,
  EmployeeUpdateStatusRequest
} from '@/types/employee.ts'
import { type ApiResponse, type PageResponse } from '@/types/global.ts'

const baseUrl = '/employee'
const API = {
  getPageEmployee: '/page',
  addEmployee: '',
  updateEmployee: '',
  getEmployeeById: '/',
  updateEmployeeStatus: '/status'
} as const

const employeeApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updateEmployeeStatus: build.mutation<ApiResponse, EmployeeUpdateStatusRequest>({
      query: ({ id, status }) => {
        return {
          url: baseUrl + API.updateEmployeeStatus + '/' + status,
          method: 'POST',
          params: {
            id
          }
        }
      },
      invalidatesTags: ['Employee']
    }),
    getEmployeeById: build.query<ApiResponse<Employee>, number>({
      query: id => {
        return {
          url: baseUrl + API.getEmployeeById + '/' + id,
          method: 'GET'
        }
      }
    }),
    getPageEmployee: build.query<
      ApiResponse<PageResponse<EmployeePageResponse>>,
      EmployeePageRequest
    >({
      query: params => {
        return {
          url: baseUrl + API.getPageEmployee,
          method: 'GET',
          params
        }
      },
      providesTags: ['Employee']
    }),
    addEmployee: build.mutation<ApiResponse, EmployeeAddRequest>({
      query: body => {
        return {
          url: baseUrl + API.addEmployee,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Employee']
    }),
    updateEmployee: build.mutation<ApiResponse, EmployeeUpdateRequest>({
      query: body => {
        return {
          url: baseUrl + API.updateEmployee,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: ['Employee']
    })
  })
})

export const {
  useUpdateEmployeeStatusMutation,
  useAddEmployeeMutation,
  useGetEmployeeByIdQuery,
  useGetPageEmployeeQuery,
  useUpdateEmployeeMutation
} = employeeApi
