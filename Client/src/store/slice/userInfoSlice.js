import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: {
        id: "",
        uid: "",
        displayName: "",
        bio: "",
        phoneNo: "",
        userName: ""
    },
    userProfilePicture: "",
    selectedUserIdForChat: "",
    userContactList: [],
    contactListCurrentStatus: [],
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
        setProfilePhotoFileName: (state, action) => {
            console.log("Setting profile photo filename in store:", action.payload);
            state.userProfilePicture = action.payload;
        },
        setCurrentUserIdForChat: (state, action) => {
            state.selectedUserIdForChat = action.payload.userId;
        },
        removeSelectedUserIdForChat: (state) => {
            state.selectedUserIdForChat = "";
        }
    }
});


export const { setUserInfo, setCurrentUserIdForChat, removeSelectedUserIdForChat, setProfilePhotoFileName } = userInfoSlice.actions;

export default userInfoSlice.reducer;