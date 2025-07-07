import { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme } from '../../styles/theme';
import { initializeTheme, setSystemPreference } from '../slice/themeSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const ThemeProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isDarkMode, themeMode } = useAppSelector((state) => state.theme);
  
  // Initialize theme on mount
  useEffect(() => {
    dispatch(initializeTheme());
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      dispatch(setSystemPreference(e.matches));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);
  
  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const muiTheme = getTheme(themeMode);
  
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};