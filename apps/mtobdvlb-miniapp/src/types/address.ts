export type AddressBook = {
  id?: number
  userId: number
  consignee: string
  phone: string
  sex: '0' | '1' // "0" | "1" 也可以更精确
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
  detail: string
  label: string
  isDefault: 0 | 1 // 0 | 1 也可以更精确
}
