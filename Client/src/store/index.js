import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import menuDrawerReducer from './slice/menuDrawerSlice';
import authSlice from "./slice/authSlice";
import userInfoSlice from "./slice/userInfoSlice";
export const store = configureStore({
  reducer: {
    auth : authSlice,
    theme: themeReducer,
    navigation : menuDrawerReducer,
    user : userInfoSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});
