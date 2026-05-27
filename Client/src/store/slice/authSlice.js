import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    authLoading: false,
    authError: null,
}



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            return initialState;
        },
        setToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        updateToken: (state, action) => {
            state.accessToken = action.payload;
        }


    }
})


export const { logout, setToken, updateToken } = authSlice.actions;

export default authSlice.reducer;