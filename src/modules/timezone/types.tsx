export type ReducerState = {
  defaultTimezoneForQuery?: string;
  timezoneSelectionDisabled?: boolean;
  timezones: Timezone[];
};

// todo import this from @keen monorepo when ready
export type Timezone = {
  name: string;
  utcOffset: string;
};
