import React, { ReactNode, useContext } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
// import User, { UserProvider } from './components/User';
import Home from './pages/Home';
import Room from './pages/Room';
import Status from './components/Status';
import Row from './components/Row';
import { API } from './util';

// import LoginModule from './components/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error404 />,
  },
  {
    path: '/r/:id',
    element: <Room />,
  },
  {
    element: <LoginResult />,
    path: '/login',
  },
  {
    element: <User />,
    path: '/u/:login',
  },
]);

const App: React.FC = () => {
  const handle42Login = () => {
    window.location.href = API + '/auth/42';
  };

  const anonlogin = () => {
    location.href = API + `/auth/anon`;
  };

  return (
    <Container className="root">
      <Col className="app">
        <header>
          <Row>
            <ButtonLogin onClick={handle42Login} text="Log In" />
            <ButtonLogin onClick={anonlogin} text="anon Log In" />
            <Status />

            {/* <Button onClick={handle42Login}>Log In</Button> */}

            {/* <Button onClick={handleAccountClick}>Account</Button>{' '} */}
            {/* <Link to="/u/@self">Account</Link> */}
            {/* Updated this button */}
          </Row>
        </header>
        <Col flexGrow={1} className="page">
          <RouterProvider router={router} />
        </Col>
        <footer>
          <a href="https://stallman.org/photos/rms-working/dsc00367.jpg">
            average gnome user
          </a>
        </footer>
      </Col>
    </Container>
  );
};
export default App;
