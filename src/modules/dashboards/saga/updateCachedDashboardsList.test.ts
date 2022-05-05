import sagaHelper from 'redux-saga-testing';
import { updateCachedDashboardsList } from './updateCachedDashboardsList';
import { all, put, select } from 'redux-saga/effects';
import { getCachedDashboardIds, getDashboard } from '../selectors';
import { appSelectors } from '../../app';
import { widgetsActions } from '../../widgets';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

jest.mock('uuid', () => {
  return {
    v4: () => dashboardId,
  };
});

describe('updateCachedDashboardsList()', () => {
  const action = dashboardsActions.viewDashboard(dashboardId);

  describe('Scenario 1: Should add dashboard id to cached dashboards if total cached dashboards number is less than maximal cached dashboards number', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return [];
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should update state with the array containing the id of visited dashboard', (result) => {
      expect(result).toEqual(
        put(dashboardsActions.updateCachedDashboardIds([dashboardId]))
      );
    });
  });

  describe('Scenario 2: Should move dashboard id position to the end of cached dashboards array if dashboard id already exists inside it', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    const cachedDashboardIds = [
      '@dashboard/01',
      '@dashboard/03',
      '@dashboard/04',
    ];
    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return cachedDashboardIds;
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should update state with array containing recent dashboard id at the end', (result) => {
      expect(result).toEqual(
        put(
          dashboardsActions.updateCachedDashboardIds([
            '@dashboard/03',
            '@dashboard/04',
            '@dashboard/01',
          ])
        )
      );
    });
  });

  describe('Scenario 3: Should remove the oldest dashboard id from cache and its related widgets', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    const cachedDashboardIds = [
      '@dashboard/02',
      '@dashboard/03',
      '@dashboard/04',
    ];

    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return cachedDashboardIds;
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should get dashboard to remove', (result) => {
      expect(result).toEqual(select(getDashboard, cachedDashboardIds[0]));
      return {
        settings: {
          widgets: ['@widget/01', '@widget/02', '@widget/03'],
        },
      };
    });
    test('should remove dashboard widgets from cache', (result) => {
      expect(result).toEqual(
        all([
          put(widgetsActions.unregisterWidget({ widgetId: '@widget/01' })),
          put(widgetsActions.unregisterWidget({ widgetId: '@widget/02' })),
          put(widgetsActions.unregisterWidget({ widgetId: '@widget/03' })),
        ])
      );
    });
    test('should remove dashboard from cache', (result) => {
      expect(result).toEqual(
        put(dashboardsActions.unregisterDashboard(cachedDashboardIds[0]))
      );
    });
    test('should update cached dashboard ids with the array which not contains removed element', (result) => {
      expect(result).toEqual(
        put(
          dashboardsActions.updateCachedDashboardIds([
            '@dashboard/03',
            '@dashboard/04',
            '@dashboard/01',
          ])
        )
      );
    });
  });
});
