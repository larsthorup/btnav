import {createSlice, SliceReducer} from '../lib/redux-slice';

export type RelayState = Readonly<{
  isPowered: boolean;
  isScanning: boolean;
  isConnecting: boolean;
  isDiscovering: boolean;
  isReady: boolean;
  deviceId: string | null;
}>;

type RelayReducer<TPayload = void> = SliceReducer<RelayState, TPayload>;

const initialState: RelayState = {
  deviceId: null,
  isConnecting: false,
  isDiscovering: false,
  isPowered: false,
  isReady: false,
  isScanning: false,
};

const connecting: RelayReducer<void> = state => ({
  ...state,
  isConnecting: true,
  isDiscovering: false,
  isPowered: true,
  isReady: false,
  isScanning: false,
});

const discovering: RelayReducer<void> = state => ({
  ...state,
  isConnecting: false,
  isDiscovering: true,
  isPowered: true,
  isReady: false,
  isScanning: false,
});

const ready: RelayReducer<{deviceId: string}> = (state, {deviceId}) => ({
  ...state,
  deviceId,
  isConnecting: false,
  isDiscovering: false,
  isPowered: true,
  isReady: true,
  isScanning: false,
});

const scanning: RelayReducer<void> = state => ({
  ...state,
  isConnecting: false,
  isDiscovering: false,
  isPowered: true,
  isReady: false,
  isScanning: true,
});

export default createSlice({
  name: 'relay',
  initialState,
  reducers: {
    connecting,
    discovering,
    ready,
    scanning,
  },
});
