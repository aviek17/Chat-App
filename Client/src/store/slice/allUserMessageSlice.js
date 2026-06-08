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
                let data = { ...state[userId] };
                data.messages = [...data.messages, message];
                state[userId] = data;
            } else {
                let obj = {};
                obj["unreadCount"] = 1;
                obj["messages"] = [message];
                state[userId] = obj;

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
            // userId -> messages logged in user received from
            const { userId, newStatus, userType } = action.payload;
            console.log(state[userId])
            if (state[userId]) {
                let data = { ...state[userId] };
                let messages = [...data.messages];

                console.log(userId)
                console.log(JSON.parse(JSON.stringify(messages)));

                state[userId] = data;
            }
        },
        updateUserMessageStatusRead: (state, action) => {
            const { userId, userType } = action.payload;
            if (!state[userId]) return;
            const messages = state[userId].messages;
            for (let i = messages.length - 1; i >= 0; i--) {
                const message = messages[i];
                if (message[userType] === userId) {
                    if (message["status"] === "read") {
                        break;
                    } else {
                        message["status"] = "read";
                    }
                }
            }

        },
        updateUserMessageStatusDelivered: (state, action) => {
            const { userId, userType } = action.payload;
            if (!state[userId]) return;
            const messages = state[userId].messages;
            for (let i = messages.length - 1; i >= 0; i--) {
                const message = messages[i];
                if (message[userType] === userId) {
                    if (message["status"] === "delivered") {
                        break;
                    } else {
                        message["status"] = "delivered";
                    }
                }
            }
        },
        updateUserUnreadMsgCount: (state, action) => {
            const { userId, count } = action.payload;
            if (state[userId]) {
                let data = { ...state[userId] };
                data.unreadCount += count;
                state[userId] = data;
            }
        },
        resetUserUnreadMsgCount: (state, action) => {
            const { userId, count } = action.payload;
            if (state[userId]) {
                let data = { ...state[userId] };
                data.unreadCount = count;
                state[userId] = data;
            }
        },
        removeAllMsgList: () => {
            return {};
        },
    },
});


export const { addAllLastUsersMessages, getUserMsgFromList, addUserToMsgList, removeMsgListForUser,
    removeAllMsgList, updateuserStatusInMeesageList, updateUserUnreadMsgCount, updateLastestMessageForUser,
    resetUserUnreadMsgCount, updateUserMessageStatusRead, updateUserMessageStatusDelivered } = allUserMsgSlice.actions;

export default allUserMsgSlice.reducer;



