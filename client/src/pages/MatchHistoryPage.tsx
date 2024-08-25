import MatchHistory from '../components/MatchHistory';
import Col from '../components/Col';
import { useEffect } from 'react';
import { getLogin } from '../util';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function MatchHistoryPage() {
  const nav = useNavigate();

  useEffect(() => {
    const userId: string = getLogin();
    if (!userId) {
      nav('/');
    }
  }, []);

  return (
    <Col>
      <Typography variant="body2" sx={{ marginRight: 2 }}>
        <MatchHistory filterUser={false} />
      </Typography>
    </Col>
  );
}
