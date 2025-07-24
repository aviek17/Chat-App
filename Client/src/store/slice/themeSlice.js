import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  isDarkMode: false,
  themeMode: 'dark',
  isLoading: false,
  systemPreference: false,
};


const getSystemPreference = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};


const getSavedTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatAppTheme');
    return saved ? saved === 'dark' : getSystemPreference();
  }
  return false;
};


const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    ...initialState,
    isDarkMode: getSavedTheme(),
    themeMode: getSavedTheme() ? 'dark' : 'light',
    systemPreference: getSystemPreference(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.themeMode = state.isDarkMode ? 'dark' : 'light';
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatAppTheme', state.themeMode);
      }
    },
    setTheme: (state, action) => {
      const { mode } = action.payload;
      state.isDarkMode = mode === 'dark';
      state.themeMode = mode;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatAppTheme', mode);
      }
    },
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
    initializeTheme: (state) => {
      state.isLoading = true;
      const savedTheme = getSavedTheme();
      const systemPref = getSystemPreference();
      
      state.isDarkMode = savedTheme;
      state.themeMode = savedTheme ? 'dark' : 'light';
      state.systemPreference = systemPref;
      state.isLoading = false;
    },
    resetTheme: (state) => {
      state.isDarkMode = state.systemPreference;
      state.themeMode = state.systemPreference ? 'dark' : 'light';
      
      // Remove from localStorage to use system preference
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatAppTheme');
      }
    },
  },
});

export const { 
  toggleTheme, 
  setTheme, 
  setSystemPreference, 
  initializeTheme,
  resetTheme 
} = themeSlice.actions;

export default themeSlice.reducer;