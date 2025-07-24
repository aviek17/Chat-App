import { createSlice } from '@reduxjs/toolkit';


// let obj = {
//    userImage : "",
//    userDisplayName : "",
//    lastMessage : "",
//    lastMessageTime : "",
//    unreadMessagesCount : 0,
// }


let data = [
   { id: 1, userDisplayName: 'John Doe', lastMessage: 'Hey, how are you doing?', lastMessageTime: '12:30 PM', unreadMessagesCount: 2, userImage: 'JD' },
   { id: 2, userDisplayName: 'Sarah Wilson', lastMessage: 'See you tomorrow!', lastMessageTime: '11:45 AM', unreadMessagesCount: 0, userImage: 'SW' },
   { id: 3, userDisplayName: 'Team Project', lastMessage: 'Alice: Great work everyone!', lastMessageTime: '10:20 AM', unreadMessagesCount: 5, userImage: 'TP' },
   { id: 4, userDisplayName: 'Mom', lastMessage: 'Don\'t forget to call grandma', lastMessageTime: '9:15 AM', unreadMessagesCount: 1, userImage: 'M' },
   { id: 5, userDisplayName: 'David Chen', lastMessage: 'Thanks for the help!', lastMessageTime: 'Yesterday', unreadMessagesCount: 0, userImage: 'DC' },
   { id: 6, userDisplayName: 'Work Group', lastMessage: 'Meeting at 3 PM', lastMessageTime: 'Yesterday', unreadMessagesCount: 0, userImage: 'WG' },
   { id: 7, userDisplayName: 'Lisa Rodriguez', lastMessage: 'Happy birthday! 🎉', lastMessageTime: 'Monday', unreadMessagesCount: 0, userImage: 'LR' },
   { id: 8, userDisplayName: 'Mike Johnson', lastMessage: 'Let\'s catch up soon', lastMessageTime: 'Sunday', unreadMessagesCount: 0, userImage: 'MJ' },
   { id: 9, userDisplayName: 'David Chen', lastMessage: 'Thanks for the help!', lastMessageTime: 'Yesterday', unreadMessagesCount: 0, userImage: 'DC' },
   { id: 10, userDisplayName: 'Work Group', lastMessage: 'Meeting at 3 PM', lastMessageTime: 'Yesterday', unreadMessagesCount: 0, userImage: 'WG' },
   { id: 11, userDisplayName: 'Lisa Rodriguez', lastMessage: 'Happy birthday! 🎉', lastMessageTime: 'Monday', unreadMessagesCount: 0, userImage: 'LR' },
   { id: 12, userDisplayName: 'Mike Johnson', lastMessage: 'Let\'s catch up soon', lastMessageTime: 'Sunday', unreadMessagesCount: 0, userImage: 'MJ' }
]


const initialState = {
   allChatList: data,
   unreadChatList: [],
   groupChatList: []
};



const messageSlice = createSlice({
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







