import React from 'react';
import { Provider } from 'react-redux';

export const withStore = (element, store) => {
  console.log('store', store.getState());
  return (
    <Provider store={store}>{element}</Provider>
  );
};
