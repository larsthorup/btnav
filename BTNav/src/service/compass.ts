import CompassHeading from 'react-native-compass-heading';
import {Dispatch, Saga} from '../state';
import compass from '../state/compass';

export const listeningCompass: Saga<void> =
  () => async (dispatch: Dispatch) => {
    const degree_update_rate = 1;

    // accuracy on android will be hardcoded to 1
    // since the value is not available.
    // For iOS, it is in degrees
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      dispatch(compass.actions.heading(heading));
    });
    // return () => {
    //   CompassHeading.stop();
    // };
  };
