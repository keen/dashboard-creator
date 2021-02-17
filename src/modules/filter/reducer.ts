import { ReducerState } from './types';
import { FilterActions } from './actions';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SET_EDITOR_CONNECTIONS,
  UPDATE_CONNECTION,
  SET_TARGET_PROPERTY,
  SET_EVENT_STREAM,
} from './constants';

export const initialState: ReducerState = {
  isEditorOpen: false,
  widgetConnections: [],
  eventStream: null,
  targetProperty: null,
};

const filterReducer = (
  state: ReducerState = initialState,
  action: FilterActions
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
    case SET_EVENT_STREAM:
      return {
        ...state,
        eventStream: action.payload.eventStream,
        // todo clear target property
      };
    case SET_TARGET_PROPERTY:
      return {
        ...state,
        targetProperty: action.payload.targetProperty,
      };
    default:
      return state;
  }
};

export default filterReducer;
