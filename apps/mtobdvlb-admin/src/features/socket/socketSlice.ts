import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SocketResponse, SocketType } from '@/types/socket.ts'

type SocketState = {
  type: SocketType | undefined
  orderId: number | undefined
  orderIdFromSocket: number | undefined
}

const initialState: SocketState = {
  type: undefined,
  orderId: undefined,
  orderIdFromSocket: undefined
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<SocketResponse>) => {
      state.type = action.payload.type
      state.orderId = action.payload.orderId
    },

    clearSocket: state => {
      state.orderIdFromSocket = undefined
      state.type = undefined
      state.orderId = undefined
    },

    detailOrder: state => {
      state.orderIdFromSocket = state.orderId
    }
  }
})

export default socketSlice.reducer
export const { setSocket, clearSocket, detailOrder } = socketSlice.actions
