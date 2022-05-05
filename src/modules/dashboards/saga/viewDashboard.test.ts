import sagaHelper from 'redux-saga-testing';
import { select, put, call, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { StatusCodes } from 'http-status-codes';

import { viewDashboard } from './viewDashboard';
import { prepareDashboard } from './prepareDashboard';

import { dashboardsSelectors } from '../selectors';
import { createDashboardSettings } from '../utils';

import { appActions } from '../../app';

import { APIError } from '../../../api';
import { DashboardError } from '../types';

import { ROUTES, DASHBOARD_API } from '../../../constants';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

describe('Scenario 1: User succesfully views already serialized dashboard', () => {
  const action = dashboardsActions.viewDashboard(dashboardId);
  const test = sagaHelper(viewDashboard(action));

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return {
      dashboardId,
    };
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });
});

describe('Scenario 2: User succesfully views dashboard not serialized in state', () => {
  const action = dashboardsActions.viewDashboard(dashboardId);
  const test = sagaHelper(viewDashboard(action));

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

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
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

describe('Scenario 3: User views dashboard that do not exist', () => {
  const action = dashboardsActions.viewDashboard(dashboardId);
  const test = sagaHelper(viewDashboard(action));

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

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });

  test('gets DashboardAPI instance from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenLastCalledWith(
      dashboardId
    );

    return new APIError('@message', StatusCodes.NOT_FOUND);
  });

  test('set "NOT_EXIST" error for dashboard', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.setDashboardError({
          dashboardId,
          error: DashboardError.NOT_EXIST,
        })
      )
    );
  });
});

describe('Scenario 4: User views dashboard and internal server error occured during fetch', () => {
  const action = dashboardsActions.viewDashboard(dashboardId);
  const test = sagaHelper(viewDashboard(action));

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

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });

  test('gets DashboardAPI instance from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenLastCalledWith(
      dashboardId
    );

    return new APIError('@message', StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('set "NOT_EXIST" error for dashboard', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.setDashboardError({
          dashboardId,
          error: DashboardError.SERVER_ERROR,
        })
      )
    );
  });
});
