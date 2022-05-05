import sagaHelper from 'redux-saga-testing';
import { select, put, call, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { prepareDashboard } from './prepareDashboard';
import { editDashboard } from './editDashboard';

import { dashboardsSelectors } from '../selectors';
import { createDashboardSettings } from '../utils';

import { appActions } from '../../app';

import { ROUTES, DASHBOARD_API } from '../../../constants';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

describe('Scenario 1: User succesfully views already serialized dashboard', () => {
  const action = dashboardsActions.editDashboard(dashboardId);
  const test = sagaHelper(editDashboard(action));

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return {
      dashboardId,
      settings: {
        widgets: [],
      },
    };
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.EDITOR)));
  });
});

describe('Scenario 2: User succesfully views dashboard not serialized in state', () => {
  const action = dashboardsActions.editDashboard(dashboardId);
  const test = sagaHelper(editDashboard(action));

  const dashboardModel = {
    version: '@version',
    settings: createDashboardSettings(),
    widgets: [],
  };

  const dashboardApiMock = {
    getDashboardById: jest.fn(),
  };

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return null;
  });

  test('triggers dashboard register', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.registerDashboard(dashboardId))
    );
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to editor', (result) => {
    expect(result).toEqual(put(push(ROUTES.EDITOR)));
  });

  test('gets DashboardAPI instance from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenLastCalledWith(
      dashboardId
    );

    return dashboardModel;
  });

  test('prepares dashboard model', (result) => {
    expect(result).toEqual(call(prepareDashboard, dashboardId, dashboardModel));

    return {
      widgetIds: ['@widget/01', '@widget/02'],
    };
  });

  test('initializes dashboard widgets', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.initializeDashboardWidgets(dashboardId, [
          '@widget/01',
          '@widget/02',
        ])
      )
    );
  });
});
