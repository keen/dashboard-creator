import { RootState } from '../../rootReducer';

export const getDefaultTimezone = (state: RootState) =>
  state.timezone.defaultTimezoneForQuery;
export const getTimezoneSelectionDisabled = (state: RootState) =>
  state.timezone.timezoneSelectionDisabled;
