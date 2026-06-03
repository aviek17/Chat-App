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
        addAllLastUsersMessages: (state, action) => {
            const payload = action.payload;
            Object.keys(payload).forEach((userId) => {
                state[userId] = payload[userId];
            });
        },
        updateLastestMessageForUser: (state, action) => {
            const { userId, message } = action.payload;
            if (state[userId]) {
                let data = {...state[userId]};
                data.messages = [...data.messages, message];
                state[userId] = data;
            }
        },
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
        updateuserStatusInMeesageList: (state, action) => {
            const { userId, newStatus } = action.payload;
            if (state[userId]) {
                let data = {...state[userId]};
                data.messages = data.messages.map(msg => ({
                    ...msg,
                    status: newStatus
                }));
                state[userId] = data;
            }

        },
        updateUserUnreadMsgCount: (state, action) => {
            const { userId, count } = action.payload;
            if (state[userId]) {
                let data = {...state[userId]};
                data.unreadCount += count;
                state[userId] = data;
            }
        },
        resetUserUnreadMsgCount: (state, action) => {
            const { userId, count } = action.payload;
            if (state[userId]) {
                let data = {...state[userId]};
                data.unreadCount = count;
                state[userId] = data;
            }
        },
        removeAllMsgList: () => {
            return {};
        },
    },
});


export const { addAllLastUsersMessages, getUserMsgFromList, addUserToMsgList, removeMsgListForUser, removeAllMsgList, updateuserStatusInMeesageList, updateUserUnreadMsgCount, updateLastestMessageForUser, resetUserUnreadMsgCount } = allUserMsgSlice.actions;

export default allUserMsgSlice.reducer;



