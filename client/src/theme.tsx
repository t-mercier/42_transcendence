import { createTheme } from '@mui/material/styles';

// Create a custom theme
export const theme = createTheme({
  typography: {
    fontFamily: 'Fira Code, monospace',
    fontSize: 14, // Base font size
    body1: {
      color: '#00ff00',
    },
    body2: {
      color: '#00ff00',
    },
  },
  palette: {
    primary: {
      main: '#007700',
    },
    secondary: {
      main: '#00ff00',
    },
    background: {
      default: '#1e1e1e',
    },
    text: {
      primary: '#00ff00',
    },
    action: {
      disabled: '#555555', // Grey color for disabled elements
      disabledBackground: '#1e1e1e', // Same background color to blend in
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:disabled': {
            color: '#555555', // Grey text color
            backgroundColor: '#1e1e1e', // Dark background
            borderColor: '#555555', // Grey border color
            cursor: 'not-allowed',
            opacity: 0.7, // Slightly transparent
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&.disabled': {
            color: '#555555', // Grey text color for disabled links
            pointerEvents: 'none', // Disable clicking
          },
        },
      },
    },
  },
});
