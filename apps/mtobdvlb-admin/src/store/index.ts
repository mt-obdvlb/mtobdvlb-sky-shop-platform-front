// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/api/baseApi'
import userReducer from '@/features/user/userSlice.ts'
import shopReducer from '@/features/shop/shopSlice.ts'
import socketReducer from '@/features/socket/socketSlice.ts'
import { userPersistConfig } from '@/store/persistConfig.ts'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist'

import { logoutMiddleware } from '@/middleware/logoutMiddleware.ts'
import { socketMiddleware } from '@/middleware/socketMiddleware.ts'

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: persistedUserReducer,
    shop: shopReducer,
    socket: socketReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // 处理 persist 特殊 action 的报错
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(baseApi.middleware, logoutMiddleware, socketMiddleware)
})

export const persistor = persistStore(store)
