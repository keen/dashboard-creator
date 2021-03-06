import { EditorSection } from './types';
import { chartEditorSaga } from './chartEditorSaga';

import { chartEditorSelectors } from './selectors';
import chartEditorSlice, {
  initialState as chartEditorInitialState,
} from './reducer';
const chartEditorReducer = chartEditorSlice.reducer;

import {
  applyConfiguration,
  editorMounted,
  editorUnmounted,
  showQueryUpdateConfirmation,
  hideQueryUpdateConfirmation,
  backToChartEditor,
  confirmSaveQueryUpdate,
  useQueryForWidget,
  queryUpdateConfirmationMounted,
} from './actions';

const chartEditorActions = {
  editorMounted,
  editorUnmounted,
  applyConfiguration,
  showQueryUpdateConfirmation,
  hideQueryUpdateConfirmation,
  backToChartEditor,
  confirmSaveQueryUpdate,
  useQueryForWidget,
  queryUpdateConfirmationMounted,
  ...chartEditorSlice.actions,
};

export {
  chartEditorActions,
  chartEditorReducer,
  chartEditorSelectors,
  chartEditorInitialState,
  chartEditorSaga,
  EditorSection,
};
