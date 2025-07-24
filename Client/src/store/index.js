import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import menuDrawerReducer from './slice/menuDrawerSlice';
import authSlice from "./slice/authSlice"
export const store = configureStore({
  reducer: {
    auth : authSlice,
    theme: themeReducer,
    navigation : menuDrawerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
});
