import type { Middleware } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import type { SocketResponse } from '@/types/socket.ts'
import { invalidateTags as orderInvalidateTags } from '@/features/order/orderApi.ts'
import { setSocket } from '@/features/socket/socketSlice.ts'

let socket: WebSocket | null = null
let isConnecting = false

export const socketMiddleware: Middleware = store => next => action => {
  if (
    (
      action as {
        type: string
      }
    ).type === 'socket/connect'
  ) {
    const sid = uuidv4()
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      if (isConnecting) return next(action)
      isConnecting = true
      socket = new WebSocket(`ws://localhost/ws/${sid}`)
      socket.onopen = () => {
        toast.success('连接服务器成功')
      }

      socket.onmessage = event => {
        const data = JSON.parse(event.data) as SocketResponse
        store.dispatch(orderInvalidateTags(['Order']))
        store.dispatch(setSocket(data))
      }

      socket.onerror = () => {
        toast.error('连接服务器失败')
      }
    }
  }
  return next(action)
}
