/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { put } from 'redux-saga/effects';

import {
  resetFilterWidgets,
  clearInconsistentFiltersError,
} from '../../widgets/actions';
import { resetDashboardFilters as resetDashboardFiltersAction } from '../actions';
import { queriesActions } from '../../queries';
import { widgetsActions } from '../../widgets';

/**
 * Flow responsible for clearing dashboard filters
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* resetDashboardFilters({
  payload,
}: ReturnType<typeof resetDashboardFiltersAction>) {
  const { dashboardId } = payload;

  yield put(widgetsActions.resetDatePickerWidgets(dashboardId));
  yield put(resetFilterWidgets(dashboardId));
  yield put(clearInconsistentFiltersError(dashboardId));
  yield put(queriesActions.removeInterimQueries());
}
