import { cloneWidget as cloneWidgetAction } from '../actions';
import sagaHelper from 'redux-saga-testing';
import { all, call, put, select, take } from 'redux-saga/effects';
import { getWidget } from '../selectors';
import { widget as widgetItem } from '../fixtures';
import { appSelectors } from '../../app';
import {
  addWidgetToDashboard,
  getDashboard,
  saveDashboard,
} from '../../dashboards';
import { findBiggestYPositionOfWidgets } from '../../dashboards/utils/findBiggestYPositionOfWidgets';
import { UPDATE_DASHBOARD_METADATA } from '../../dashboards/constants';
import { scrollItemIntoView } from '../../../utils';
import { cloneWidget } from './cloneWidget';
import { widgetsActions } from '../index';

const widgetId = '@widget/01';
const dashboardId = '@dashboard/01';

jest.mock('uuid', () => {
  return {
    v4: () => '@widget/01',
  };
});

describe('cloneWidget()', () => {
  const action = cloneWidgetAction(widgetId);
  describe('Scenario 1: User clone dashboard widget', () => {
    const test = sagaHelper(cloneWidget(action));
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
    test('get root widget', (result) => {
      expect(result).toEqual(select(getWidget, widgetId));
      return widgetItem;
    });

    test('select active dashboard id', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));
      return dashboardId;
    });

    test('get active dashboard data', (result) => {
      expect(result).toEqual(select(getDashboard, dashboardId));
      return dashboardData;
    });

    test('should get widgets data', (result) => {
      expect(result).toEqual(
        all([
          select(getWidget, '@widget/01'),
          select(getWidget, '@widget/02'),
          select(getWidget, '@widget/03'),
        ])
      );
      return dashboardWidgets;
    });

    test('trigger saveClonedWidget action', (result) => {
      const widgetSettings = {
        ...widgetItem.widget,
        position: {
          ...widgetItem.widget.position,
          y: findBiggestYPositionOfWidgets(dashboardWidgets) + 1,
        },
      };
      expect(result).toEqual(
        put(
          widgetsActions.saveClonedWidget({
            id: `widget/${widgetId}`,
            widgetSettings,
            widgetItem,
          })
        )
      );
    });

    test('trigger addWidgetToDashboard action', (result) => {
      expect(result).toEqual(
        put(addWidgetToDashboard(dashboardId, `widget/${widgetId}`))
      );
    });

    test('trigger saveDashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });

    test('waits for dashboard metadata update', (result) => {
      expect(result).toEqual(take(UPDATE_DASHBOARD_METADATA));
    });

    test('calls scroll item into view', (result) => {
      expect(result).toEqual(call(scrollItemIntoView, `widget/${widgetId}`));
    });
  });
});
