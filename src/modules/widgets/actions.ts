import { createAction } from '@reduxjs/toolkit';

import { Widget, WidgetsPosition } from './types';

import { REGISTER_WIDGETS, UPDATE_WIDGETS_POSITION } from './constants';

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

export type WidgetsActions =
  | ReturnType<typeof registerWidgets>
  | ReturnType<typeof updateWidgetsPosition>;
