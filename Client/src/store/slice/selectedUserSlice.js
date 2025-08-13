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
        }
    }
})

export const { setSelectedUserInfo, setUserProfilePicture, setUserMessages, setUserNewMessage } = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
