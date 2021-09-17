import {createSlice, SliceReducer} from '../lib/redux-slice';

export type MotorDirection = 'Left' | 'Hold' | 'Right';

export type RudderState = Readonly<{
  motorDirection: MotorDirection;
}>;

type RudderReducer<TPayload = void> = SliceReducer<RudderState, TPayload>;

const initialState: RudderState = {
  motorDirection: 'Hold',
};

const motor: RudderReducer<MotorDirection> = (state, motorDirection) => ({
  ...state,
  motorDirection,
});

export default createSlice({
  name: 'rudder',
  initialState,
  reducers: {
    motor,
  },
});
