import sagaHelper from 'redux-saga-testing';
import { put } from 'redux-saga/effects';

import { resetDashboardFilters } from './resetDashboardFilters';
import { removeInterimQueries } from '../../queries';
import { resetDatePickerWidgets } from '../../widgets';
import { resetDashboardFilters as resetDashboardFiltersAction } from '../actions';
import {
  resetFilterWidgets,
  clearInconsistentFiltersError,
} from '../../widgets/actions';

describe('Scenario: User reset filters applied to the dashboard', () => {
  const dashboardId = '@dashboard/01';
  const action = resetDashboardFiltersAction(dashboardId);
  const test = sagaHelper(resetDashboardFilters(action));

  test('should reset Date Picker widgets', (result) => {
    expect(result).toEqual(put(resetDatePickerWidgets(dashboardId)));
  });

  test('should reset Filter widgets', (result) => {
    expect(result).toEqual(put(resetFilterWidgets(dashboardId)));
  });

  test('should clear Filter error', (result) => {
    expect(result).toEqual(put(clearInconsistentFiltersError(dashboardId)));
  });

  test('should remove interim queries', (result) => {
    expect(result).toEqual(put(removeInterimQueries()));
  });
});
