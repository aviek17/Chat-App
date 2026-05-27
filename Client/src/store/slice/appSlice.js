import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        initDone: false,
    },
    reducers: {
        setInitDone: (state) => { state.initDone = true; },
    }
});

export const { setInitDone } = appSlice.actions;
export default appSlice.reducer;