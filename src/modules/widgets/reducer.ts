import { WidgetsActions } from './actions';

import { serializeWidget } from './serializers';
import { reduceWidgetsPosition } from './reduceWidgetsPosition';

import { REGISTER_WIDGETS, UPDATE_WIDGETS_POSITION } from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  items: {},
};

const widgetsReducer = (
  state: ReducerState = initialState,
  action: WidgetsActions
) => {
  switch (action.type) {
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
