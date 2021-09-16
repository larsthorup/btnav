/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {Buffer} from 'buffer';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CompassHeading from 'react-native-compass-heading';
import {BleManager} from 'react-native-ble-plx';

type Motor = 'Left' | 'Hold' | 'Right';

const Relay1On = Buffer.from([0xa0, 0x01, 0x01, 0xa2]);
const Relay1Off = Buffer.from([0xa0, 0x01, 0x00, 0xa1]);
const Relay2On = Buffer.from([0xa0, 0x02, 0x01, 0xa3]);
const Relay2Off = Buffer.from([0xa0, 0x02, 0x00, 0xa2]);

let bleManager: BleManager | undefined;

const App = () => {
  const isDarkMode = false; // useColorScheme() === 'dark';
  const [compassHeading, setCompassHeading] = useState(0);
  const [motor, setMotor] = useState('Hold');
  const [deviceId, setDeviceId] = useState(undefined as string | undefined);
  const [isScanning, setIsScanning] = useState(false);

  const write = async (command: Buffer) => {
    console.log(!!bleManager, deviceId);
    if (bleManager && deviceId) {
      console.log(`write ${command.toString('hex')}`);
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        deviceId,
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe1-0000-1000-8000-00805f9b34fb',
        command.toString('base64'),
      );
    }
  };

  const onLeft = async () => {
    setMotor('Left');
    await write(Relay1On);
    await write(Relay2Off);
  };
  const onHold = async () => {
    setMotor('Hold');
    await write(Relay1Off);
    await write(Relay2Off);
  };
  const onRight = async () => {
    setMotor('Right');
    await write(Relay1Off);
    await write(Relay2On);
  };

  useEffect(() => {
    const degree_update_rate = 3;

    // accuracy on android will be hardcoded to 1
    // since the value is not available.
    // For iOS, it is in degrees
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      console.log({heading});
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    if (!isScanning) {
      setIsScanning(true);
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(permissionResult => {
        if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
          bleManager = new BleManager();
          bleManager.startDeviceScan(null, null, (error, device) => {
            if (bleManager && device && device.localName === 'DSD Relay') {
              bleManager.stopDeviceScan();
              console.log('Scan completed');
              bleManager.connectToDevice(device.id).then(() => {
                console.log('Connected');
                if (bleManager) {
                  bleManager
                    .discoverAllServicesAndCharacteristicsForDevice(device.id)
                    .then(() => {
                      console.log('Services and characteristics discovered');
                      setDeviceId(device.id);
                    });
                }
              });
            }
          });
        }
      });
    }
  }, [isScanning, setDeviceId, setIsScanning]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            SteadyNav Demo
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {`Aktuel kurs: ${compassHeading}°`}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {`Relæ: ${deviceId ? 'Forbundet' : '...forbinder...'}`}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            Manuel: Bagbord | Hold | Styrbord
          </Text>
          <Switch value={motor === 'Left'} onChange={onLeft} />
          <Switch value={motor === 'Hold'} onChange={onHold} />
          <Switch value={motor === 'Right'} onChange={onRight} />
        </View>
      </SafeAreaView>
      <Image
        style={[
          backgroundStyle,
          styles.compass,
          {transform: [{rotate: `${360 - compassHeading}deg`}]},
        ]}
        resizeMode="contain"
        source={require('./compass.png')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  compass: {
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
});

export default App;
