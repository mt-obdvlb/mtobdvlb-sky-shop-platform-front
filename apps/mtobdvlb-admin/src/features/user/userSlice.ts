import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/user.ts'

export type UserState = User

const initialState: UserState = {
  token: '',
  id: '',
  username: '',
  name: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      Object.assign(state, action.payload)
    },
    logout(state) {
      state.token = ''
      state.id = ''
      state.username = ''
      state.name = ''
    }
  }
})

export default userSlice.reducer
export const { setUser, logout } = userSlice.actions
