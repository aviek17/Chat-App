import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: {
        id: "",
        displayName: "",
        bio: "",
        phoneNo: "",
        email : "",
        isOnline: false,
        username: "",
        nickName : {
            firstName : "",
            lastName : ""
        }
    },
    userProfilePicture: "",
    messages : []
};



const selectedUserSlice = createSlice({
    name : "selectedUserData",
    initialState,
    reducers : {
        setSelectedUserInfo: (state, action) => {
            state.userInfo = {
                ...state.userInfo,
                ...action.payload
            }
        },
        setUserProfilePicture: (state, action) => {
            state.userProfilePicture = action.payload;
        },
        setUserMessages: (state, action) => {
            state.messages = action.payload;
        },
        setUserNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        removeUerInfo: (state) => {
            state.userInfo = initialState.userInfo;
            state.userProfilePicture = initialState.userProfilePicture; 
            state.messages = initialState.messages;
        }
    }
})

export const { setSelectedUserInfo, setUserProfilePicture, setUserMessages, setUserNewMessage, removeUerInfo } = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
