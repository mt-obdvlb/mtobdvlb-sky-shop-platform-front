export interface User {
  token: string
  id: string
  username: string
  name: string
}

export interface UserLoginRequest {
  username: string
  password: string
}

export interface UserLoginResponse {
  token: string
  id: string
  userName: string
  name: string
}

export interface UserEditPasswordRequest {
  oldPassword: string
  newPassword: string
  empId: string
}
