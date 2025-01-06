import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    username: string
}

const initialState: UserState = {
    username: localStorage.getItem("username") || ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.username = action.payload
            localStorage.setItem("username", action.payload);
        },
        logoutUser: state => {
            state.username = ''
            localStorage.removeItem("username");
            localStorage.removeItem("isAdminUsuario");
            localStorage.removeItem("isCliente");
            localStorage.removeItem("isAdminRecarga");
            localStorage.removeItem("isAdminPartido");
        }
    }
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer