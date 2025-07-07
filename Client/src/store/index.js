import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
export const store = configureStore({
  reducer: {
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
});
