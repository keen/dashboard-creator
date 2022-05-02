import sagaHelper from 'redux-saga-testing';
import { select, put } from 'redux-saga/effects';

import { prepareDashboard } from './prepareDashboard';
import { updateDashboard } from '../actions';

import { themeSelectors, themeSagaActions, themeActions } from '../../theme';
import { ChartWidget, widgetsActions } from '../../widgets';

import { createDashboardSettings } from '../utils';

const dashboardId = '@dashboard/01';

describe('Scenario 1: Prepares dashboard model', () => {
  const chartWidget: ChartWidget = {
    id: '@widget/01',
    type: 'visualization',
    query: 'purchases',
    position: { x: 0, y: 0, w: 2, h: 3 },
    settings: {
      visualizationType: 'bar',
      chartSettings: {},
      widgetSettings: {},
    },
  };

  const dashboardModel = {
    version: '@version',
    settings: createDashboardSettings(),
    theme: {},
    widgets: [chartWidget],
  };

  function* wrapper() {
    const result = yield* prepareDashboard(dashboardId, dashboardModel);
    return result;
  }

  const test = sagaHelper(wrapper());

  test('get base dashboard theme', (result) => {
    expect(result).toEqual(select(themeSelectors.getBaseTheme));

    return {};
  });

  test('register widgets', (result) => {
    expect(result).toEqual(
      put(widgetsActions.registerWidgets({ widgets: [chartWidget] }))
    );
  });

  test('updates dashboard model', (result) => {
    expect(result).toEqual(
      put(
        updateDashboard(dashboardId, {
          version: '@version',
          widgets: ['@widget/01'],
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
          theme: {},
        })
      )
    );
  });

  test('loads fonts used on dashboard', (result) => {
    expect(result).toEqual(put(themeSagaActions.loadDashboardFonts()));
  });
});
