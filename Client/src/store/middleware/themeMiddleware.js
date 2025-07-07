import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setTheme, toggleTheme, setSystemPreference } from '../slices/themeSlice';

export const themeMiddleware = createListenerMiddleware();

// Listen for system theme changes
themeMiddleware.startListening({
  actionCreator: setSystemPreference,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const savedTheme = localStorage.getItem('chatAppTheme');
    
    // If no saved preference, use system preference
    if (!savedTheme) {
      const systemPreference = action.payload;
      listenerApi.dispatch(setTheme({ mode: systemPreference ? 'dark' : 'light' }));
    }
  },
});

// Apply theme to document
themeMiddleware.startListening({
  predicate: (action) => {
    return setTheme.match(action) || toggleTheme.match(action);
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const isDarkMode = state.theme.isDarkMode;
    
    // Apply theme class to document
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});