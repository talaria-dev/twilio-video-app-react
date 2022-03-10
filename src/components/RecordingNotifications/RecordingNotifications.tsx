import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@material-ui/core';
import Snackbar from '../Snackbar/Snackbar';
import useIsRecording from '../../hooks/useIsRecording/useIsRecording';
import { useAppState } from '../../state';

enum Snackbars {
  none,
  recordingStarted,
  recordingInProgress,
  recordingFinished,
}

export default function RecordingNotifications() {
  const [activeSnackbar, setActiveSnackbar] = useState(Snackbars.none);
  const prevIsRecording = useRef<boolean | null>(null);
  const isRecording = useIsRecording();
  const { roomInfo } = useAppState();
  const [message, setMessage] = useState(<></>);
  const genericMessage =
    'Once this room is closed, we will start processing your recording. When the processing finishes, we will let you know and send you the link for the video.';

  useEffect(() => {
    console.log('##### Set recording notification message');
    if (roomInfo!.email) {
      setMessage(
        <>
          {genericMessage} Once this conference is completed, the recording will be processed and when it's ready the
          link will be sent to {roomInfo!.user_name} to {roomInfo!.email}.
        </>
      );
    } else {
      setMessage(
        <>
          {genericMessage} Once this conference is completed, the recording will be processed and when it's ready the
          link will be sent to {roomInfo!.user_name} via notification. He/she should keep the browser window open after
          the hangup. Recording processing can take several hours.
        </>
      );
    }
  }, []);

  useEffect(() => {
    // Show "Recording in progress" snackbar when a user joins a room that is recording
    if (isRecording && prevIsRecording.current === null) {
      setActiveSnackbar(Snackbars.recordingInProgress);
    }
  }, [isRecording]);

  useEffect(() => {
    // Show "Recording started" snackbar when recording has started.
    if (isRecording && prevIsRecording.current === false) {
      setActiveSnackbar(Snackbars.recordingStarted);
    }
  }, [isRecording]);

  useEffect(() => {
    // Show "Recording finished" snackbar when recording has stopped.
    if (!isRecording && prevIsRecording.current === true) {
      setActiveSnackbar(Snackbars.recordingFinished);
    }
  }, [isRecording]);

  useEffect(() => {
    prevIsRecording.current = isRecording;
  }, [isRecording]);

  return (
    <>
      <Snackbar
        open={activeSnackbar === Snackbars.recordingStarted}
        handleClose={() => setActiveSnackbar(Snackbars.none)}
        variant="info"
        headline="Recording has started."
        message=""
      />
      <Snackbar
        open={activeSnackbar === Snackbars.recordingInProgress}
        handleClose={() => setActiveSnackbar(Snackbars.none)}
        variant="info"
        headline="Recording is in progress."
        message=""
      />
      <Snackbar
        open={activeSnackbar === Snackbars.recordingFinished}
        headline="Recording Complete! "
        message={message}
        variant="info"
        handleClose={() => setActiveSnackbar(Snackbars.none)}
      />
    </>
  );
}
