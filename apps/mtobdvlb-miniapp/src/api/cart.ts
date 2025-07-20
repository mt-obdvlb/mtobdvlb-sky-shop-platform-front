import type { ShoppingCartListResponse, ShoppingCartRequest } from "@/types/cart"
import request from "@/utils/request"

const baseURL = '/shoppingCart'

const API = {
  add: '/add',
  list: '/list',
  clean: '/clean',
  sub: '/sub'
} as const 

export const addCart = (data: ShoppingCartRequest) => 
  request.post(`${baseURL}${API.add}`, data)

export const getCartList = () =>
  request.get<ShoppingCartListResponse>(`${baseURL}${API.list}`)

export const cleanCart = () =>
  request.delete(`${baseURL}${API.clean}`)

export const subCart = (data: ShoppingCartRequest) =>
  request.post(`${baseURL}${API.sub}`, data)