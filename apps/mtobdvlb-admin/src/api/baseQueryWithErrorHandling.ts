import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toast } from 'react-toastify'
import type { ApiResponse } from '@/types/global.ts'
import type { RootState } from '@/store/types.ts'
import { logout } from '@/features/user/userSlice.ts'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/admin', // 所有请求都会以 /api 开头，可按需改
  credentials: 'include', // 如果你有 cookie 登录之类
  prepareHeaders: (headers, { getState }) => {
    // 获取 token
    const token = (getState() as RootState).user?.token
    if (token) {
      headers.set('token', `${token}`)
    }
    return headers
  }
})

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error?.status === 401) {
    toast.error('登录已过期，请重新登录')
    api.dispatch(logout())
    const currentPath = window.location.pathname
    window.location.href = currentPath === '/' ? '/login' : `/login?redirect=${currentPath}`
    return result
  }

  if (result.error) {
    toast.error(`网络请求错误：${result.error.status}`)
    return result
  }

  const res = result.data as ApiResponse

  if (res.code === 0) {
    toast.error(res.msg)
    return {
      error: {
        status: 200,
        data: res
      }
    }
  }

  return {
    data: res
  }
}
