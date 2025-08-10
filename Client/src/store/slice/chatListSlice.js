import { createSlice } from '@reduxjs/toolkit';


// let obj = {
//    userImage : "",
//    userDisplayName : "",
//    lastMessage : "",
//    lastMessageTime : "",
//    unreadMessagesCount : 0,
// }


const initialState = {
   allChatList: [],
   unreadChatList: [],
   groupChatList: []
};



const loggedUserMessageSlice = createSlice({
   name: 'message',
   initialState: {
      ...initialState
   },
   reducers: {
      setAllChatList: (state, action) => {
         state.allChatList = action.payload;
      },
      setUnreadChatList: (state, action) => {
         state.unreadChatList = action.payload;
      },
      setGroupChatList: (state, action) => {
         state.groupChatList = action.payload;
      },
      resetUnreadMsgCountForChat : (state, action) => {
         const chatId = action.payload;
         const chat = state.allChatList.find(chat => chat.id === chatId);
         if (chat) {
            chat.unreadMessagesCount = 0;
         }
      },
      addNewUnreadCountForChat: (state, action) => {
         const { chatId, count } = action.payload;
         const chat = state.allChatList.find(chat => chat.id === chatId);
         if (chat) {
            chat.unreadMessagesCount += count;
         }
      }
   },
});


export const { setAllChatList, setUnreadChatList, setGroupChatList, resetUnreadMsgCountForChat, addNewUnreadCountForChat} = loggedUserMessageSlice.actions;

export default loggedUserMessageSlice.reducer;




