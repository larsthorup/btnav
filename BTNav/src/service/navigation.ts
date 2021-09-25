import CompassHeading from 'react-native-compass-heading';
import {Dispatch, RootState, Saga} from '../state';
import compass from '../state/compass';
import rudder from '../state/rudder';
import {stopTurning, turningLeft, turningRight} from './rudder';

const degreesBetween = (heading: number, targetHeading: number) => {
  const degrees = targetHeading - heading;
  if (degrees > 180) {
    return degrees - 180;
  } else if (degrees < -180) {
    return degrees + 180;
  } else {
    return degrees;
  }
};

export const adjustingCourse = async (
  dispatch: Dispatch,
  getState: () => RootState,
  pause: (ms: number) => Promise<void>,
) => {
  const state = getState();
  if (state.navigation.isEnabled) {
    const headingDerivation = degreesBetween(
      state.compass.heading,
      state.navigation.targetHeading,
    );
    if (Math.abs(headingDerivation) > 5) {
      console.log('navigating', {headingDerivation});
      if (headingDerivation > 0) {
        dispatch(turningRight());
      } else {
        dispatch(turningLeft());
      }
      await pause(state.navigation.adjustTimeSeconds * 1000);
      dispatch(stopTurning());
    }
  }
};

export const navigating: Saga<void> =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    const pause = async (ms: number) => {
      await new Promise(resolve => setTimeout(resolve, ms));
    };
    const adjustingCourseForever = async () => {
      await adjustingCourse(dispatch, getState, pause);
      const {adjustCourseDelaySeconds} = getState().navigation;
      setTimeout(adjustingCourseForever, adjustCourseDelaySeconds * 1000);
    };
    adjustingCourseForever();
    return new Promise(() => {
      // Note: deliberately do not return
    });
  };
