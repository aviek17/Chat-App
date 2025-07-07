import { createTheme } from '@mui/material/styles';

// Custom color palette
const colors = {
  primary: {
    main: '#005498',
    light: '#3374B8',
    dark: '#003A6B',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#ffffff',
    light: '#ffffff',
    dark: '#f5f5f5',
    contrastText: '#005498'
  },
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      paper: '#ffffff',
      elevated: '#f5f5f5'
    },
    dark: {
      primary: '#121212',
      secondary: '#1e1e1e',
      paper: '#2d2d2d',
      elevated: '#383838'
    }
  },
  text: {
    light: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999'
    },
    dark: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#666666'
    }
  },
  chat: {
    light: {
      userBubble: '#005498',
      userBubbleText: '#ffffff',
      otherBubble: '#f0f0f0',
      otherBubbleText: '#333333',
      inputBackground: '#ffffff',
      inputBorder: '#e0e0e0'
    },
    dark: {
      userBubble: '#005498',
      userBubbleText: '#ffffff',
      otherBubble: '#383838',
      otherBubbleText: '#ffffff',
      inputBackground: '#2d2d2d',
      inputBorder: '#505050'
    }
  }
};

// Breakpoints for responsive design (mobile-first)
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  }
};

// Typography settings
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    '@media (max-width:640px)': {
      fontSize: '2rem'
    }
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    '@media (max-width:640px)': {
      fontSize: '1.75rem'
    }
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    '@media (max-width:640px)': {
      fontSize: '1.25rem'
    }
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4
  }
};

// Component overrides
const getComponentOverrides = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === 'light' ? colors.background.light.primary : colors.background.dark.primary,
        color: mode === 'light' ? colors.text.light.primary : colors.text.dark.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrastText,
        boxShadow: mode === 'light' ? '0 2px 4px rgba(0,84,152,0.1)' : '0 2px 4px rgba(0,0,0,0.2)'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'light' ? colors.background.light.paper : colors.background.dark.paper,
        color: mode === 'light' ? colors.text.light.primary : colors.text.dark.primary
      },
      elevation1: {
        boxShadow: mode === 'light' ? '0 2px 4px rgba(0,84,152,0.1)' : '0 2px 4px rgba(0,0,0,0.3)'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        transition: 'all 0.2s ease'
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,84,152,0.2)'
        }
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: mode === 'light' ? colors.chat.light.inputBackground : colors.chat.dark.inputBackground,
          '& fieldset': {
            borderColor: mode === 'light' ? colors.chat.light.inputBorder : colors.chat.dark.inputBorder
          },
          '&:hover fieldset': {
            borderColor: colors.primary.main
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary.main
          }
        },
        '& .MuiInputLabel-root': {
          color: mode === 'light' ? colors.text.light.secondary : colors.text.dark.secondary
        }
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(0,84,152,0.1)' : 'rgba(255,255,255,0.1)'
        }
      }
    }
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 4,
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(0,84,152,0.05)' : 'rgba(255,255,255,0.05)'
        }
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrastText
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: mode === 'light' ? '0 4px 6px rgba(0,84,152,0.1)' : '0 4px 6px rgba(0,0,0,0.3)'
      }
    }
  }
});

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.light.primary,
      paper: colors.background.light.paper
    },
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.secondary,
      disabled: colors.text.light.disabled
    }
  },
  breakpoints,
  typography,
  components: getComponentOverrides('light'),
  spacing: 8,
  shape: {
    borderRadius: 8
  }
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.dark.primary,
      paper: colors.background.dark.paper
    },
    text: {
      primary: colors.text.dark.primary,
      secondary: colors.text.dark.secondary,
      disabled: colors.text.dark.disabled
    }
  },
  breakpoints,
  typography,
  components: getComponentOverrides('dark'),
  spacing: 8,
  shape: {
    borderRadius: 8
  }
});

// Custom chat styles for both themes
export const chatStyles = {
  light: {
    chatContainer: {
      backgroundColor: colors.background.light.primary,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    messageContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      backgroundColor: colors.background.light.secondary
    },
    userMessage: {
      backgroundColor: colors.chat.light.userBubble,
      color: colors.chat.light.userBubbleText,
      marginLeft: 'auto',
      marginRight: 0,
      borderRadius: '18px 18px 4px 18px'
    },
    otherMessage: {
      backgroundColor: colors.chat.light.otherBubble,
      color: colors.chat.light.otherBubbleText,
      marginLeft: 0,
      marginRight: 'auto',
      borderRadius: '18px 18px 18px 4px'
    },
    inputContainer: {
      backgroundColor: colors.background.light.paper,
      borderTop: `1px solid ${colors.chat.light.inputBorder}`,
      padding: '1rem'
    }
  },
  dark: {
    chatContainer: {
      backgroundColor: colors.background.dark.primary,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    messageContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      backgroundColor: colors.background.dark.secondary
    },
    userMessage: {
      backgroundColor: colors.chat.dark.userBubble,
      color: colors.chat.dark.userBubbleText,
      marginLeft: 'auto',
      marginRight: 0,
      borderRadius: '18px 18px 4px 18px'
    },
    otherMessage: {
      backgroundColor: colors.chat.dark.otherBubble,
      color: colors.chat.dark.otherBubbleText,
      marginLeft: 0,
      marginRight: 'auto',
      borderRadius: '18px 18px 18px 4px'
    },
    inputContainer: {
      backgroundColor: colors.background.dark.paper,
      borderTop: `1px solid ${colors.chat.dark.inputBorder}`,
      padding: '1rem'
    }
  }
};

// Utility functions for theme switching
export const getTheme = (mode) => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export const getChatStyles = (mode) => {
  return chatStyles[mode];
};

// Export colors for use in other components
export { colors };

// Custom breakpoint utility for responsive design
export const useBreakpoint = () => {
  const theme = lightTheme; // Can use either theme for breakpoints
  return theme.breakpoints;
};

// Tailwind CSS custom classes that match your theme
export const tailwindClasses = {
  light: {
    primary: 'bg-[#005498] text-white',
    secondary: 'bg-white text-[#005498]',
    background: 'bg-white',
    text: 'text-gray-800',
    border: 'border-gray-200',
    hover: 'hover:bg-[#005498] hover:text-white'
  },
  dark: {
    primary: 'bg-[#005498] text-white',
    secondary: 'bg-gray-700 text-white',
    background: 'bg-gray-900',
    text: 'text-white',
    border: 'border-gray-600',
    hover: 'hover:bg-[#005498] hover:text-white'
  }
};