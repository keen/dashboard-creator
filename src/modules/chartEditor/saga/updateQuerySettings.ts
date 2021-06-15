import deepEqual from 'deep-equal';
import { put, select } from 'redux-saga/effects';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';

/**
 * Flow responsible for comparing root query with updated settings.
 *
 * @param query - Updated query structure
 * @return void
 *
 */

export function* updateQuerySettings({
  payload: query,
}: ReturnType<typeof chartEditorActions.setQuerySettings>) {
  const { initialQuerySettings, hasQueryChanged } = yield select(
    chartEditorSelectors.getChartEditor
  );

  if (initialQuerySettings && !hasQueryChanged) {
    const hasQueryChanged = !deepEqual(initialQuerySettings, query, {
      strict: true,
    });

    yield put(chartEditorActions.setQueryChange(hasQueryChanged));
  }
}
