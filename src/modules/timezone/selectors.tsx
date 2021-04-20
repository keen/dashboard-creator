import { RootState } from '../../rootReducer';

export const getDefaultTimezone = (state: RootState) =>
  state.timezone.defaultTimezoneForQuery;

export const getTimezoneSelectionDisabled = (state: RootState) =>
  state.timezone.timezoneSelectionDisabled;

export const getTimezones = (state: RootState) => state.timezone.timezones;

export const getTimezonesLoading = (state: RootState) =>
  state.timezone.isLoading;

export const getTimezoneState = (state: RootState) => state.timezone;
