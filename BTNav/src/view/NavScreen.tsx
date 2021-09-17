/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
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
  const heading = useSelector(state => state.compass.heading);
  const motorDirection = useSelector(state => state.rudder.motorDirection);
  const {deviceId, isConnecting, isDiscovering, isReady, isScanning} =
    useSelector(state => state.relay);

  useEffect(() => {
    dispatch(listeningCompass());
  }, []);

  useEffect(() => {
    if (!(isScanning || isConnecting || isDiscovering || isReady)) {
      dispatch(connectingRelay());
    }
  }, [isConnecting, isDiscovering, isReady, isScanning]);

  const onLeft = () => dispatch(turningLeft());
  const onHold = () => dispatch(stopTurning());
  const onRight = () => dispatch(turningRight());

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
            {`Aktuel kurs: ${heading}°`}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {`Relæ: ${relayStatus}`}
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
          <Switch value={motorDirection === 'Left'} onChange={onLeft} />
          <Switch value={motorDirection === 'Hold'} onChange={onHold} />
          <Switch value={motorDirection === 'Right'} onChange={onRight} />
        </View>
      </SafeAreaView>
      <Image
        style={[
          backgroundStyle,
          styles.compass,
          {transform: [{rotate: `${360 - heading}deg`}]},
        ]}
        resizeMode="contain"
        source={require('../media/compass.png')}
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

export default NavScreen;
