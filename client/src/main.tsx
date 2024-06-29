import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './css/index.css';
import Error404 from './pages/Error404.tsx';
import LoginResult from './pages/LoginResult.tsx';
import Profile from './pages/Profile.tsx';
import Room from './pages/Room.tsx';
import theme from './theme.ts';
import Home from './pages/Home.tsx';
import MatchHistoryPage from './pages/MatchHistoryPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'r/:id',
        element: <Room />,
      },
      {
        element: <LoginResult />,
        path: 'login',
      },
      {
        element: <Profile />,
        path: 'u/:login',
      },
      {
        path: 'matchhistory',
        element: <MatchHistoryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
