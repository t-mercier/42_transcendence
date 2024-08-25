import { createTheme } from '@mui/material/styles';

// Create a custom theme
export const theme = createTheme({
  typography: {
    fontFamily: 'Fira Code',
    fontSize: 14, // Base font size
    body1: {
      fontSize: 16, // Base font size
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
    //   disabled: '#555555', // Grey color for disabled elements
      disabledBackground: '#1e1e1e', // Same background color to blend in
    },
  },
});
