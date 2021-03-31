import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReducerState, Timezone } from './types';
import { DEFAULT_TIMEZONE } from '../../components/DatePickerWidget/constants';

const initialState: ReducerState = {
  defaultTimezoneForQuery: DEFAULT_TIMEZONE,
  timezoneSelectionDisabled: false,
  timezones: [],
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
    setTimezones: (state, { payload }: PayloadAction<Timezone[]>) => {
      state.timezones = payload;
    },
  },
});
