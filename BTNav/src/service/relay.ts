import {Buffer} from 'buffer';

import {PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import {Dispatch, RootState, Saga} from '../state';
import relay from '../state/relay';

let bleManager: BleManager | undefined;

const Hm10UartServiceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
const Hm10UartCharacteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';

export const Relay1On = Buffer.from([0xa0, 0x01, 0x01, 0xa2]);
export const Relay1Off = Buffer.from([0xa0, 0x01, 0x00, 0xa1]);
export const Relay2On = Buffer.from([0xa0, 0x02, 0x01, 0xa3]);
export const Relay2Off = Buffer.from([0xa0, 0x02, 0x00, 0xa2]);

export const writing: Saga<Buffer> =
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

export const connectingRelay: Saga<void> = () => async (dispatch: Dispatch) => {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ).then(permissionResult => {
    if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
      bleManager = new BleManager();
      dispatch(relay.actions.scanning());
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (bleManager && device && device.localName === 'DSD Relay') {
          bleManager.stopDeviceScan();
          dispatch(relay.actions.connecting());
          bleManager.connectToDevice(device.id).then(() => {
            if (bleManager) {
              dispatch(relay.actions.discovering());
              bleManager
                .discoverAllServicesAndCharacteristicsForDevice(device.id)
                .then(() => {
                  dispatch(relay.actions.ready({deviceId: device.id}));
                });
            }
          });
        }
      });
    }
  });
};
