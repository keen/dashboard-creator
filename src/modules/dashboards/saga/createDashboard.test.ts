import sagaHelper from 'redux-saga-testing';
import { createDashboard } from './createDashboard';
import { Theme } from '@keen.io/charts';
import { put, select } from 'redux-saga/effects';
import { themeActions, themeSelectors } from '../../theme';
import { createDashboardSettings } from '../utils';
import { appActions } from '../../app';
import { push } from 'connected-react-router';
import { ROUTES } from '../../../constants';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

describe('createDashboard()', () => {
  const action = dashboardsActions.createDashboard(dashboardId);
  const test = sagaHelper(createDashboard(action));
  const theme = {} as Theme;

  test('get theme settings', (result) => {
    expect(result).toEqual(select(themeSelectors.getBaseTheme));

    return theme;
  });

  test('registers dashboard', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.registerDashboard(dashboardId))
    );
  });

  test('updates dashboard', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.updateDashboard({
          dashboardId,
          settings: {
            version: '__APP_VERSION__',
            widgets: [],
          },
        })
      )
    );
  });

  test('sets dashboard theme', (result) => {
    expect(result).toEqual(
      put(
        themeActions.setDashboardTheme({
          dashboardId,
          theme,
          settings: createDashboardSettings(),
        })
      )
    );
  });

  test('sets active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('changes app route', (result) => {
    expect(result).toEqual(put(push(ROUTES.EDITOR)));
  });
});
