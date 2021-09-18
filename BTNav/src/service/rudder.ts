import {Dispatch, Saga} from '../state';
import rudder from '../state/rudder';
import {startMotor1, startMotor2, stopAllMotors} from './relay';

export const turningLeft: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Left'));
  await dispatch(startMotor1());
};

export const stopTurning: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Hold'));
  await dispatch(stopAllMotors());
};

export const turningRight: Saga<void> = () => async (dispatch: Dispatch) => {
  dispatch(rudder.actions.motor('Right'));
  await dispatch(startMotor2());
};
