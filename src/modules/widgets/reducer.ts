import { WidgetsActions } from './actions';

import { serializeWidget } from './serializers';
import { reduceWidgetsPosition } from './reduceWidgetsPosition';
import { createWidget } from './utils';

import {
  REGISTER_WIDGETS,
  UPDATE_WIDGETS_POSITION,
  CREATE_WIDGET,
} from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  items: {},
};

const widgetsReducer = (
  state: ReducerState = initialState,
  action: WidgetsActions
) => {
  switch (action.type) {
    case CREATE_WIDGET:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: createWidget(action.payload),
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
              [widget.id]: serializeWidget(widget),
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
