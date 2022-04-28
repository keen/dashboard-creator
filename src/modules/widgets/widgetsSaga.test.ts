/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { all, put, take, call, select } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

import {
  savedQueryUpdated,
  setWidgetState,
  finishChartWidgetConfiguration,
  initializeChartWidget as initializeChartWidgetAction,
  initializeWidget as initializeWidgetAction,
  cloneWidget as cloneWidgetAction,
  saveClonedWidget,
  createNewChart as createNewChartAction,
} from './actions';
import {
  selectQueryForWidget,
  createQueryForWidget,
  reinitializeWidgets,
  initializeWidget,
  cloneWidget,
  createNewChart,
  selectSavedQueryForWidget,
} from './widgetsSaga';

import { getWidget, getWidgetSettings } from './selectors';

import {
  getDashboardSettings,
  saveDashboard,
  removeWidgetFromDashboard,
  updateAccessKeyOptions,
  addWidgetToDashboard,
  getDashboard,
} from '../dashboards';

import { queriesActions, SavedQuery } from '../queries';

import { widget as widgetItem } from './fixtures';
import { findBiggestYPositionOfWidgets } from '../dashboards/utils/findBiggestYPositionOfWidgets';
import { appActions, appSelectors } from '../app';
import { chartEditorActions } from '../chartEditor';
import { UPDATE_DASHBOARD_METADATA } from '../dashboards/constants';
import { scrollItemIntoView } from '../../utils';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';
const chartEditor = {
  querySettings: {
    analysis_type: 'percentile',
    event_collection: 'logins',
    order_by: null,
  } as Query,
  visualization: {
    type: 'area',
    chartSettings: {
      groupMode: 'stacked',
    },
    widgetSettings: {},
  },
};

const savedQuery: SavedQuery = {
  id: '@query/01',
  displayName: 'Query 01',
  visualization: {
    type: 'bar',
    chartSettings: {
      layout: 'vertical',
      barPadding: 0.3,
    },
    widgetSettings: {},
  },
  settings: {
    analysis_type: 'count',
    timeframe: 'this_14_days',
    event_collection: 'purchases',
    order_by: null,
  },
};

jest.mock('uuid', () => {
  return {
    v4: () => '@widget/01',
  };
});

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
      expect(result).toEqual(select(getDashboardSettings, dashboardId));

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
            setWidgetState('@widget/02', {
              isInitialized: false,
              error: null,
              data: null,
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

describe('initializeWidget()', () => {
  const action = initializeWidgetAction(widgetId);

  describe('Scenario 1: User initializes visualization widget', () => {
    const test = sagaHelper(initializeWidget(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        type: 'visualization',
      };
    });

    test('initializes visualization widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });
});

describe('createQueryForWidget()', () => {
  describe('Scenario 1: User close chart widget editor', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.closeEditor();
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('removes widget from dashboard', (result) => {
      expect(result).toEqual(
        put(removeWidgetFromDashboard(dashboardId, widgetId))
      );
    });
  });

  describe('Scenario 2: User close chart widget editor for existing widget', () => {
    const test = sagaHelper(createQueryForWidget(widgetId, true));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.closeEditor();
    });

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });
  });

  describe('Scenario 3: User applies chart widget configuration', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.applyConfiguration();
    });

    test('gets chart editor settings', () => {
      return chartEditor;
    });

    test('finishes chart widget configuration', (result) => {
      const {
        querySettings,
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });

  describe('Scenario 4: User applies chart widget configuration for existing widget', () => {
    const test = sagaHelper(createQueryForWidget(widgetId, true));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.applyConfiguration();
    });

    test('gets chart editor settings', () => {
      return chartEditor;
    });

    test('finishes chart widget configuration', (result) => {
      const {
        querySettings,
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
    });

    test('sets widget state', (result) => {
      expect(result).toEqual(
        put(setWidgetState(widgetId, { isInitialized: false, error: null }))
      );
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });
});

describe('selectQueryForWidget()', () => {
  describe('Scenario 1: User selects existing save query', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits until user select saved query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.selectSavedQuery(savedQuery);
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls selectSavedQueryForWidget', (result) => {
      expect(result).toEqual(
        call(selectSavedQueryForWidget, savedQuery, widgetId)
      );
    });
  });

  describe('Scenario 2: User cancel creation of chart widget', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits until user close query picker', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return appActions.hideQueryPicker();
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('removes widget from dashboard', (result) => {
      expect(result).toEqual(
        put(removeWidgetFromDashboard(dashboardId, widgetId))
      );
    });
  });

  describe('Scenario 3: User creates new query for chart widget', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.createQuery();
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('runs create query flow', (result) => {
      expect(result).toEqual(call(createQueryForWidget, widgetId));
    });
  });
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
        put(saveClonedWidget(`widget/${widgetId}`, widgetSettings, widgetItem))
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

describe('createNewChart()', () => {
  const action = createNewChartAction(widgetId);

  describe('Scenario 1: User creates new chart and close the modal', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user closes modal', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return appActions.hideQueryPicker();
    });

    test('trigger query picker close', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });
  });

  describe('Scenario 2: User creates new query and chooses ad-hoc query', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user selects new query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.createQuery();
    });

    test('triggers query picker hide', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls createQueryForWidget', (result) => {
      expect(result).toEqual(call(createQueryForWidget, widgetId, true));
    });
  });

  describe('Scenario 3: User creates new query and selects saved query', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user selects new query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.selectSavedQuery(savedQuery);
    });

    test('triggers query picker hide', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls selectSavedQueryForWidget', (result) => {
      expect(result).toEqual(
        call(selectSavedQueryForWidget, savedQuery, widgetId, true)
      );
    });
  });
});

describe('selectSavedQueryForWidget()', () => {
  const {
    id: queryId,
    visualization: { type: widgetType, chartSettings, widgetSettings },
  } = savedQuery;

  describe('Scenario 1: User selects saved query for non-existing widget', () => {
    const test = sagaHelper(selectSavedQueryForWidget(savedQuery, widgetId));

    test('finishes widget configuration', (result) => {
      expect(result).toEqual(
        put(
          finishChartWidgetConfiguration(
            widgetId,
            queryId,
            widgetType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('updates access key options if necessary', (result) => {
      expect(result).toEqual(put(updateAccessKeyOptions()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User selects saved query for existing widget', () => {
    const test = sagaHelper(
      selectSavedQueryForWidget(savedQuery, widgetId, true)
    );

    test('finishes widget configuration', (result) => {
      expect(result).toEqual(
        put(
          finishChartWidgetConfiguration(
            widgetId,
            queryId,
            widgetType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('sets widget state', (result) => {
      expect(result).toEqual(
        put(setWidgetState(widgetId, { isInitialized: false, error: null }))
      );
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('updates access key options if necessary', (result) => {
      expect(result).toEqual(put(updateAccessKeyOptions()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });
});
