/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';
import { Query } from '@keen.io/query';
import { WidgetType } from '../../types';
import { serializeWidget } from './serializers';
import { reduceWidgetsPosition } from './reduceWidgetsPosition';
import { createWidget } from './utils';
import {
  FilterWidget,
  GridPosition,
  ReducerState,
  Widget,
  WidgetItem,
  WidgetsPosition,
} from './types';

export const initialState: ReducerState = {
  items: {},
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    removeWidget: (state, { payload }: PayloadAction<string>) => {
      const {
        items: { [payload]: widget, ...restItems },
      } = state;
      state.items = {
        ...restItems,
      };
    },
    updateChartWidgetDatePickerConnections: (
      state,
      { payload }: PayloadAction<{ id: string; datePickerId: string | null }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            datePickerId: payload.datePickerId,
          },
        },
      } as any;
    },
    updateChartWidgetFiltersConnections: (
      state,
      { payload }: PayloadAction<{ id: string; filterIds: string[] }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            filterIds: payload.filterIds,
          },
        },
      } as any;
    },
    setChartWidgetVisualization: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        visualizationType: string;
        chartSettings: Record<string, any>;
        widgetSettings: Record<string, any>;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            settings: {
              visualizationType: payload.visualizationType,
              chartSettings: payload.chartSettings,
              widgetSettings: payload.widgetSettings,
            },
          },
        },
      } as any;
    },
    finishChartWidgetConfiguration: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        query: string | Query;
        visualizationType: string;
        chartSettings: Record<string, any>;
        widgetSettings: Record<string, any>;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          isConfigured: true,
          widget: {
            ...state.items[payload.id].widget,
            query: payload.query,
            settings: {
              visualizationType: payload.visualizationType,
              chartSettings: payload.chartSettings,
              widgetSettings: payload.widgetSettings,
            },
          },
        },
      } as any;
    },
    setWidgetLoading: (
      state,
      { payload }: PayloadAction<{ id: string; isLoading: boolean }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          isLoading: payload.isLoading,
        },
      };
    },
    setWidgetState: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        widgetState: Partial<Omit<WidgetItem, 'widget'>>;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          ...payload.widgetState,
        },
      };
    },
    createWidget: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        widgetType: WidgetType;
        gridPosition: GridPosition;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: createWidget(payload, false),
      };
    },
    updateWidgetsPosition: (
      state,
      { payload }: PayloadAction<{ gridPositions: WidgetsPosition }>
    ) => {
      state.items = {
        ...state.items,
        ...reduceWidgetsPosition(state.items, payload.gridPositions),
      };
    },
    registerWidgets: (
      state,
      { payload }: PayloadAction<{ widgets: Widget[] }>
    ) => {
      state.items = {
        ...state.items,
        ...payload.widgets.reduce(
          (acc, widget) => ({
            ...acc,
            [widget.id]: serializeWidget(widget, true),
          }),
          {}
        ),
      };
    },
    setTextWidget: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        settings: {
          content: RawDraftContentState;
          textAlignment?: 'left' | 'center' | 'right';
        };
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            settings: {
              ...state.items[payload.id].widget.settings,
              ...payload.settings,
            },
          },
        },
      } as any;
    },
    setDatePickerWidget: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        widgetConnections: string[];
        name: string;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            settings: {
              widgets: payload.widgetConnections,
              name: payload.name,
            },
          },
        },
      } as any;
    },
    setImageWidget: (
      state,
      { payload }: PayloadAction<{ id: string; link: string }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          isConfigured: true,
          widget: {
            ...state.items[payload.id].widget,
            settings: {
              link: payload.link,
            },
          },
        },
      } as any;
    },
    configureFilterWidget: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        widgetConnections: string[];
        eventStream: string;
        targetProperty: string;
        name?: string;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...state.items[payload.id],
          widget: {
            ...state.items[payload.id].widget,
            settings: {
              widgets: payload.widgetConnections,
              eventStream: payload.eventStream,
              targetProperty: payload.targetProperty,
              name: payload.name,
            },
          },
        },
      } as any;
    },
    setFilterPropertyList: (
      state,
      { payload }: PayloadAction<{ filterId: string; propertyList: string[] }>
    ) => {
      state.items = {
        ...state.items,
        [payload.filterId]: {
          ...state.items[payload.filterId],
          data: {
            ...state.items[payload.filterId].data,
            propertyList: payload.propertyList,
          },
        },
      };
    },
    applyFilterWidget: (
      state,
      { payload }: PayloadAction<{ filterId: string; propertyValue: string[] }>
    ) => {
      const filterWidget = state.items[payload.filterId].widget as FilterWidget;

      state.items = {
        ...state.items,
        [payload.filterId]: {
          ...state.items[payload.filterId],
          isActive: true,
          data: {
            ...state.items[payload.filterId].data,
            filter: {
              propertyName: filterWidget.settings.targetProperty,
              operator: 'in',
              propertyValue: payload.propertyValue,
            },
          },
        },
      };
    },
    clearFilterData: (
      state,
      { payload }: PayloadAction<{ filterId: string }>
    ) => {
      state.items = {
        ...state.items,
        [payload.filterId]: {
          ...state.items[payload.filterId],
          data: null,
          isActive: false,
        },
      };
    },
    saveClonedWidget: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        widgetSettings: Widget;
        widgetItem: WidgetItem;
      }>
    ) => {
      state.items = {
        ...state.items,
        [payload.id]: {
          ...payload.widgetItem,
          widget: {
            ...payload.widgetSettings,
            id: payload.id,
            position: {
              ...payload.widgetSettings.position,
            },
          },
        },
      };
    },
    unregisterWidget: (
      state,
      { payload }: PayloadAction<{ widgetId: string }>
    ) => {
      const items = { ...state.items };
      delete items[payload.widgetId];
      state.items = items;
    },
  },
});

export default widgetsSlice;
