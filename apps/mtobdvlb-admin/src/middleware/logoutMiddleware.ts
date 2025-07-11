// src/store/logoutMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit'
import { logout } from '@/features/user/userSlice'
import { persistor } from '@/store'

export const logoutMiddleware: Middleware = () => next => action => {
  if ((action as { type: string }).type === logout.type) {
    persistor.purge()
  }
  return next(action)
}
