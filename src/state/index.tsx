import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { RecordingRules, RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';
import { User } from 'firebase';
// import

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(name: string, room: string, passcode?: string): Promise<{ room_type: RoomType; token: string }>;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;

  roomInfo?: {
    error?: string;
    room_id_token: string;
    accessible_from: string;
    accessible_to: string;
    client_id: string;
    client_logo: boolean;
    client_name: string;
    mode: string;
    title: string;
    user_avatar: string;
    user_id: string;
    user_name: string;
    email: string;
  };

  updateRecordingRules(room_sid: string, rules: RecordingRules, client_id: string): Promise<object>;
}

export const StateContext = createContext<StateContextType>(null!);

async function getRoomInfo() {
  const url_str = new URL(window.location.href);
  const token = url_str.searchParams.get('token');
  let origin = url_str.origin.indexOf('localhost') !== -1 ? 'http://localhost:3600' : url_str.origin;
  const api_endpoint = origin + '/api/confroom/?token=' + token;

  const response = await fetch(api_endpoint);
  return response.json();
}

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);

  const [roomInfo, setRoomInfo] = useState();

  useEffect(() => {
    getRoomInfo().then(res => {
      if (res.success) {
        setRoomInfo(res.data);
        document.getElementsByTagName('TITLE')[0].innerHTML = res.data.client_name + ' - Video Conference App';
      } else {
        setRoomInfo(res);
      }
    });
  }, []);

  const [roomType, setRoomType] = useState<RoomType>();

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomInfo,
    roomType,
  } as StateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    contextValue = {
      ...contextValue,
      ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
      getToken: async (user_identity, room_name) => {
        console.log('getToken', user_identity, room_name);
        // const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
        let endpoint = '/api/twilio';
        if (window.location.hostname === 'localhost') {
          endpoint = 'http://localhost:3600/api/twilio';
        }

        return fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            user_identity,
            room_name,
            create_conversation: process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true',
          }),
        }).then(res => res.json());
      },
      updateRecordingRules: async (room_sid, rules, client_id) => {
        console.log('updateRecordingRules', room_sid, rules, client_id);
        // const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/recordingrules';
        let endpoint = '/api/recordingrules';
        if (window.location.hostname === 'localhost') {
          endpoint = 'http://localhost:3600/api/recordingrules';
        }

        console.log('endpoint:', endpoint);

        return fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room_sid, rules, client_id }),
          method: 'POST',
        })
          .then(async res => {
            const jsonResponse = await res.json();
            console.log('jsonResponse', jsonResponse);

            if (!res.ok) {
              const recordingError = new Error(
                jsonResponse.error?.message || 'There was an error updating recording rules'
              );
              recordingError.code = jsonResponse.error?.code;
              return Promise.reject(recordingError);
            }

            return jsonResponse;
          })
          .catch(err => setError(err));
      },
    };
  }

  const getToken: StateContextType['getToken'] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  const updateRecordingRules: StateContextType['updateRecordingRules'] = (room_sid, rules, client_id) => {
    setIsFetching(true);
    return contextValue
      .updateRecordingRules(room_sid, rules, client_id)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, updateRecordingRules }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
