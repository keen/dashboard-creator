import sagaHelper from 'redux-saga-testing';
import { put, select, take } from 'redux-saga/effects';

import { getDashboardMeta } from '../selectors';
import { finishDashboardEdition } from './finishDashboardEdition';
import { dashboardsActions } from '../index';
const dashboardId = '@dashboard/01';

describe('Scenario 1: User successfully saves dashboard when dashboard title exists', () => {
  const action = dashboardsActions.finishDashboardEdition(dashboardId);
  const test = sagaHelper(finishDashboardEdition(action));

  test('get dashboard metadata', (result) => {
    expect(result).toEqual(select(getDashboardMeta, dashboardId));

    return {
      title: 'Dashboard name',
    };
  });

  test('saves dashboard', (result) => {
    expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
  });

  test('set dashboard view mode', (result) => {
    expect(result).toEqual(put(dashboardsActions.viewDashboard(dashboardId)));
  });
});

describe('Scenario 2: User successfully saves dashboard when dashboard title not exists', () => {
  const action = dashboardsActions.finishDashboardEdition(dashboardId);
  const test = sagaHelper(finishDashboardEdition(action));

  test('get dashboard metadata', (result) => {
    expect(result).toEqual(select(getDashboardMeta, dashboardId));

    return {
      title: null,
    };
  });

  test('shows dashboard settings modal', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.showDashboardSettingsModal(dashboardId))
    );
  });

  test('waits for user action', (result) => {
    expect(result).toEqual(
      take([
        dashboardsActions.hideDashboardSettingsModal.type,
        dashboardsActions.saveDashboardMetadata.type,
      ])
    );
    return dashboardsActions.hideDashboardSettingsModal();
  });

  test('saves dashboard', (result) => {
    expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
  });

  test('set dashboard view mode', (result) => {
    expect(result).toEqual(put(dashboardsActions.viewDashboard(dashboardId)));
  });
});
