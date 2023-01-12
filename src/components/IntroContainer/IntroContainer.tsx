import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Swoosh from './swoosh';
import { useAppState } from '../../state';

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
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: Swoosh,
    backgroundSize: 'cover',
    width: '296px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  clientLogo: {
    width: '200px',
    height: 'auto',
    marginBottom: '20px',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '3em 4em',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  title: {
    color: 'white',
    margin: '1em 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: '1.1rem',
    },
  },
  subContentContainer: {
    marginTop: '1em',
    width: '100%',
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const classes = useStyles();
  const { /*user,*/ roomInfo } = useAppState();
  // const location = useLocation();
  const [clientLogo, setClientLogo] = useState('');

  useEffect(() => {
    if (roomInfo) {
      const url_str = new URL(window.location.href);
      let origin = url_str.origin.indexOf('localhost') !== -1 ? 'http://localhost:3600' : url_str.origin;
      let logo_url = '';

      if (roomInfo.client_logo) {
        logo_url = origin + '/client_logos/' + roomInfo.client_id + '.png';
      } else {
        logo_url = origin + '/client_logos/talaria.png';
      }

      setClientLogo(logo_url);
    }
  }, [roomInfo]);

  return (
    <div className={classes.background}>
      {/* {user && location.pathname !== '/login' && <UserMenu />} */}
      <div className={classes.container}>
        {clientLogo && <img className={classes.clientLogo} src={clientLogo} alt="" />}
        <div className={classes.innerContainer}>
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default IntroContainer;
