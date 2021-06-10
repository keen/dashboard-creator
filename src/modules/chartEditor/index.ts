import { EditorSection } from './types';
import { chartEditorSaga } from './saga';

import { chartEditorSelectors } from './selectors';
import chartEditorSlice, {
  initialState as chartEditorInitialState,
} from './reducer';
const chartEditorReducer = chartEditorSlice.reducer;

import {
  applyConfiguration,
  editorMounted,
  editorUnmounted,
  restoreSavedQuery,
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
  restoreSavedQuery,
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
