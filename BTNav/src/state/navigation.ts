import {createSlice, SliceReducer} from '../lib/redux-slice';

export type NavigationState = Readonly<{
  adjustCourseDelaySeconds: number;
  adjustTimeSeconds: number;
  isEnabled: boolean;
  targetHeading: number;
}>;

type NavigationReducer<TPayload = void> = SliceReducer<
  NavigationState,
  TPayload
>;

const initialState: NavigationState = {
  adjustCourseDelaySeconds: 5,
  adjustTimeSeconds: 1,
  isEnabled: false,
  targetHeading: 0,
};

const adjustCourseDelaySeconds: NavigationReducer<number> = (
  state,
  adjustCourseDelaySeconds,
) => ({
  ...state,
  adjustCourseDelaySeconds,
});

const adjustTimeSeconds: NavigationReducer<number> = (
  state,
  adjustTimeSeconds,
) => ({
  ...state,
  adjustTimeSeconds,
});

const enable: NavigationReducer<{isEnabled: boolean; targetHeading: number}> = (
  state,
  {isEnabled, targetHeading},
) => ({
  ...state,
  isEnabled,
  targetHeading,
});

export default createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    adjustCourseDelaySeconds,
    adjustTimeSeconds,
    enable,
  },
});
