/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueriesActions } from './actions';

import {
  ADD_INTERIM_QUERY,
  REMOVE_INTERIM_QUERY,
  REMOVE_INTERIM_QUERIES,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  interimQueries: {},
};

const queriesReducer = (
  state: ReducerState = initialState,
  action: QueriesActions
) => {
  switch (action.type) {
    case ADD_INTERIM_QUERY:
      return {
        ...state,
        interimQueries: {
          ...state.interimQueries,
          [action.payload.widgetId]: action.payload.data,
        },
      };
    case REMOVE_INTERIM_QUERY:
      const { [action.payload.widgetId]: removeQuery, ...restQueries } =
        state.interimQueries;
      return {
        ...state,
        interimQueries: {
          ...restQueries,
        },
      };
    case REMOVE_INTERIM_QUERIES:
      return {
        ...state,
        interimQueries: {},
      };
    default:
      return state;
  }
};

export default queriesReducer;
