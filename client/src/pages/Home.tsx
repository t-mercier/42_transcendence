import Col from '../components/Col';
import GameMaker from '../components/GameMaker';
import { Link } from 'react-router-dom';
import { getLogin } from '../util';
import { Box } from '@mui/material';

export default function Home() {
  const userId = getLogin();
  if (!userId) {
    return <p>please log in</p>;
  } else {
    return (
      <Col>
        <h3>Welcome!</h3>
        <GameMaker />
        <Box sx={{ marginBottom: '1rem' }}>
          <Link to={'/matchhistory'}>
            <h3>View match history</h3>
          </Link>
        <Link to={'/ranking'}>
          <h3>View ranking</h3>
        </Link>
        <Link to={'/u/' + userId}>
          <h3>View my profile</h3>
        </Link>
        </Box>
      </Col>
    );
  }
}
