import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    authLoading: false,
    authError: null,
}


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            //   const response = await api.login(credentials);
            //   return response.data; 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


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
            localStorage.setItem("token", action.payload);
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.authLoading = true;
                state.authError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.authLoading = false;
                state.authError = action.payload || "Login failed";
            });
    }
})


export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;