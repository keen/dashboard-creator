import sagaHelper from 'redux-saga-testing';
import { select, put, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { StatusCodes } from 'http-status-codes';

import { viewDashboard } from './viewDashboard';

import {
  viewDashboard as viewDashboardAction,
  updateDashboard,
  setDashboardError,
  initializeDashboardWidgets,
  registerDashboard,
} from '../actions';
import { dashboardsSelectors } from '../selectors';
import { createDashboardSettings } from '../utils';

import { appActions } from '../../app';
import { registerWidgets } from '../../widgets';
import { themeActions, themeSagaActions } from '../../theme';

import { APIError } from '../../../api';

import { DashboardError } from '../types';

import { ROUTES, BLOB_API } from '../../../constants';

const dashboardId = '@dashboard/01';

describe('Scenario 1: User succesfully views already serialized dashboard', () => {
  const action = viewDashboardAction(dashboardId);
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
  const action = viewDashboardAction(dashboardId);
  const test = sagaHelper(viewDashboard(action));

  const blobApiMock = {
    getDashboardById: jest.fn(),
  };

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return null;
  });

  test('triggers dashboard register', (result) => {
    expect(result).toEqual(put(registerDashboard(dashboardId)));
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });

  test('gets BlobAPI instance from context', (result) => {
    expect(result).toEqual(getContext(BLOB_API));

    return blobApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(blobApiMock.getDashboardById).toHaveBeenLastCalledWith(dashboardId);

    return {
      version: '@version',
      settings: createDashboardSettings(),
      widgets: [],
    };
  });

  test('register widgets', (result) => {
    expect(result).toEqual(put(registerWidgets([])));
  });

  test('updates dashboard model', (result) => {
    expect(result).toEqual(
      put(
        updateDashboard(dashboardId, {
          version: '@version',
          widgets: [],
        })
      )
    );
  });

  test('set dashboard theme', (result) => {
    expect(result).toEqual(
      put(
        themeActions.setDashboardTheme({
          dashboardId,
          settings: createDashboardSettings(),
          theme: undefined,
        })
      )
    );
  });

  test('loads fonts used on dashboard', (result) => {
    expect(result).toEqual(put(themeSagaActions.loadDashboardFonts()));
  });

  test('initializes dashboard widgets', (result) => {
    expect(result).toEqual(put(initializeDashboardWidgets(dashboardId, [])));
  });
});

describe('Scenario 3: User views dashboard that do not exist', () => {
  const action = viewDashboardAction(dashboardId);
  const test = sagaHelper(viewDashboard(action));

  const blobApiMock = {
    getDashboardById: jest.fn(),
  };

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return null;
  });

  test('triggers dashboard register', (result) => {
    expect(result).toEqual(put(registerDashboard(dashboardId)));
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });

  test('gets BlobAPI instance from context', (result) => {
    expect(result).toEqual(getContext(BLOB_API));

    return blobApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(blobApiMock.getDashboardById).toHaveBeenLastCalledWith(dashboardId);

    return new APIError('@message', StatusCodes.NOT_FOUND);
  });

  test('set "NOT_EXIST" error for dashboard', (result) => {
    expect(result).toEqual(
      put(setDashboardError(dashboardId, DashboardError.NOT_EXIST))
    );
  });
});

describe('Scenario 4: User views dashboard and internal server error occured during fetch', () => {
  const action = viewDashboardAction(dashboardId);
  const test = sagaHelper(viewDashboard(action));

  const blobApiMock = {
    getDashboardById: jest.fn(),
  };

  test('get dashboard from state', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboard, dashboardId)
    );

    return null;
  });

  test('triggers dashboard register', (result) => {
    expect(result).toEqual(put(registerDashboard(dashboardId)));
  });

  test('set current active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes application route to viewer', (result) => {
    expect(result).toEqual(put(push(ROUTES.VIEWER)));
  });

  test('gets BlobAPI instance from context', (result) => {
    expect(result).toEqual(getContext(BLOB_API));

    return blobApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(blobApiMock.getDashboardById).toHaveBeenLastCalledWith(dashboardId);

    return new APIError('@message', StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('set "NOT_EXIST" error for dashboard', (result) => {
    expect(result).toEqual(
      put(setDashboardError(dashboardId, DashboardError.SERVER_ERROR))
    );
  });
});
