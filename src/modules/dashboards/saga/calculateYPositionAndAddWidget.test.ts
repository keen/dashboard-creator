import sagaHelper from 'redux-saga-testing';
import { calculateYPositionAndAddWidget } from './calculateYPositionAndAddWidget';
import { all, call, put, select, take } from 'redux-saga/effects';
import { getDashboard } from '../selectors';
import { widgetsActions, widgetsSelectors } from '../../widgets';
import { scrollItemIntoView } from '../../../utils';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

describe('calculateYPositionAndAddWidget()', () => {
  const widgetType = 'text';
  describe('should add widget at the end of the grid', () => {
    const action = dashboardsActions.calculateYPositionAndAddWidget(
      dashboardId,
      widgetType
    );
    const test = sagaHelper(calculateYPositionAndAddWidget(action));

    const dashboardData = {
      settings: {
        widgets: ['@widget/01', '@widget/02', '@widget/03'],
      },
    };
    const dashboardWidgets = [
      {
        widget: {
          position: {
            y: 10,
          },
        },
      },
      {
        widget: {
          position: {
            y: 14,
          },
        },
      },
      {
        widget: {
          position: {
            y: 9,
          },
        },
      },
    ];
    const widgetId = 'widget/@dashboard/01';
    test('should get dashboard data', (result) => {
      expect(result).toEqual(select(getDashboard, dashboardId));
      return dashboardData;
    });

    test('should get widgets data', (result) => {
      expect(result).toEqual(
        all([
          select(widgetsSelectors.getWidget, '@widget/01'),
          select(widgetsSelectors.getWidget, '@widget/02'),
          select(widgetsSelectors.getWidget, '@widget/03'),
        ])
      );
      return dashboardWidgets;
    });

    test('should create widget with appropriate parameters', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.createWidget({
            id: widgetId,
            widgetType,
            gridPosition: {
              x: 0,
              y: 15,
              w: 2,
              h: 2,
              minW: 2,
              minH: 1,
            },
          })
        )
      );
    });

    test('should add widget to the dashboard', (result) => {
      expect(result).toEqual(
        put(dashboardsActions.addWidgetToDashboard({ dashboardId, widgetId }))
      );
    });

    test('waits for dashboard metadata update', (result) => {
      expect(result).toEqual(
        take(dashboardsActions.updateDashboardMetadata.type)
      );
    });

    test('calls scroll item into view', (result) => {
      expect(result).toEqual(call(scrollItemIntoView, widgetId));
    });
  });
});
