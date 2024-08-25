import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import Game from '../components/Game';
import Col from '../components/Col';

export default function Room() {
  const { id = '' } = useParams();

  return (
    <Col flexGrow={1} gap={'2rem'} paddingBottom={'2rem'}>
      <Game />
      <Chat id={id}></Chat>
    </Col>
  );
}
