import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
// import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import ToggleSizeButton from '../Buttons/ToggleSizeButton/ToggleSizeButton';
import Menu from '../MenuBar/Menu/Menu';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    padding: '1em',
    display: 'none',
    // height: `${theme.mobileTopBarHeight}px`,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  endCallButton: {
    height: '28px',
    fontSize: '0.85rem',
    padding: '0 0.6em',
  },
  settingsButton: {
    [theme.breakpoints.down('sm')]: {
      height: '28px',
      minWidth: '28px',
      border: '1px solid rgb(136, 140, 142)',
      padding: 0,
      margin: '0 1em',
    },
  },
}));

export default function MobileTopMenuBar() {
  const classes = useStyles();
  // const { room } = useVideoContext();
  const { roomInfo } = useAppState();
  const isInIframe = window.location !== window.parent.location;
  // const isInIframe = true;

  return (
    <Grid container alignItems="center" justifyContent="space-between" className={classes.container}>
      <Typography variant="subtitle1">{roomInfo?.title}</Typography>
      <div>
        {/* {isInIframe && <ToggleSizeButton className={classes.endCallButton} />} */}
        <ToggleSizeButton className={classes.endCallButton} />
        <EndCallButton className={classes.endCallButton} />
        <Menu buttonClassName={classes.settingsButton} />
      </div>
    </Grid>
  );
}
