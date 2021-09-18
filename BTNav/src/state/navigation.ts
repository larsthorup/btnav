import {createSlice, SliceReducer} from '../lib/redux-slice';

export type NavigationState = Readonly<{
  isEnabled: boolean;
  targetHeading: number;
}>;

type NavigationReducer<TPayload = void> = SliceReducer<
  NavigationState,
  TPayload
>;

const initialState: NavigationState = {
  isEnabled: false,
  targetHeading: 0,
};

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
    enable,
  },
});
