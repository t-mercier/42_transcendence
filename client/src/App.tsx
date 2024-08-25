import { Box, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Col from './components/Col';
import Row from './components/Row';
import './css/index.css';
import { API, getLogin } from './util';
import InviteReceiver from './components/InviteReceiver';
import { deleteCookie } from './util';
import Status from './components/Status';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const handle42Login = () => {
    window.location.href = API + '/auth/42';
  };

  const anonlogin = () => {
    location.href = API + `/auth/anon`;
  };

  const logout = () => {
    deleteCookie('accessToken');
    location.pathname = '/';
  };

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      document.cookie = 'accessToken=' + token;
      location.search = '';
    }
  }, [navigate, query]);

  return (
    <Container className="root">
      <InviteReceiver />
      <Col className="app">
        <header className="full-width-header">
          <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Link to="/">home/ </Link>
            {getLogin() ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="#" onClick={logout} className="terminal-link">
                  log out/
                </Link>
              </div>
            ) : (
              <>
                <Link to="#" onClick={handle42Login} className="terminal-link">
                  log in/
                </Link>
                {/* <Link to="#" onClick={anonlogin} className="terminal-link">
                    anon Log In
                  </Link> */}
              </>
            )}
          </Box>
          <Status />
        </header>
        <Col flexGrow={1} className="page">
          <Outlet />
        </Col>
      </Col>
    </Container>
  );
};

export default App;
