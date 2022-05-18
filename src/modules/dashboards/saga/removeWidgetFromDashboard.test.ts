import sagaHelper from 'redux-saga-testing';
import { removeWidgetFromDashboard } from './removeWidgetFromDashboard';
import { all, call, put, select } from 'redux-saga/effects';
import { widgetsActions, widgetsSelectors } from '../../widgets';
import { updateAccessKeyOptions } from './updateAccessKeyOptions';
import { removeConnectionFromFilter } from '../../widgets/saga/filterWidget';
import { dashboardsActions } from '../index';

const widgetId = '@widget/01';
const dashboardId = '@dashboard/01';

describe('removeWidgetFromDashboard()', () => {
  const action = dashboardsActions.removeWidgetFromDashboard({
    dashboardId,
    widgetId,
  });
  const filterIds = ['@filter/01', '@filter/02'];

  describe('Scenario 1: User removes visualization widget from dashboard', () => {
    const test = sagaHelper(removeWidgetFromDashboard(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(
        select(widgetsSelectors.getWidgetSettings, widgetId)
      );

      return {
        query: 'purchases',
        type: 'visualization',
        filterIds,
      };
    });

    test('update access key options', (result) => {
      expect(result).toEqual(call(updateAccessKeyOptions));
    });

    test('removes connections from filter', (result) => {
      expect(result).toEqual(
        all([
          call(removeConnectionFromFilter, '@filter/01', widgetId),
          call(removeConnectionFromFilter, '@filter/02', widgetId),
        ])
      );
    });

    test('triggers remove widget', (result) => {
      expect(result).toEqual(put(widgetsActions.removeWidget(widgetId)));
    });
  });

  describe('Scenario 2: User removes image widget from dashboard', () => {
    const test = sagaHelper(removeWidgetFromDashboard(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(
        select(widgetsSelectors.getWidgetSettings, widgetId)
      );

      return {
        type: 'image',
      };
    });

    test('triggers remove widget', (result) => {
      expect(result).toEqual(put(widgetsActions.removeWidget(widgetId)));
    });
  });
});
