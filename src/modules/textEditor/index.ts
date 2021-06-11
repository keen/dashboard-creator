import textEditorSlice from './reducer';
import { textEditorSagaActions } from './actions';
import { textEditorSelectors } from './selectors';
import { TextAlignment } from './types';

const textEditorActions = textEditorSlice.actions;
const textEditorReducer = textEditorSlice.reducer;

export {
  textEditorActions,
  textEditorSagaActions,
  textEditorReducer,
  textEditorSelectors,
};

export type { TextAlignment };
