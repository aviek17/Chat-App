import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import menuDrawerReducer from './slice/menuDrawerSlice';
export const store = configureStore({
  reducer: {
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
