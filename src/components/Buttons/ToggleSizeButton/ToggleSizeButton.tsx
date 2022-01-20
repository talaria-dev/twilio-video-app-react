import React from 'react';

import Button from '@material-ui/core/Button';
// import ZoomInMapIcon from '@material-ui/icons';

export default function ToggleSizeButton(props: { className?: string }) {
  const toggleSize = () => {
    console.log('toggle size');
    window.parent.postMessage('minimize_conf_iframe', '*');
  };

  return (
    <Button variant="outlined" onClick={toggleSize} className={props.className}>
      Minimize
    </Button>
  );
}
