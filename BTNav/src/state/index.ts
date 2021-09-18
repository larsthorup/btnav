import * as Redux from 'redux';
import * as ReduxThunk from 'redux-thunk';
import * as ReactRedux from 'react-redux';
import * as ReduxSaga from '../lib/redux-saga';

import compass from './compass';
import navigation from './navigation';
import relay from './relay';
import rudder from './rudder';

export const rootReducer = Redux.combineReducers({
  compass: compass.reducer,
  navigation: navigation.reducer,
  relay: relay.reducer,
  rudder: rudder.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type Selector<T> = (state: RootState) => T;
export type Saga<TArg = void> = ReduxSaga.Saga<RootState, TArg, void>;
export type Dispatch = ReduxThunk.ThunkDispatch<
  RootState,
  unknown,
  Redux.Action<string>
>;
export interface Store extends Redux.Store<RootState> {
  dispatch: Dispatch;
}

// Note: stronger typed hook
export const useSelector = <T>(selector: Selector<T>): T => {
  return ReactRedux.useSelector(selector);
};

// Note: stronger typed hook
export const useDispatch = (): Dispatch => {
  return ReactRedux.useDispatch();
};

export const configureStore = () => {
  const middleware = [ReduxThunk.default];
  const enhancer = Redux.compose(Redux.applyMiddleware(...middleware));
  const store = Redux.createStore(rootReducer, enhancer);
  return store;
};
