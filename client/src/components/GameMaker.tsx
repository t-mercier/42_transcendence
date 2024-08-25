import { useEffect, useState, SyntheticEvent } from 'react';
import { socket } from '../game.socket';
import { GameEventData, GameType } from '../GameCommon';
import { getLogin } from '../util';
import { useNavigate } from 'react-router-dom';
import { randomUUID } from '../util';
import {
  Box,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  Button,
  Typography,
} from '@mui/material';

const GameMaker = () => {
  const userId = getLogin();
  const nav = useNavigate();
  const [gameTypeStr, setGameTypeStr] = useState<string>('Classic');
  const [publicOrPrivateStr, setPublicOrPrivateStr] =
    useState<string>('Public');

  useEffect(() => {
    const onjoin_game_room = (ug: GameEventData['join_game_room']) => {
      if (ug.userId == userId) nav('/r/' + ug.gameId);
    };
    socket.connect();
    socket.on('join_game_room', onjoin_game_room);
    return () => {
      socket.off('join_game_room', onjoin_game_room);
    };
  }, []);

  function submitHandler(event: SyntheticEvent) {
    console.log(`submit handler: -${publicOrPrivateStr}-, ${gameTypeStr}`);
    event.preventDefault();
    const gameType: GameType =
      gameTypeStr == 'Classic' ? GameType.Classic : GameType.SelfBalancing;
    switch (publicOrPrivateStr) {
      case 'Public': {
        console.log('emitting Public..');
        socket.emit('enque', { userId: userId, gameType: gameType });
        break;
      }
      case 'Private': {
        console.log('emitting Private..');
        socket.emit('create', {
          userId: userId,
          gameId: 'game-' + randomUUID(),
          isPublic: false,
          gameType: gameType,
        });
        break;
      }
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <Box
        component="fieldset"
        sx={{
          borderColor: '#00ff00',
          padding: '1rem',
          fontFamily: 'Fira Code, monospace',
          color: '#00ff00',
        }}
      >
        <h3>
        ______ CREATE A GAME ROOM TO PLAY ______
        </h3>
        <FormControl
          component="fieldset"
          sx={{ fontFamily: 'Fira Code, monospace', color: '#00ff00' }}
        >
          <FormLabel
            id="game-type"
            sx={{
              color: '#00ff00',
              marginBottom: '0.5rem',
            }}
          >
            Which version of PONG! do you want to play?
          </FormLabel>
          <RadioGroup
            aria-labelledby="game-type"
            defaultValue="Classic"
            name="gameType"
            onChange={(e) => setGameTypeStr(e.target.value)}
          >
            <FormControlLabel
              value="Classic"
              control={<Radio sx={{ color: '#00ff00' }} />}
              label={
                <Typography
                  sx={{ color: '#00ff00', fontFamily: 'Fira Code, monospace' }}
                >
                  PONG Classic!
                </Typography>
              }
            />
            <FormControlLabel
              value="Self-balancing"
              control={<Radio sx={{ color: '#00ff00' }} />}
              label={
                <Typography
                  sx={{ color: '#00ff00', fontFamily: 'Fira Code, monospace' }}
                >
                  Self-balancing PONG!
                </Typography>
              }
            />
          </RadioGroup>

          <FormLabel
            id="public-private"
            sx={{
              color: '#00ff00',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            Public or Private?
          </FormLabel>
          <RadioGroup
            aria-labelledby="public-private"
            defaultValue="Public"
            name="publicPrivate"
            onChange={(e) => setPublicOrPrivateStr(e.target.value)}
          >
            <FormControlLabel
              value="Public"
              control={<Radio sx={{ color: '#00ff00' }} />}
              label={
                <Typography
                  sx={{ color: '#00ff00', fontFamily: 'Fira Code, monospace' }}
                >
                  Public - play PONG with strangers!
                </Typography>
              }
            />
            <FormControlLabel
              value="Private"
              control={<Radio sx={{ color: '#00ff00' }} />}
              label={
                <Typography
                  sx={{ color: '#00ff00', fontFamily: 'Fira Code, monospace' }}
                >
                  Private - invite people to your game room!
                </Typography>
              }
            />
          </RadioGroup>
          <Button
            type="submit"
            sx={{
              marginTop: '1rem',
              color: '#00ff00',
              borderColor: '#00ff00',
              fontFamily: 'Fira Code, monospace',
              '&:hover': {
                backgroundColor: '#00ff00',
                color: '#1e1e1e',
              },
            }}
            variant="outlined"
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </form>
  );
};

export default GameMaker;
