import sagaHelper from 'redux-saga-testing';
import { put, select } from 'redux-saga/effects';

import { previewDashboardTheme } from './previewDashboardTheme';

import { themeSelectors } from '../selectors';
import themeSlice from '../reducer';

import { appSelectors } from '../../app';
import { createDashboardSettings } from '../../dashboards/utils';

describe('Scenario 1: User successfuly updates dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const test = sagaHelper(previewDashboardTheme());

  const themeSettings = {
    theme: {
      colors: ['navyblue'],
    },
    settings: createDashboardSettings(),
  };

  test('get active dashboard identifier from state', (result) => {
    expect(result).toEqual(select(appSelectors.getActiveDashboard));

    return dashboardId;
  });

  test('get current dashboard theme settings', (result) => {
    expect(result).toEqual(select(themeSelectors.getCurrentEditTheme));

    return themeSettings;
  });

  test('set dashboard theme', (result) => {
    const { settings, theme } = themeSettings;

    expect(result).toEqual(
      put(
        themeSlice.actions.setDashboardTheme({
          dashboardId,
          theme,
          settings: settings,
        })
      )
    );
  });
});
