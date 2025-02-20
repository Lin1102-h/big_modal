import { createSlice } from '@reduxjs/toolkit'

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    userId: '',
    token: ''
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId
      state.token = action.payload.token
    }
  }
})
export const { setUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
