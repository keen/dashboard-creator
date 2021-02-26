import { ReducerState } from './types';
import { FilterActions } from './actions';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  RESET_EDITOR,
  SET_EDITOR_CONNECTIONS,
  SET_EDITOR_DETACHED_CONNECTIONS,
  UPDATE_CONNECTION,
  SET_TARGET_PROPERTY,
  SET_EVENT_STREAM,
  SET_EVENT_STREAM_SCHEMA,
  SET_EVENT_STREAMS_POOL,
  SET_SCHEMA_PROCESSING,
  SET_SCHEMA_PROCESSING_ERROR,
} from './constants';

export const initialState: ReducerState = {
  isEditorOpen: false,
  schemaProcessing: {
    error: false,
    inProgress: false,
  },
  widgetConnections: [],
  detachedWidgetConnections: [],
  eventStreamsPool: [],
  eventStream: null,
  eventStreamSchema: {
    schema: {},
    tree: {},
    list: [],
  },
  targetProperty: null,
};

const filterReducer = (
  state: ReducerState = initialState,
  action: FilterActions
) => {
  switch (action.type) {
    case RESET_EDITOR:
      return initialState;
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
    case SET_EDITOR_DETACHED_CONNECTIONS:
      return {
        ...state,
        detachedWidgetConnections: action.payload.detachedWidgetConnections,
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
      };
    case SET_TARGET_PROPERTY:
      return {
        ...state,
        targetProperty: action.payload.targetProperty,
      };
    case SET_EVENT_STREAM_SCHEMA:
      return {
        ...state,
        eventStreamSchema: {
          schema: action.payload.schema,
          tree: action.payload.schemaTree,
          list: action.payload.schemaList,
        },
      };
    case SET_EVENT_STREAMS_POOL:
      return {
        ...state,
        eventStreamsPool: action.payload.eventStreams,
      };
    case SET_SCHEMA_PROCESSING_ERROR:
      return {
        ...state,
        schemaProcessing: {
          ...state.schemaProcessing,
          error: action.payload.processingError,
        },
      };
    case SET_SCHEMA_PROCESSING:
      return {
        ...state,
        schemaProcessing: {
          ...state.schemaProcessing,
          inProgress: action.payload.isProcessingSchema,
        },
      };
    default:
      return state;
  }
};

export default filterReducer;
