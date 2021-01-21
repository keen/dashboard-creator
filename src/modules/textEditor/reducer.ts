/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextEditorActions } from './actions';
import { OPEN_EDITOR, CLOSE_EDITOR, SET_EDITOR_CONTENT } from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  isOpen: false,
  content: {
    blocks: [],
    entityMap: {},
  },
};

const textEditorReducer = (
  state: ReducerState = initialState,
  action: TextEditorActions
) => {
  switch (action.type) {
    case SET_EDITOR_CONTENT:
      return {
        ...state,
        content: action.payload.content,
      };
    case OPEN_EDITOR:
      return {
        ...state,
        isOpen: true,
      };
    case CLOSE_EDITOR:
      return {
        ...state,
        content: initialState.content,
        isOpen: false,
      };
    default:
      return state;
  }
};

export default textEditorReducer;
