import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import ButtonLogin from './components/ButtonLogin';
import Col from './components/Col';
import Row from './components/Row';
import Status from './components/Status';
import { API, getLogin } from './util';
import InviteReceiver from './components/InviteReceiver';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const handle42Login = () => {
    window.location.href = API + '/auth/42';
  };

  const anonlogin = () => {
    location.href = API + `/auth/anon`;
  };

  function deleteCookie(name: any) {
    // Set the cookie with a past expiration date
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }

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
    <Container className="root" sx={{ maxWidth: '1600px!important' }}>
      <InviteReceiver />
      <Col className="app">
        <header>
          <Row>
            {getLogin() ? (
              <ButtonLogin onClick={logout} text="Log Out" />
            ) : (
              <>
                <ButtonLogin onClick={handle42Login} text="Log In" />
                <ButtonLogin onClick={anonlogin} text="anon Log In" />
              </>
            )}
            <Status />
          </Row>
        </header>
        <Col flexGrow={1} className="page">
          <Outlet />
        </Col>
      </Col>
    </Container>
  );
};

export default App;
