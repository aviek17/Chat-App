import { useDispatch, useSelector } from 'react-redux';
import { resetTheme, setTheme, toggleTheme } from '../slice/themeSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Custom hooks for common operations
export const useTheme = () => {
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  
  return {
    ...theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (mode) => dispatch(setTheme({ mode })),
    resetTheme: () => dispatch(resetTheme()),
  };
};