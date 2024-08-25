import { API } from '../util';
import React, { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function TwoFAVerify() {
  const [twoFAToken, setTwoFAToken] = useState('');
  const { login } = useParams<{ login: string }>();

  const handleVerificationSubmit = async (
    event: FormEvent<HTMLFormElement> | MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    const res = await fetch(`${API}/auth/${login}/${twoFAToken}/2fa/verify`, {
      method: 'POST',
      credentials: 'include',
    });
    const redir_url = await res.text();
    if (redir_url !== '') {
      location.href = redir_url;
    } else {
      alert('Wrong code!');
    }
  };

  const verifcationOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTwoFAToken(event.target.value);
  };

  return (
    <>
      <Typography variant="body2" gutterBottom>
        user/ {login}
      </Typography>
      <Box
        component="form"
        onSubmit={handleVerificationSubmit}
        display="flex"
        alignItems="center"
      >
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          2FA code/
        </Typography>
        <input
          id="verification-code"
          type="text"
          value={twoFAToken}
          onChange={verifcationOnChangeHandler}
          style={{
            border: 'none',
            borderBottom: '1px solid #00ff00',
            width: '200px',
            marginRight: '10px',
            outline: 'none',
            padding: '5px 0',
          }}
        />
        <Typography
          component="a"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleVerificationSubmit(e);
          }}
          sx={{
            cursor: 'pointer',
            color: 'blue',
            fontSize: '0.875rem', // Smaller font size (14px)
            fontStyle: 'italic', // Italic style
          }}
        >
          Submit
        </Typography>
      </Box>
    </>
  );
}
