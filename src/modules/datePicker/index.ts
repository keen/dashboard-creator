import { datePickerSaga } from './saga';
import { datePickerSelectors } from './selectors';
import { DatePickerConnection, ReducerState } from './types';
import datePickerSlice from './reducer';
import { applySettings } from './actions';

const datePickerActions = {
  ...datePickerSlice.actions,
  applySettings,
};
const datePickerReducer = datePickerSlice.reducer;

export {
  datePickerReducer,
  datePickerActions,
  datePickerSaga,
  datePickerSelectors,
};

export type { ReducerState, DatePickerConnection };
