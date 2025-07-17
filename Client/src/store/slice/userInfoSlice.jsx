import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: {
        id: "",
        uid: "",
        displayName: "",
        bio: "",
        phoneNo: ""
    },
    userProfilePicture: "",
    selectedUserIdForChat : "",
    userContactList : [],
    contactListCurrentStatus : [],
    //blockedUsers : []

};


const userInfoSlice = createSlice({
    name: 'userInfoSlice',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = {
                ...state.userInfo,
                ...action.payload
            };
        },
        setCurrentUserIdForChat: (state, action) => {
            state.selectedUserIdForChat = action.payload.userId;
        },
        removeSelectedUserIdForChat: (state) => {
            state.selectedUserIdForChat = "";
        }
    }
});