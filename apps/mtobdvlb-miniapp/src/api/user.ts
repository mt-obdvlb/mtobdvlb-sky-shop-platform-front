import type { UserLoginRequest, UserLoginResponse } from '@/types/user'
import request from '@/utils/request'

const baseURL = '/user'

const API = {
  login: '/login'
} as const

export const loginUser = (data: UserLoginRequest) =>
  request.post<UserLoginResponse>(`${baseURL}${API.login}`, data)
