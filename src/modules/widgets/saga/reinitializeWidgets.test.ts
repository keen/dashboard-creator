import {
  initializeChartWidget as initializeChartWidgetAction,
  savedQueryUpdated,
} from '../actions';
import sagaHelper from 'redux-saga-testing';
import { all, put, select } from 'redux-saga/effects';
import { appSelectors } from '../../app';
import { getWidgetSettings } from '../selectors';
import { reinitializeWidgets } from './reinitializeWidgets';
import { widgetsActions } from '../index';
import { dashboardsSelectors } from '../../dashboards';

const widgetId = '@widget/01';
const dashboardId = '@dashboard/01';

describe('reinitializeWidgets()', () => {
  const queryName = 'purchases';
  const action = savedQueryUpdated(widgetId, queryName);

  const dashboardSettings = {
    widgets: [widgetId, '@widget/02'],
  };

  describe('Scenario 1: Reinitializes affected widgets', () => {
    const test = sagaHelper(reinitializeWidgets(action));

    test('get active dashboard idenfitier', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return dashboardId;
    });

    test('get dashboard settings', (result) => {
      expect(result).toEqual(
        select(dashboardsSelectors.getDashboardSettings, dashboardId)
      );

      return dashboardSettings;
    });

    test('get settings for all widgets used on dashboard', (result) => {
      expect(result).toEqual(
        all([
          select(getWidgetSettings, widgetId),
          select(getWidgetSettings, '@widget/02'),
        ])
      );

      return [
        { type: 'visualization', id: widgetId, query: queryName },
        { type: 'visualization', id: '@widget/02', query: queryName },
      ];
    });

    test('set widget state for affected widgets', (result) => {
      expect(result).toEqual(
        all([
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: {
                isInitialized: false,
                error: null,
                data: null,
              },
            })
          ),
        ])
      );
    });

    test('reinitializes affected chart widgets', (result) => {
      expect(result).toEqual(
        all([put(initializeChartWidgetAction('@widget/02'))])
      );
    });
  });
});
