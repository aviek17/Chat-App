import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import menuDrawerReducer from './slice/menuDrawerSlice';
import authSlice from "./slice/authSlice";
import userInfoSlice from "./slice/userInfoSlice";
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';


const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeReducer,
  navigation: menuDrawerReducer,
  user: userInfoSlice
});


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
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});



export const persistor = persistStore(store);
