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
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import CompassHeading from 'react-native-compass-heading';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [compassHeading, setCompassHeading] = useState(0);

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
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            some text
          </Text>
        </View>
      </SafeAreaView>
      <Image
        style={[
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
    width: '90%',
    flex: 1,
    alignSelf: 'center',
  },
});

export default App;
