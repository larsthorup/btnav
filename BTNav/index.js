/**
 * @format
 */

import { AppRegistry } from 'react-native';
import LogRocket from '@logrocket/react-native';

import App from './src/App';
import { name as appName } from './app.json';

LogRocket.init('h5ovjy/btnav-dev')

AppRegistry.registerComponent(appName, () => App);
