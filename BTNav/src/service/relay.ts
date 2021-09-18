import {Buffer} from 'buffer';

import {PermissionsAndroid} from 'react-native';
import {BleManager, State} from 'react-native-ble-plx';

import {Dispatch, RootState, Saga} from '../state';
import relay from '../state/relay';

let bleManager: BleManager | undefined;

const Hm10UartServiceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
const Hm10UartCharacteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';

const Relay1On = Buffer.from([0xa0, 0x01, 0x01, 0xa2]);
const Relay1Off = Buffer.from([0xa0, 0x01, 0x00, 0xa1]);
const Relay2On = Buffer.from([0xa0, 0x02, 0x01, 0xa3]);
const Relay2Off = Buffer.from([0xa0, 0x02, 0x00, 0xa2]);

const writing: Saga<Buffer> =
  (command: Buffer) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const {deviceId} = getState().relay;
    if (bleManager && deviceId) {
      console.log(`write ${command.toString('hex')}`);
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        deviceId,
        Hm10UartServiceUuid,
        Hm10UartCharacteristicUuid,
        command.toString('base64'),
      );
    }
  };

export const startMotor1: Saga<void> = () => async (dispatch: Dispatch) => {
  await dispatch(writing(Relay1On));
  await dispatch(writing(Relay2Off));
};

export const startMotor2: Saga<void> = () => async (dispatch: Dispatch) => {
  await dispatch(writing(Relay1Off));
  await dispatch(writing(Relay2On));
};

export const stopAllMotors: Saga<void> = () => async (dispatch: Dispatch) => {
  await dispatch(writing(Relay1Off));
  await dispatch(writing(Relay2Off));
};

export const connectingRelay: Saga<void> = () => async (dispatch: Dispatch) => {
  const permissionResult = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
    bleManager = new BleManager();
    const state = await bleManager.state();
    if (state === State.PoweredOn) {
      dispatch(relay.actions.online(true));
      dispatch(relay.actions.scanning());
      bleManager.startDeviceScan(null, null, async (error, device) => {
        if (bleManager && device && device.localName === 'DSD Relay') {
          bleManager.stopDeviceScan();
          dispatch(relay.actions.connecting());
          await bleManager.connectToDevice(device.id);
          bleManager.onDeviceDisconnected(device.id, async (error, device) => {
            dispatch(relay.actions.disconnected());
          });
          dispatch(relay.actions.discovering());
          await bleManager.discoverAllServicesAndCharacteristicsForDevice(
            device.id,
          );
          dispatch(relay.actions.ready({deviceId: device.id}));
        }
      });
    } else {
      dispatch(relay.actions.online(false));
    }
  }
};
