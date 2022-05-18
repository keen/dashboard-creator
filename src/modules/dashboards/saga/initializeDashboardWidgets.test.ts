import sagaHelper from 'redux-saga-testing';
import { all, put } from 'redux-saga/effects';
import { dashboardsActions } from '../index';
import { initializeDashboardWidgets } from './initializeDashboardWidgets';
import { widgetsActions } from '../../widgets';

const widgetsId = ['@widgetId_1', '@widgetId_2'];
const dashboardId = '@dashboard';

describe('initializeDashboardWidgets', () => {
  const action = dashboardsActions.initializeDashboardWidgets(
    dashboardId,
    widgetsId
  );
  const test = sagaHelper(initializeDashboardWidgets(action));

  test('initializes dashboards widgets', (result) => {
    const a = all([
      put(widgetsActions.initializeWidget('@widgetId_1')),
      put(widgetsActions.initializeWidget('@widgetId_2')),
    ]);
    expect(result).toEqual(a);
  });
});
