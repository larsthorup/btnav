import {createSlice, SliceReducer} from '../lib/redux-slice';

export type CompassState = Readonly<{
  heading: number;
}>;

type CompassReducer<TPayload = void> = SliceReducer<CompassState, TPayload>;

const initialState: CompassState = {
  heading: 0,
};

const heading: CompassReducer<number> = (state, heading) => ({
  ...state,
  heading,
});

export default createSlice({
  name: 'compass',
  initialState,
  reducers: {
    heading,
  },
});
