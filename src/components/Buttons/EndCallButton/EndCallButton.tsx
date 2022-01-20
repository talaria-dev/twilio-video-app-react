import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
      marginLeft: 10,
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  const hangup = () => {
    console.log('window.location :', window.location);
    console.log('window.parent.location :', window.parent.location);
    console.log(window.parent);

    if (window.location !== window.parent.location) {
      // The page is in an iframe
      room!.disconnect();
      window.parent.postMessage('close_conf_iframe', '*');
    } else {
      // The page is not in an iframe
      room!.disconnect();
    }
  };

  return (
    <Button onClick={hangup} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Hangup
    </Button>
  );
}
