import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    authLoading: false,
    authError: null,
}



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("token");
        },
        setToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = !!action.payload;
            state.refreshToken = action.payload;
            localStorage.setItem("token", action.payload);
        }

    }
})


export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;