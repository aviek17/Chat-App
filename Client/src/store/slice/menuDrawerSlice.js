import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    menuDrawerState: false,
    selectedNavigation: {
        chat: false,
        archiveChat: false,
        story: false,
        starredMsg: false,
        profile: false,
        setting: false
    }
};

const menuDrawerSlice = createSlice({
    name: 'menuDrawerSlice',
    initialState,
    reducers: {
        toggleMenuState: (state) => {
            state.menuDrawerState = !state.menuDrawerState;
        },
        changeNavigationState: (state, action) => {
            Object.keys(state.selectedNavigation).forEach(key => {
                state.selectedNavigation[key] = false;
            });
            state.selectedNavigation[action.payload] = true;
        }
    }
});


export const { toggleMenuState, changeNavigationState } = menuDrawerSlice.actions;

export default menuDrawerSlice.reducer; 	