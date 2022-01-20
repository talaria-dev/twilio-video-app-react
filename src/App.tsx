import React, { useEffect, useState } from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import { makeStyles, Typography } from '@material-ui/core';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import { useAppState } from './state';
import { CircularProgress } from '@material-ui/core';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import useLocalVideoToggle from './hooks/useLocalVideoToggle/useLocalVideoToggle';
import useLocalAudioToggle from './hooks/useLocalAudioToggle/useLocalAudioToggle';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100%',
  },
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  innerContainer: {
    display: 'flex',
    width: '600px',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
    },
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '4em',
    flex: 1,
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  gutterBottom: {
    marginBottom: '1em',
  },
  preloader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100%',
  },
}));

interface RoomErrorProps {
  title: string;
  message: string;
}

const RoomError = (props: RoomErrorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.content}>
            <Typography variant="h6" className={classes.gutterBottom}>
              {props.title}
            </Typography>
            <Typography variant="body1">{props.message}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const classes = useStyles();
  const roomState = useRoomState();
  const { getToken, roomInfo } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { connect: videoConnect, isAcquiringLocalTracks, localTracks } = useVideoContext();

  const [showPreloader, setShowPreloader] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [roomNotReady, setRoomNotReady] = useState(false);
  const [roomExpired, setRoomExpired] = useState(false);
  const [roomValidFrom, setRoomValidFrom] = useState('');
  const [roomValidTo, setRoomValidTo] = useState('');
  const [autoJoin, setAutoJoin] = useState(false);

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  const [initialziedConnect, setInitialziedConnect] = useState(false);

  useEffect(() => {
    if (!isAcquiringLocalTracks && autoJoin && roomState === 'disconnected') {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (!initialziedConnect) {
        setInitialziedConnect(true);

        getToken(params.name, roomInfo!.room_id_token).then(({ token }) => {
          videoConnect(token);
        });
      }
    }

    if (roomState === 'connected') {
      setAutoJoin(false);
    }
  }, [localTracks]);

  useEffect(() => {
    if (roomInfo === undefined) {
      setShowPreloader(true);
    } else if (roomInfo.error) {
      setShowPreloader(false);
      setTokenError(true);
    } else {
      let valid_from_obj = new Date(roomInfo.accessible_from);
      let valid_from_str = valid_from_obj.toString().split(' GMT')[0];
      setRoomValidFrom(valid_from_str);

      let valid_to_obj = new Date(roomInfo.accessible_to);
      let valid_to_str = valid_to_obj.toString().split(' GMT')[0];
      setRoomValidTo(valid_to_str);

      if (valid_from_obj.getTime() > Date.now()) {
        setRoomNotReady(true);
      }

      if (valid_to_obj.getTime() < Date.now()) {
        setRoomExpired(true);
      }

      if (!roomNotReady && !roomExpired) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (params.hasOwnProperty('name')) {
          setAutoJoin(true);

          getAudioAndVideoTracks().catch(error => {
            console.log('Error acquiring local media:');
            console.dir(error);
          });
        }
      }
      setShowPreloader(false);
    }
  }, [roomInfo]);

  if (showPreloader) {
    return (
      <div className={classes.preloader}>
        <CircularProgress />
      </div>
    );
  } else if (tokenError) {
    return (
      <RoomError
        title="The room is not accessible"
        message="The room token is not valid. Please enter the valid room token and try again."
      />
    );
  } else if (roomNotReady) {
    const msg = 'Room ' + roomInfo?.title + ' will be accessible at ' + roomValidFrom;

    return <RoomError title="Room is not accessible yet" message={msg} />;
  } else if (roomExpired) {
    const msg = 'Room ' + roomInfo?.title + ' expired at ' + roomValidTo;

    return <RoomError title="Room expired" message={msg} />;
  } else if (autoJoin) {
    return (
      <div className={classes.preloader}>
        <CircularProgress />
      </div>
    );
  } else {
    console.log('############# roomState :', roomState);
    const isNotInIframe = window.location === window.parent.location;

    return (
      <Container style={{ height }}>
        {roomState === 'disconnected' && isNotInIframe ? (
          <PreJoinScreens />
        ) : (
          <Main>
            <ReconnectingNotification />
            <RecordingNotifications />
            <MobileTopMenuBar />
            <Room />
            <MenuBar />
          </Main>
        )}
      </Container>
    );
  }
}
