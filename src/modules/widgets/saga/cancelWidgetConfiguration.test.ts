import sagaHelper from 'redux-saga-testing';
import { put, select } from 'redux-saga/effects';
import { cancelWidgetConfiguration } from './cancelWidgetConfiguration';
import { appSelectors } from '../../app';
import { dashboardsActions } from '../../dashboards';

const widgetId = '@widgetId';
const dashboardId = '@dashboardId';

describe('cancelWidgetConfiguration', () => {
  const test = sagaHelper(cancelWidgetConfiguration(widgetId));

  test('gets active dashboard', (result) => {
    expect(result).toEqual(select(appSelectors.getActiveDashboard));
    return dashboardId;
  });

  test('removes widget from dashboard', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.removeWidgetFromDashboard({ dashboardId, widgetId })
      )
    );
  });
});
