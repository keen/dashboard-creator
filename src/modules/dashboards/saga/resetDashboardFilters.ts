/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { put } from 'redux-saga/effects';

import { removeInterimQueries } from '../../queries';
import { resetDatePickerWidgets } from '../../widgets';
import {
  resetFilterWidgets,
  clearInconsistentFiltersError,
} from '../../widgets/actions';
import { resetDashboardFilters as resetDashboardFiltersAction } from '../actions';

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

  yield put(resetDatePickerWidgets(dashboardId));
  yield put(resetFilterWidgets(dashboardId));
  yield put(clearInconsistentFiltersError(dashboardId));
  yield put(removeInterimQueries());
}
