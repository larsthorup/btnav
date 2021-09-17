import React, {useEffect} from 'react';

import NavScreen from './view/NavScreen';
import {configureStore, useDispatch} from './state';
import {withStore} from './lib/withStore';

const store = configureStore();

const App = () => {
  return withStore(<NavScreen />, store);
};

export default App;
