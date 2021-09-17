import {Dispatch, Saga} from '../state';
import rudder from '../state/rudder';
import {Relay1Off, Relay1On, Relay2Off, Relay2On, writing} from './relay';

export const turningLeft: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Left'));
  await dispatch(writing(Relay1On));
  await dispatch(writing(Relay2Off));
};

export const stopTurning: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Hold'));
  await dispatch(writing(Relay1Off));
  await dispatch(writing(Relay2Off));
};

export const turningRight: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Right'));
  await dispatch(writing(Relay1Off));
  await dispatch(writing(Relay2On));
};
