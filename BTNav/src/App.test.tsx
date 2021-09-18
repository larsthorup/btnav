/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from './App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {Dispatch} from './state';

jest.mock('./service/relay', () => {
  return {
    connectingRelay: () => {
      return () => Promise.resolve();
    },
  };
});
jest.mock('./service/navigation', () => {
  return {
    navigating: () => {
      return () => Promise.resolve();
    },
  };
});

it('renders correctly', async () => {
  renderer.create(<App />);
  await new Promise(resolve => setTimeout(resolve, 100)); // wait for mocked async services
});
