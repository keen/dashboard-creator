import { timezoneSlice } from './reducer';
import {
  getDefaultTimezone,
  getTimezoneSelectionDisabled,
  getTimezones,
  getTimezoneState,
} from './selectors';
import { ReducerState } from './types';
import { fetchTimezones } from './actions';
import { timezoneSaga } from './timezoneSaga';
import { getPresentationTimezone } from './utils';

const timezoneReducer = timezoneSlice.reducer;
const timezoneActions = {
  fetchTimezones,
  ...timezoneSlice.actions,
};

export {
  timezoneReducer,
  timezoneActions,
  timezoneSaga,
  getDefaultTimezone,
  getTimezoneSelectionDisabled,
  getTimezones,
  getPresentationTimezone,
  getTimezoneState,
  ReducerState,
};
