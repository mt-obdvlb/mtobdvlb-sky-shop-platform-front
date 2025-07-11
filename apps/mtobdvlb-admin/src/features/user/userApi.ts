import { baseApi } from '@/api/baseApi.ts'
import type { UserEditPasswordRequest, UserLoginRequest, UserLoginResponse } from '@/types/user.ts'
import type { ApiResponse } from '@/types/global.ts'
import { setUser } from '@/features/user/userSlice.ts'

const baseUrl = '/employee'

const UserApi = {
  login: '/login',
  logout: '/logout',
  editPassword: '/editPassword'
} as const

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation<ApiResponse<UserLoginResponse>, UserLoginRequest>({
      query: body => ({
        url: baseUrl + UserApi.login,
        method: 'POST',
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const {
          data: { data }
        } = await queryFulfilled
        // console.log(data)
        dispatch(
          setUser({
            token: data.token,
            id: data.id,
            username: data.userName,
            name: data.name
          })
        )
      }
    }),
    logoutUser: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: baseUrl + UserApi.logout,
        method: 'POST'
      })
    }),
    editUserPassword: builder.mutation<ApiResponse, UserEditPasswordRequest>({
      query: body => ({
        url: baseUrl + UserApi.editPassword,
        method: 'PUT',
        body
      })
    })
  })
})

export const { useLoginUserMutation, useLogoutUserMutation, useEditUserPasswordMutation } = userApi
