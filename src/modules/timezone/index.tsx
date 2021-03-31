import { timezoneSlice } from './reducer';
import { getDefaultTimezone, getTimezoneSelectionDisabled } from './selectors';
import { ReducerState, Timezone } from './types';
import { fetchTimezones } from './actions';
import { timezoneSaga } from './saga';

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
  ReducerState,
  Timezone,
};
