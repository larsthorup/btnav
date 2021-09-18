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
import rudder, {MotorDirection} from '../state/rudder';
import compass from '../state/compass';
import {listeningCompass} from '../service/compass';
import {stopTurning, turningLeft, turningRight} from '../service/rudder';
import navigation from '../state/navigation';
import {navigating} from '../service/navigation';
import RelayStatus from './RelayStatus';

type RudderMotorSwitchOption = {
  label: string;
  value: MotorDirection;
};

const rudderMotorSwitchOptions: RudderMotorSwitchOption[] = [
  {label: 'Bagbord', value: 'Left'},
  {label: 'Uændret', value: 'Hold'},
  {label: 'Styrbord', value: 'Right'},
];

const rudderMotorSwitchValueFromDirection = (direction: MotorDirection) => {
  return rudderMotorSwitchOptions.findIndex(o => o.value === direction);
};

const NavScreen = () => {
  const dispatch = useDispatch();
  const isDarkMode = false; // useColorScheme() === 'dark';
  const isNavigationEnabled = useSelector(state => state.navigation.isEnabled);
  const targetHeading = useSelector(state => state.navigation.targetHeading);
  const heading = useSelector(state => state.compass.heading);
  const motorDirection = useSelector(state => state.rudder.motorDirection);
  const windowWidth = Dimensions.get('window').width;
  const rudderMotorSwitchValue =
    rudderMotorSwitchValueFromDirection(motorDirection);
  // const [rudderMotorSwitchValue, setRudderMotorSwitchValue] = useState(
  //   rudderMotorSwitchValueFromDirection(motorDirection),
  // );

  useEffect(() => {
    dispatch(listeningCompass());
    dispatch(navigating());
  }, []);

  const onLeft = () => {
    dispatch(turningLeft());
    // setRudderMotorSwitchValue(rudderMotorSwitchValueFromDirection('Left'));
  };
  const onHold = () => {
    dispatch(stopTurning());
    // setRudderMotorSwitchValue(rudderMotorSwitchValueFromDirection('Hold'));
  };
  const onRight = () => {
    dispatch(turningRight());
    // setRudderMotorSwitchValue(rudderMotorSwitchValueFromDirection('Right'));
  };
  const onNavigationToggleAuto = () => {
    dispatch(
      navigation.actions.enable({
        isEnabled: !isNavigationEnabled,
        targetHeading: heading,
      }),
    );
  };

  const onRudderMotorSwitchPress = (value: string) => {
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
          <RelayStatus />
          <SwitchSelector
            style={{margin: 10}}
            disabled={isNavigationEnabled}
            options={rudderMotorSwitchOptions}
            initial={rudderMotorSwitchValue}
            value={rudderMotorSwitchValue}
            onPress={onRudderMotorSwitchPress}
            disableValueChangeOnPress={true}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 10,
            }}>
            <Text
              style={[
                styles.sectionDescription,
                {
                  color: isDarkMode ? Colors.light : Colors.dark,
                  margin: 10,
                },
              ]}>
              {isNavigationEnabled ? 'Styrer automatisk' : 'Du styrer'}
            </Text>
            <Button
              title={isNavigationEnabled ? 'Styr selv' : 'Hold kurs'}
              onPress={onNavigationToggleAuto}
            />
          </View>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {isNavigationEnabled ? `Ønsket kurs: ${targetHeading}°` : ''}
          </Text>
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
