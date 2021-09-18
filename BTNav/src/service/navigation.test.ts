import {configureStore} from '../state';
import compass from '../state/compass';
import navigation from '../state/navigation';
import {adjustingCourse} from './navigation';

let mockTime: number;
type MockEvent = {event: string; mockTime: number};
let mockEvents: MockEvent[];
const pause = async (ms: number) => {
  mockTime += ms;
};

jest.mock('./relay', () => ({
  startMotor1: () => async () =>
    mockEvents.push({event: 'startMotor1', mockTime}),
  startMotor2: () => async () =>
    mockEvents.push({event: 'startMotor2', mockTime}),
  stopAllMotors: () => async () =>
    mockEvents.push({event: 'stopAllMotors', mockTime}),
}));

it('adjustingCourse', async () => {
  mockTime = 0;
  mockEvents = [];
  const store = configureStore();
  store.dispatch(
    navigation.actions.enable({isEnabled: true, targetHeading: 130}),
  );

  // Not yet our of course
  pause(2000);
  store.dispatch(compass.actions.heading(127));
  await adjustingCourse(store.dispatch, store.getState, pause);
  expect(mockTime).toEqual(2000);
  expect(mockEvents).toEqual([
    // No adjustment
  ]);

  // Way out of course
  pause(2000);
  store.dispatch(compass.actions.heading(120));
  await adjustingCourse(store.dispatch, store.getState, pause);
  expect(mockTime).toEqual(5000);
  expect(mockEvents).toEqual([
    // some adjustment
    {event: 'startMotor2', mockTime: 4000},
    {event: 'stopAllMotors', mockTime: 5000},
  ]);

  // Closer to target couse
  pause(2000);
  store.dispatch(compass.actions.heading(124));
  await adjustingCourse(store.dispatch, store.getState, pause);
  expect(mockTime).toEqual(8000);
  expect(mockEvents).toEqual([
    {event: 'startMotor2', mockTime: 4000},
    {event: 'stopAllMotors', mockTime: 5000},
    // some further adjustment
    {event: 'startMotor2', mockTime: 7000},
    {event: 'stopAllMotors', mockTime: 8000},
  ]);

  // Almost back on course
  pause(2000);
  store.dispatch(compass.actions.heading(128));
  await adjustingCourse(store.dispatch, store.getState, pause);
  expect(mockTime).toEqual(10000);
  expect(mockEvents).toEqual([
    {event: 'startMotor2', mockTime: 4000},
    {event: 'stopAllMotors', mockTime: 5000},
    {event: 'startMotor2', mockTime: 7000},
    {event: 'stopAllMotors', mockTime: 8000},
    // no further adjustment
  ]);
});
