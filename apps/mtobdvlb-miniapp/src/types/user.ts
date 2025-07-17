export type UserInfo = {
  token: string
  id: number
  openid: string
}

export type UserLoginRequest = {
  code: string
}

export type UserLoginResponse = {
  id: number
  openid: string
  token: string
}
