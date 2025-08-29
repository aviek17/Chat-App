import { createSlice } from '@reduxjs/toolkit';


// structure 
// {
//     userId : [],
//     userId2 : []
// }


const initialState = {

}

const allUserMsgSlice = createSlice({
    name: 'allUserMsgList',
    initialState: {
        ...initialState
    },
    reducers: {
        getUserMsgFromList: (state, action) => {
            const userId = action.payload;
            return state[userId] || [];
        },
        addUserToMsgList: (state, action) => {
            const { userId, msgList } = action.payload;
            state[userId] = msgList;
        },
        removeMsgListForUser: (state, action) => {
            const userId = action.payload;
            if (state[userId]) {
                state[userId] = [];
            }
        },
        removeAllMsgList: () => {
            return {};
        },
    },
});


export const { getUserMsgFromList, addUserToMsgList, removeMsgListForUser, removeAllMsgList } = allUserMsgSlice.actions;

export default allUserMsgSlice.reducer;



