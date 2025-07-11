import { createSlice } from '@reduxjs/toolkit'
import type { Shop } from '@/types/shop.ts'

type ShopState = Shop

const initialState: ShopState = {
  isCollapsed: false
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    toggleMenu: state => {
      state.isCollapsed = !state.isCollapsed
    }
  }
})

export default shopSlice.reducer
export const { toggleMenu } = shopSlice.actions
