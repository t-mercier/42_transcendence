import { useRef, useEffect, useState } from 'react';
import GameClient from '../GameClient';
import Col from './Col';
import Row from './Row';
import { getLogin } from '../util';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { GameEventData, GameState, GameType } from '../GameCommon';
import { socket } from '../game.socket';
import { API } from '../util';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type SetterFunction = React.Dispatch<any>;

const GC = new GameClient();

const GameAvatar = (props: any) => {
  const picture: any =
    props.userData && props.userData.picture
      ? props.userData.picture
      : undefined;
  return (
    <Avatar
      src={picture}
      alt="Profile"
      style={{ width: '100px', height: '100px' }}
    />
  );
};

const JoinButton = (props: any) => {
  return (
    <Button
      disabled={
        props.obj.gameState != GameState.WaitingForPlayers ||
        props.obj.playerA == props.obj.userId ||
        props.obj.playerB == props.obj.userId
      }
      onClick={() => GC.join()}
    >
      Join Game!
    </Button>
  );
};

const LeaveButton = (props: any) => {
  return (
    <Button
      disabled={
        props.obj.playerA != props.obj.userId &&
        props.obj.playerB != props.obj.userId
      }
      onClick={() => GC.leave()}
    >
      Leave Game!
    </Button>
  );
};

const StartButton = (props: any) => {
  return (
    <Button
      disabled={
        props.obj.gameState != GameState.ReadyToStart ||
        (props.obj.playerA != props.obj.userId &&
          props.obj.playerB != props.obj.userId)
      }
      onClick={() => GC.start()}
    >
      Start Game!
    </Button>
  );
};

const Game = () => {
  const { id } = useParams(); // this is the room ID!
  const cr = useRef<HTMLCanvasElement>(null);
  const gameId: string = id!;
  const userId: string = getLogin();
  const [gameStateString, setGameStateStr] = useState('loading game');
  const [gameState, setGameState] = useState(GameState.WaitingForPlayers);
  const [playerA, setPlayerA] = useState<string | undefined>(undefined);
  const [playerB, setPlayerB] = useState<string | undefined>(undefined);
  const [spectators, setSpectators] = useState<string | undefined>(undefined);
  const [textMsg, setTextMsg] = useState<string | undefined>(undefined);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [gameTypeStr, setGameTypeStr] = useState<string>('Classic');
  const [publicOrPrivateStr, setPublicOrPrivateStr] =
    useState<string>('Public');
  const [userDataA, setUserDataA] = useState<any>(null);
  const [userDataB, setUserDataB] = useState<any>(null);
  const [scoreAstate, setScoreAstate] = useState<number>(0);
  const [scoreBstate, setScoreBstate] = useState<number>(0);

  useEffect(() => {
    const ctx = cr.current?.getContext('2d');
    if (!ctx) return;
    socket.connect();
    GC.load(ctx, getLogin(), id!);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      GC.unload();
      socket.disconnect();
    };
  }, [cr, id]);

  useEffect(() => {
    const onStateChange = (e: GameEventData['game_state']) => {
      setGameState(e.gameState);
      setPlayerA(e.playerA);
      setScoreAstate(e.scoreA);
      fetchUserData(e.playerA, setUserDataA);
      setPlayerB(e.playerB);
      setScoreBstate(e.scoreB);
      fetchUserData(e.playerB, setUserDataB);
      setSpectators([...e.spectators].join(', '));
      setTextMsg(e.textMsg);
      setScaleFactor(GC.calcScaleFactor(window.innerWidth, window.innerHeight));
      if (e.gameState == GameState.WaitingForPlayers)
        setGameStateStr('waiting for players');
      if (e.gameState == GameState.ReadyToStart)
        setGameStateStr('ready to start');
      if (e.gameState == GameState.Running) setGameStateStr('running');
      if (e.gameState == GameState.Finished) setGameStateStr('finished');

      switch (e.gameType) {
        case GameType.Classic: {
          setGameTypeStr('Classic');
          break;
        }
        case GameType.SelfBalancing: {
          setGameTypeStr('Self-balaning');
          break;
        }
      }
      if (e.isPublic == true) {
        setPublicOrPrivateStr('Public');
      } else {
        setPublicOrPrivateStr('Private');
      }
    };

    socket.on('game_state', onStateChange);
    return () => {
      socket.off('game_state', onStateChange);
    };
  }, [id]);

  function handleResize() {
    setScaleFactor(GC.calcScaleFactor(window.innerWidth, window.innerHeight));
  }

  const fetchUserData = async (
    newPlayer: string | undefined,
    setUserData: SetterFunction,
  ) => {
    if (newPlayer == undefined) {
      setUserData(undefined);
    } else {
      try {
        const response = await fetch(`${API}/user/${newPlayer}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        setUserData(await response.json());
      } catch (err: any) {
        console.log('error retrieving user: ', userId);
      }
    }
  };

  function buttonProps(): any {
    const obj: any = {
      gameState: gameState,
      userId: userId,
      playerA: playerA,
      playerB: playerB,
    };
    return obj;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box display="flex" flexDirection="row" width="100%">
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'inherit', // Inherit the global background color
            boxShadow: 'none', // Remove shadow if not needed
            border: '1px solid #007700', // Optional: add border to match the theme
          }}
        >
          <Table aria-label="simple table" size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2" color="inherit">Actions:</Typography>
                </TableCell>
                <TableCell>
                  <JoinButton obj={buttonProps()} />
                  <LeaveButton obj={buttonProps()} />
                  <StartButton obj={buttonProps()} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2" color="inherit">Game:</Typography>
                </TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Box sx={{ margin: '0 30px 0 8px' }}>
                    <Typography variant="body2" color="inherit">{gameTypeStr}</Typography>
                  </Box>
                  <Box sx={{ margin: '0 30px 0 0' }}>
                    <Typography variant="body2" color="inherit">{publicOrPrivateStr}</Typography>
                  </Box>
                  <Box sx={{ margin: '0 30px 0 0' }}>
                    <Typography variant="body2" color="inherit">{gameStateString}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '30px',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <GameAvatar userData={userDataA} />
        <Typography
          color="inherit"
          variant="h2"
          component="div"
          sx={{ margin: '10px' }}
        >
          {scoreAstate.toString()} - {scoreBstate.toString()}
        </Typography>
        <GameAvatar userData={userDataB} />
      </Box>

      <canvas
        ref={cr}
        width={GameClient.W * scaleFactor}
        height={GameClient.H * scaleFactor}
        style={{ display: 'block', margin: 'auto' }}
      ></canvas>
    </Box>
  );
};

export default Game;
