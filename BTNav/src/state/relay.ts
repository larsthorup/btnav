import {createSlice, SliceReducer} from '../lib/redux-slice';

export type RelayState = Readonly<{
  isOnline: boolean;
  isScanning: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isDiscovering: boolean;
  isReady: boolean;
  deviceId: string | null;
}>;

type RelayReducer<TPayload = void> = SliceReducer<RelayState, TPayload>;

const initialState: RelayState = {
  deviceId: null,
  isConnecting: false,
  isDisconnected: false,
  isDiscovering: false,
  isOnline: false,
  isReady: false,
  isScanning: false,
};

const connecting: RelayReducer<void> = state => ({
  ...state,
  isConnecting: true,
  isDisconnected: false,
  isDiscovering: false,
  isOnline: true,
  isReady: false,
  isScanning: false,
});

const disconnected: RelayReducer<void> = state => ({
  ...state,
  isConnecting: false,
  isDisconnected: true,
  isDiscovering: false,
  isOnline: true,
  isReady: false,
  isScanning: false,
});

const discovering: RelayReducer<void> = state => ({
  ...state,
  isConnecting: false,
  isDisconnected: false,
  isDiscovering: true,
  isOnline: true,
  isReady: false,
  isScanning: false,
});

const online: RelayReducer<boolean> = (state, isOnline) => ({
  ...state,
  isConnecting: false,
  isDisconnected: false,
  isDiscovering: false,
  isOnline,
  isReady: false,
  isScanning: false,
});

const ready: RelayReducer<{deviceId: string}> = (state, {deviceId}) => ({
  ...state,
  deviceId,
  isConnecting: false,
  isDisconnected: false,
  isDiscovering: false,
  isOnline: true,
  isReady: true,
  isScanning: false,
});

const scanning: RelayReducer<void> = state => ({
  ...state,
  isConnecting: false,
  isDisconnected: false,
  isDiscovering: false,
  isOnline: true,
  isReady: false,
  isScanning: true,
});

export default createSlice({
  name: 'relay',
  initialState,
  reducers: {
    connecting,
    disconnected,
    discovering,
    online,
    ready,
    scanning,
  },
});
