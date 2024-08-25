import { Box, Button } from '@mui/material';
import { API, getLogin } from '../util';
import { useParams } from 'react-router-dom';
import Row from './Row';
import { useState } from 'react';

const AddFriend = () => {
  const user = getLogin();
  const { login: friend } = useParams();
  const [msg, setMsg] = useState('');
  const onclick = async () => {
    const res = await fetch(`${API}/user/${user}/friend/${friend}`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    setMsg(data.message);
  };
  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={onclick}
        variant="outlined"
        sx={{ color: '#00ff00', borderColor: '#00ff00' }}
      >
        Toggle Friend
      </Button>
      <span style={{ marginLeft: '8px', color: '#00ff00' }}>{msg}</span>
    </Box>
  );
};
export default AddFriend;
