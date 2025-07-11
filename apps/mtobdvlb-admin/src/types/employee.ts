export type EmployeeStatus = 0 | 1
export type EmployeeSex = '0' | '1'

export type EmployeeUpdateRequest = {
  id: number
  idNumber: string //身份证
  name: string
  username: string
  sex: EmployeeSex
  phone: string
}

export type Employee = {
  createTime?: string
  createUser?: number
  id?: number
  idNumber?: string
  name?: string
  password?: string
  phone?: string
  sex?: EmployeeSex
  status?: EmployeeStatus
  updateTime?: string
  updateUser?: number
  username?: string
}

export type EmployeePageRequest = {
  page: number
  pageSize: number
  name?: string
}

export type EmployeePageResponse = Employee

export type EmployeeAddRequest = Omit<EmployeeUpdateRequest, 'id'> & { id?: number }

export type EmployeeUpdateStatusRequest = {
  id: number
  status: EmployeeStatus
}
