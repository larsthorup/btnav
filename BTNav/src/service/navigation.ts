import CompassHeading from 'react-native-compass-heading';
import {Dispatch, RootState, Saga} from '../state';
import compass from '../state/compass';
import rudder from '../state/rudder';

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

export const navigating: Saga<void> =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    const adjustCourse = async () => {
      const state = getState();
      if (state.navigation.isEnabled) {
        const headingDerivation = degreesBetween(
          state.compass.heading,
          state.navigation.targetHeading,
        );
        if (Math.abs(headingDerivation) > 5) {
          console.log('navigating', {headingDerivation});
          if (headingDerivation > 0) {
            dispatch(rudder.actions.motor('Right'));
          } else {
            dispatch(rudder.actions.motor('Left'));
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          dispatch(rudder.actions.motor('Hold'));
        }
      }
      setTimeout(adjustCourse, 2000);
    };
    adjustCourse();
    return new Promise(() => {
      // Note: deliberately do not return
    });
  };
