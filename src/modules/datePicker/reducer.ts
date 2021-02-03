import { ReducerState } from './types';

import { DatePickerActions } from './actions';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SET_EDITOR_CONNECTIONS,
  UPDATE_CONNECTION,
} from './constants';

export const initialState: ReducerState = {
  isEditorOpen: false,
  widgetConnections: [],
};

const datePickerReducer = (
  state: ReducerState = initialState,
  action: DatePickerActions
) => {
  switch (action.type) {
    case UPDATE_CONNECTION:
      return {
        ...state,
        widgetConnections: state.widgetConnections.map((widgetConnection) => {
          const { widgetId } = widgetConnection;
          if (widgetId === action.payload.widgetId) {
            return {
              ...widgetConnection,
              isConnected: action.payload.isConnected,
            };
          }
          return widgetConnection;
        }),
      };
    case SET_EDITOR_CONNECTIONS:
      return {
        ...state,
        widgetConnections: action.payload.widgetConnections,
      };
    case OPEN_EDITOR:
      return {
        ...state,
        isEditorOpen: true,
      };
    case CLOSE_EDITOR:
      return {
        ...state,
        widgetConnections: [],
        isEditorOpen: false,
      };
    default:
      return state;
  }
};

export default datePickerReducer;
