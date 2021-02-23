/* eslint-disable @typescript-eslint/no-unused-vars */
import { WidgetsActions } from './actions';

import { serializeWidget } from './serializers';
import { reduceWidgetsPosition } from './reduceWidgetsPosition';
import { createWidget } from './utils';

import {
  APPLY_FILTER_WIDGET,
  UNAPPLY_FILTER_WIDGET,
  CONFIGURE_FILTER_WIDGET,
  FINISH_CHART_WIDGET_CONFIGURATION,
  REGISTER_WIDGETS,
  REMOVE_WIDGET,
  SET_DATE_PICKER_WIDGET,
  SET_FILTER_PROPERTY_LIST,
  SET_IMAGE_WIDGET,
  SET_TEXT_WIDGET,
  SET_WIDGET_LOADING,
  SET_WIDGET_STATE,
  UPDATE_CHART_WIDGET_DATE_PICKER_CONNECTION,
  UPDATE_CHART_WIDGET_FILTERS_CONNECTIONS,
  UPDATE_WIDGETS_POSITION,
  CLEAR_FILTER_DATA,
  CREATE_WIDGET,
  SAVE_CLONED_WIDGET,
  UNREGISTER_WIDGET,
} from './constants';

import { FilterWidget, ReducerState } from './types';

import { GRID_MAX_VALUE } from '../../constants';

export const initialState: ReducerState = {
  items: {},
};

const widgetsReducer = (
  state: ReducerState = initialState,
  action: WidgetsActions
) => {
  switch (action.type) {
    case REMOVE_WIDGET:
      const {
        items: { [action.payload.id]: widget, ...restItems },
      } = state;
      return {
        ...state,
        items: restItems,
      };
    case UPDATE_CHART_WIDGET_DATE_PICKER_CONNECTION:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            widget: {
              ...state.items[action.payload.id].widget,
              datePickerId: action.payload.datePickerId,
            },
          },
        },
      };
    case UPDATE_CHART_WIDGET_FILTERS_CONNECTIONS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            widget: {
              ...state.items[action.payload.id].widget,
              filterIds: action.payload.filterIds,
            },
          },
        },
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
    case SET_TEXT_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            widget: {
              ...state.items[action.payload.id].widget,
              settings: {
                ...state.items[action.payload.id].widget.settings,
                ...action.payload.settings,
              },
            },
          },
        },
      };
    case SET_DATE_PICKER_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            widget: {
              ...state.items[action.payload.id].widget,
              settings: {
                widgets: action.payload.widgetConnections,
              },
            },
          },
        },
      };
    case SET_IMAGE_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            isConfigured: true,
            widget: {
              ...state.items[action.payload.id].widget,
              settings: {
                link: action.payload.link,
              },
            },
          },
        },
      };
    case CONFIGURE_FILTER_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            widget: {
              ...state.items[action.payload.id].widget,
              settings: {
                widgets: action.payload.widgetConnections,
                eventStream: action.payload.eventStream,
                targetProperty: action.payload.targetProperty,
              },
            },
          },
        },
      };
    case SET_FILTER_PROPERTY_LIST:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.filterId]: {
            ...state.items[action.payload.filterId],
            data: {
              ...state.items[action.payload.filterId].data,
              propertyList: action.payload.propertyList,
            },
          },
        },
      };
    case APPLY_FILTER_WIDGET:
      const filterWidget = state.items[action.payload.filterId]
        .widget as FilterWidget;
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.filterId]: {
            ...state.items[action.payload.filterId],
            isActive: true,
            data: {
              ...state.items[action.payload.filterId].data,
              filter: {
                propertyName: filterWidget.settings.targetProperty,
                operator: 'in',
                propertyValue: action.payload.propertyValue,
              },
            },
          },
        },
      };
    case CLEAR_FILTER_DATA: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.filterId]: {
            ...state.items[action.payload.filterId],
            data: null,
            isActive: false,
          },
        },
      };
    }
    case SAVE_CLONED_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...action.payload.widgetItem,
            widget: {
              ...action.payload.widgetSettings,
              id: action.payload.id,
              position: {
                ...action.payload.widgetSettings.position,
                y: GRID_MAX_VALUE,
              },
            },
          },
        },
      };
    case UNREGISTER_WIDGET:
      const items = { ...state.items };
      delete items[action.payload.widgetId];
      return {
        ...state,
        items,
      };
    default:
      return state;
  }
};

export default widgetsReducer;
