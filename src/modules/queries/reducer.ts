/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReducerState } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: ReducerState = {
  interimQueries: {},
};

const queriesSlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {
    addInterimQuery: (
      state,
      {
        payload,
      }: PayloadAction<{ widgetId: string; data: Record<string, any> }>
    ) => {
      state.interimQueries = {
        ...state.interimQueries,
        [payload.widgetId]: payload.data,
      };
    },
    removeInterimQuery: (state, { payload }: PayloadAction<string>) => {
      const { [payload]: removeQuery, ...restQueries } = state.interimQueries;
      state.interimQueries = { ...restQueries };
    },
    removeInterimQueries: (state) => {
      state.interimQueries = {};
    },
  },
});

export default queriesSlice;
