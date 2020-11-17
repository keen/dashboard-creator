import { createAction } from '@reduxjs/toolkit';

import { Widget, GridPosition, WidgetsPosition } from './types';

import {
  REGISTER_WIDGETS,
  CREATE_WIDGET,
  UPDATE_WIDGETS_POSITION,
} from './constants';

export const registerWidgets = createAction(
  REGISTER_WIDGETS,
  (widgets: Widget[]) => ({
    payload: {
      widgets,
    },
  })
);

export const updateWidgetsPosition = createAction(
  UPDATE_WIDGETS_POSITION,
  (gridPositions: WidgetsPosition) => ({
    payload: {
      gridPositions,
    },
  })
);

export const createWidget = createAction(
  CREATE_WIDGET,
  (
    id: string,
    widgetType: 'visualization' | 'text',
    gridPosition: GridPosition
  ) => ({
    payload: {
      id,
      widgetType,
      gridPosition,
    },
  })
);

export type WidgetsActions =
  | ReturnType<typeof createWidget>
  | ReturnType<typeof registerWidgets>
  | ReturnType<typeof updateWidgetsPosition>;
