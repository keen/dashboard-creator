import sagaHelper from 'redux-saga-testing';
import { put, select, take } from 'redux-saga/effects';

import {
  finishDashboardEdition as finishDashboardEditionAction,
  hideDashboardSettingsModal,
  saveDashboard,
  showDashboardSettingsModal,
  viewDashboard,
} from '../actions';

import { getDashboardMeta } from '../selectors';
import { finishDashboardEdition } from './finishDashboardEdition';
import {
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SAVE_DASHBOARD_METADATA,
} from '../constants';

const dashboardId = '@dashboard/01';

describe('Scenario 1: User successfully saves dashboard when dashboard title exists', () => {
  const action = finishDashboardEditionAction(dashboardId);
  const test = sagaHelper(finishDashboardEdition(action));

  test('get dashboard metadata', (result) => {
    expect(result).toEqual(select(getDashboardMeta, dashboardId));

    return {
      title: 'Dashboard name',
    };
  });

  test('saves dashboard', (result) => {
    expect(result).toEqual(put(saveDashboard(dashboardId)));
  });

  test('set dashboard view mode', (result) => {
    expect(result).toEqual(put(viewDashboard(dashboardId)));
  });
});

describe('Scenario 2: User successfully saves dashboard when dashboard title not exists', () => {
  const action = finishDashboardEditionAction(dashboardId);
  const test = sagaHelper(finishDashboardEdition(action));

  test('get dashboard metadata', (result) => {
    expect(result).toEqual(select(getDashboardMeta, dashboardId));

    return {
      title: null,
    };
  });

  test('shows dashboard settings modal', (result) => {
    expect(result).toEqual(put(showDashboardSettingsModal(dashboardId)));
  });

  test('waits for user action', (result) => {
    expect(result).toEqual(
      take([HIDE_DASHBOARD_SETTINGS_MODAL, SAVE_DASHBOARD_METADATA])
    );
    return hideDashboardSettingsModal();
  });

  test('saves dashboard', (result) => {
    expect(result).toEqual(put(saveDashboard(dashboardId)));
  });

  test('set dashboard view mode', (result) => {
    expect(result).toEqual(put(viewDashboard(dashboardId)));
  });
});
