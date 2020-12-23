/* eslint-disable @typescript-eslint/no-unused-vars */
import { WidgetsActions } from './actions';

import { serializeWidget } from './serializers';
import { reduceWidgetsPosition } from './reduceWidgetsPosition';
import { createWidget } from './utils';

import {
  REGISTER_WIDGETS,
  REMOVE_WIDGET,
  UPDATE_WIDGETS_POSITION,
  FINISH_CHART_WIDGET_CONFIGURATION,
  SET_WIDGET_LOADING,
  SET_WIDGET_STATE,
  CREATE_WIDGET,
  CHART_WIDGET_EDITOR_RUN_QUERY,
  CHART_WIDGET_EDITOR_SET_QUERY_SETTINGS,
  CHART_WIDGET_EDITOR_RUN_QUERY_SUCCESS,
  CHART_WIDGET_EDITOR_RUN_QUERY_ERROR,
  RESET_CHART_WIDGET_EDITOR,
  OPEN_CHART_WIDGET_EDITOR,
  CLOSE_CHART_WIDGET_EDITOR,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  items: {},
  chartWidgetEditor: {
    isOpen: false,
    isQueryPerforming: false,
    querySettings: {},
    visualization: {
      type: null,
      chartSettings: {},
      widgetSettings: {},
    },
    analysisResult: null,
  },
};

const widgetsReducer = (
  state: ReducerState = initialState,
  action: WidgetsActions
) => {
  switch (action.type) {
    case RESET_CHART_WIDGET_EDITOR:
      return {
        ...state,
        chartWidgetEditor: initialState.chartWidgetEditor,
      };
    case CHART_WIDGET_EDITOR_RUN_QUERY_ERROR:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          isQueryPerforming: false,
        },
      };
    case CHART_WIDGET_EDITOR_RUN_QUERY_SUCCESS:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          isQueryPerforming: false,
          analysisResult: action.payload.results,
        },
      };
    case CHART_WIDGET_EDITOR_RUN_QUERY:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          isQueryPerforming: true,
        },
      };
    case CHART_WIDGET_EDITOR_SET_QUERY_SETTINGS:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          querySettings: action.payload.query,
        },
      };
    case OPEN_CHART_WIDGET_EDITOR:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          isOpen: true,
        },
      };
    case CLOSE_CHART_WIDGET_EDITOR:
      return {
        ...state,
        chartWidgetEditor: {
          ...state.chartWidgetEditor,
          isOpen: false,
        },
      };
    case REMOVE_WIDGET:
      const {
        items: { [action.payload.id]: widget, ...restItems },
      } = state;
      return {
        ...state,
        items: restItems,
      };
    case FINISH_CHART_WIDGET_CONFIGURATION:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            isConfigured: true,
            widget: {
              ...state.items[action.payload.id].widget,
              query: action.payload.query,
              settings: {
                visualizationType: action.payload.visualizationType,
                chartSettings: action.payload.chartSettings,
                widgetSettings: action.payload.widgetSettings,
              },
            },
          },
        },
      };
    case SET_WIDGET_LOADING: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            isLoading: action.payload.isLoading,
          },
        },
      };
    }
    case SET_WIDGET_STATE: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            ...action.payload.widgetState,
          },
        },
      };
    }
    case CREATE_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: createWidget(action.payload, false),
        },
      };
    case UPDATE_WIDGETS_POSITION:
      return {
        ...state,
        items: {
          ...state.items,
          ...reduceWidgetsPosition(state.items, action.payload.gridPositions),
        },
      };
    case REGISTER_WIDGETS:
      return {
        ...state,
        items: {
          ...state.items,
          ...action.payload.widgets.reduce(
            (acc, widget) => ({
              ...acc,
              [widget.id]: serializeWidget(widget, true),
            }),
            {}
          ),
        },
      };
    default:
      return state;
  }
};

export default widgetsReducer;
