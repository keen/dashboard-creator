import { Timezone } from '@keen.io/time-utils';

export type ReducerState = {
  defaultTimezoneForQuery?: string;
  timezoneSelectionDisabled?: boolean;
  isLoading: boolean;
  error: boolean;
  timezones: Timezone[];
};
