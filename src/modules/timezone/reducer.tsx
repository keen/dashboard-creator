import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timezone } from '@keen.io/time-utils';

import { ReducerState } from './types';

import { DEFAULT_TIMEZONE } from '../../constants';

const initialState: ReducerState = {
  defaultTimezoneForQuery: DEFAULT_TIMEZONE,
  timezoneSelectionDisabled: false,
  timezones: [],
  isLoading: false,
  error: null,
};

export const timezoneSlice = createSlice({
  name: 'timezone',
  initialState,
  reducers: {
    setDefaultTimezone: (state, { payload }: PayloadAction<string>) => {
      state.defaultTimezoneForQuery = payload;
    },
    setTimezoneSelectionDisabled: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.timezoneSelectionDisabled = payload;
    },
    setError: (state, { payload }: PayloadAction<boolean>) => {
      state.error = payload;
    },
    setTimezonesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setTimezones: (state, { payload }: PayloadAction<Timezone[]>) => {
      state.timezones = payload;
      state.error = false;
      state.isLoading = false;
    },
  },
});
