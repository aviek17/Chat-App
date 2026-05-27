import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import menuDrawerReducer from './slice/menuDrawerSlice';
import authSlice, { logout } from "./slice/authSlice";
import userInfoSlice from "./slice/userInfoSlice";
import loggedUserMessageSlice from "./slice/chatListSlice";
import selectedUserSlice from './slice/selectedUserSlice';
import allUserMsgSlice from './slice/allUserMessageSlice';
import friendSlice from './slice/friendSlice';
import appSlice from './slice/appSlice';
import contactSlice from './slice/contactSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';


const appReducer = combineReducers({
  app: appSlice,
  auth: authSlice,
  theme: themeReducer,
  navigation: menuDrawerReducer,
  user: userInfoSlice,
  messageList: loggedUserMessageSlice,
  selectedUser: selectedUserSlice,
  allUsersMsgs: allUserMsgSlice,
  friendList: friendSlice,
  contactList: contactSlice
});


const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    // console.log(state);
    // localStorage.clear();
    // storage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});



export const persistor = persistStore(store);
