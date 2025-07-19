import type { AddressBook } from "@/types/address"
import request from "@/utils/request"

const baseURL = '/addressBook'

const API = {
  list: '/list',
  add: '',
  id: '',
  update: '',
  updateDefault: '/default',
  delete: '',
  getDefault: '/default'
} as const

export const getAddressList = () =>
  request.get<AddressBook[]>(`${baseURL}${API.list}`)

export const getAddressDefault = () =>
  request.get<AddressBook>(`${baseURL}${API.getDefault}`)

export const addAddress = (data: AddressBook) =>
  request.post<AddressBook>(`${baseURL}${API.add}`, data)

export const updateAddress = (id: number, data: AddressBook) =>
  request.put<AddressBook>(`${baseURL}${id}`, data)

export const updateAddressDefault = (id: number) =>
  request.put<AddressBook>(`${baseURL}${API.updateDefault}/${id}`)

export const deleteAddress = (id: number) =>
  request.delete(`${baseURL}${API.id}/${id}`)

export const getAddressById = (id: number) =>
  request.get<AddressBook>(`${baseURL}${API.id}/${id}`)