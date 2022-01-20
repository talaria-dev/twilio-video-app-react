import React, { FormEvent, useEffect, useState } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import { Settings } from '../../../state/settings/settingsReducer';
import { Steps } from '../PreJoinScreens';
// import { setTokenSourceMapRange } from 'typescript';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setStep: (step: Steps) => void;
}

export default function RoomNameScreen({
  name,
  roomName,
  setName,
  setRoomName,
  handleSubmit,
  setStep,
}: RoomNameScreenProps) {
  const classes = useStyles();
  const { user, dispatchSetting, roomInfo } = useAppState();
  const [roomCreatedBy, setRoomCreatedBy] = useState('');

  useEffect(() => {
    setRoomName(roomInfo ? roomInfo.room_id_token : '');
    setRoomCreatedBy(roomInfo ? roomInfo.user_name : '');

    let _mode = roomInfo ? roomInfo.mode : 'grid';

    dispatchSetting({ name: 'bandwidthProfileMode' as keyof Settings, value: _mode as string });
  }, [roomInfo]);

  const userDisplayName = localStorage.getItem('userDisplayName');

  if (userDisplayName) {
    setName(userDisplayName);
    setStep(Steps.deviceSelectionStep);
  }

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  console.log('/// ROOM NAME SCREEN');
  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomInfo?.title} room
      </Typography>
      {/* <Typography variant="subtitle1">Room name: {roomName}</Typography>*/}
      {/* <Typography variant="subtitle1">Room mode: {roomType}</Typography> */}
      <Typography variant="subtitle1">Created by {roomCreatedBy}</Typography>
      {/* <Typography variant="subtitle1">Valid from: {roomValidFrom}</Typography>
      <Typography variant="subtitle1">Valid to: {roomValidTo}</Typography> */}
      <br></br>
      <Typography variant="body1">
        {hasUsername
          ? "Enter the name of a room you'd like to join."
          : 'Enter your name and press "Continue" to join the room.'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-user-name">
                Your Name
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
        </div>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name /*|| !roomName*/}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
