import { takeLatest } from 'redux-saga/effects';

import { chartEditorActions } from './index';
import {
  openEditor,
  runQuery,
  showUpdateConfirmation,
  updateEditorSection,
  updateVisualizationType,
} from './saga';
import { updateQuerySettings } from './saga/updateQuerySettings';

export function* chartEditorSaga() {
  yield takeLatest(
    chartEditorActions.setEditorSection.type,
    updateEditorSection
  );
  yield takeLatest(chartEditorActions.runQuery.type, runQuery);
  yield takeLatest(chartEditorActions.openEditor.type, openEditor);
  yield takeLatest(
    chartEditorActions.showQueryUpdateConfirmation.type,
    showUpdateConfirmation
  );
  yield takeLatest(
    chartEditorActions.setQuerySettings.type,
    updateQuerySettings
  );
  yield takeLatest(
    chartEditorActions.setVisualizationSettings.type,
    updateVisualizationType
  );
}
