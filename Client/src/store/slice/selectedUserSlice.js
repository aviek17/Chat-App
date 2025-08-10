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
            state.userInfo = action.payload;
        }
    }
})


