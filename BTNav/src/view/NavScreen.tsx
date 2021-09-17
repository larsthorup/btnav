/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
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

import SwitchSelector from 'react-native-switch-selector';

import {useDispatch, useSelector} from '../state';
import relay from '../state/relay';
import rudder from '../state/rudder';
import compass from '../state/compass';
import {listeningCompass} from '../service/compass';
import {connectingRelay} from '../service/relay';
import {stopTurning, turningLeft, turningRight} from '../service/rudder';

const NavScreen = () => {
  const dispatch = useDispatch();
  const isDarkMode = false; // useColorScheme() === 'dark';
  const [isManual, setIsManual] = useState(true);
  const [targetHeading, setTargetHeading] = useState(0);
  const heading = useSelector(state => state.compass.heading);
  const motorDirection = useSelector(state => state.rudder.motorDirection);
  const {deviceId, isConnecting, isDiscovering, isReady, isScanning} =
    useSelector(state => state.relay);
  const windowWidth = Dimensions.get('window').width;
  const [motorSwitchValue, setMotorSwitchValue] = useState(1);

  useEffect(() => {
    dispatch(listeningCompass());
  }, []);

  useEffect(() => {
    if (!(isScanning || isConnecting || isDiscovering || isReady)) {
      dispatch(connectingRelay());
    }
  }, [isConnecting, isDiscovering, isReady, isScanning]);

  const onLeft = () => {
    dispatch(turningLeft());
    setMotorSwitchValue(0);
  };
  const onHold = () => {
    dispatch(stopTurning());
    setMotorSwitchValue(1);
  };
  const onRight = () => {
    dispatch(turningRight());
    setMotorSwitchValue(2);
  };
  const onPress = () => {
    setIsManual(isManual => !isManual);
    setTargetHeading(heading);
  };

  const motorSwitchOptions = [
    {label: 'Bagbord', value: 'Left'},
    {label: 'Uændret', value: 'Hold'},
    {label: 'Styrbord', value: 'Right'},
  ];

  const onMotorSwitchPress = value => {
    switch (value) {
      case 'Left':
        onLeft();
        break;
      case 'Hold':
        onHold();
        break;
      case 'Right':
        onRight();
        break;
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const relayStatus = isReady
    ? 'Forbundet'
    : isScanning
    ? '...søger...'
    : isConnecting
    ? '...forbinder...'
    : isDiscovering
    ? '...kontrollerer...'
    : '';

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
            {`Relæ: ${relayStatus}`}
          </Text>
          <SwitchSelector
            options={motorSwitchOptions}
            initial={motorSwitchValue}
            value={motorSwitchValue}
            onPress={onMotorSwitchPress}
          />
          {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Switch
              disabled={!isManual}
              value={motorDirection === 'Left'}
              onChange={onLeft}
            />
            <Switch
              disabled={!isManual}
              value={motorDirection === 'Hold'}
              onChange={onHold}
            />
            <Switch
              disabled={!isManual}
              value={motorDirection === 'Right'}
              onChange={onRight}
            />
          </View> */}
          <Button title={isManual ? 'Hold kurs' : 'Manuel'} onPress={onPress} />
          {!isManual && (
            <Text
              style={[
                styles.sectionDescription,
                {
                  color: isDarkMode ? Colors.light : Colors.dark,
                },
              ]}>
              {`Ønsket kurs: ${targetHeading}°`}
            </Text>
          )}
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {`Aktuel kurs: ${heading}°`}
          </Text>
        </View>
        <View style={{height: windowWidth}}>
          <Image
            style={[
              {zIndex: -1},
              backgroundStyle,
              styles.compass,
              {transform: [{rotate: `${360 - heading}deg`}]},
            ]}
            resizeMode="contain"
            source={require('../media/compass.png')}
          />
        </View>
      </SafeAreaView>
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
    fontSize: 16,
    fontWeight: '400',
  },
  compass: {
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
});

export default NavScreen;
