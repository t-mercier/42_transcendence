import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
export const theme = createTheme({
  typography: {
    fontFamily: 'Fira Code, monospace',
    fontSize: 16, // Base font size
    body1: {
      color: '#00ff00', // Text color
    },
    body2: {
      color: '#00ff00', // Text color
    },
  },
  palette: {
    primary: {
      main: '#007700', // Dark green for primary actions
    },
    secondary: {
      main: '#00ff00', // Bright green for secondary actions
    },
    background: {
      default: '#1e1e1e', // Dark background
    },
    text: {
      primary: '#00ff00', // Bright green text
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#007700', // Dark green links
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          backgroundColor: '#1e1e1e',
          border: '1px solid #007700',
          '&:hover': {
            backgroundColor: '#007700',
            color: '#1e1e1e',
          },
        },
      },
    },
  },
});
