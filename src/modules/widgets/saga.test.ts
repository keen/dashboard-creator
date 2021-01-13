/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { all, put, take, call, getContext, select } from 'redux-saga/effects';
import { Query } from '@keen.io/query';
import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { SET_QUERY_EVENT } from '@keen.io/query-creator';

import {
  savedQueryUpdated,
  setWidgetState,
  finishChartWidgetConfiguration,
  initializeChartWidget as initializeChartWidgetAction,
  initializeWidget as initializeWidgetAction,
  editChartWidget as editChartWidgetAction,
  setWidgetLoading,
} from './actions';
import {
  selectQueryForWidget,
  createQueryForWidget,
  editChartWidget,
  editChartSavedQuery,
  reinitializeWidgets,
  initializeChartWidget,
  initializeWidget,
} from './saga';

import { getWidgetSettings } from './selectors';

import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  HIDE_QUERY_PICKER,
} from '../app';
import {
  getDashboardSettings,
  saveDashboard,
  removeWidgetFromDashboard,
} from '../dashboards';
import {
  selectSavedQuery,
  createQuery,
  SELECT_SAVED_QUERY,
  CREATE_QUERY,
  SavedQuery,
} from '../queries';

import {
  openEditor,
  closeEditor,
  resetEditor,
  applyConfiguration,
  setVisualizationSettings,
  setQueryType,
  setQuerySettings,
  setEditMode,
  setQueryResult,
  getChartEditor,
  showQueryUpdateConfirmation,
  EDITOR_MOUNTED,
  EDITOR_UNMOUNTED,
  CLOSE_EDITOR,
  APPLY_CONFIGURATION,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  USE_QUERY_FOR_WIDGET,
} from '../chartEditor';

import { KEEN_ANALYSIS, I18N } from '../../constants';

import { widget as widgetItem } from './fixtures';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('reinitializeWidgets()', () => {
  const queryName = 'purchases';
  const action = savedQueryUpdated(widgetId, queryName);

  const dashboardSettings = {
    widgets: [widgetId, '@widget/02'],
  };

  describe('Scenario 1: Reinitializes affected widgets', () => {
    const test = sagaHelper(reinitializeWidgets(action));

    test('get active dashboard idenfitier', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

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

describe('initializeChartWidget()', () => {
  const action = initializeChartWidgetAction(widgetId);

  describe('Scenario 1: Query detached from visualization', () => {
    const test = sagaHelper(initializeChartWidget(action));
    const i18n = {
      t: jest.fn().mockImplementation((key) => key),
    };

    const keenAnalysis = {
      query: jest.fn(),
    };

    const analysisResult = {
      result: 10,
      query: {
        analysis_type: 'count',
        event_collection: 'purchases',
        order_by: null,
      } as Query,
    };

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
        settings: {
          visualizationType: 'line',
        },
      };
    });

    test('get Keen client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('set widget in loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith({
        savedQueryName: 'purchases',
      });

      return analysisResult;
    });

    test('get i18n from context', (result) => {
      expect(result).toEqual(getContext(I18N));

      return i18n;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
            error: {
              title: 'widget_errors.detached_query_title',
              message: 'widget_errors.detached_query_message',
            },
            data: analysisResult,
          })
        )
      );
    });

    test('set widget in loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, false)));
    });
  });

  describe('Scenario 2: Successful initializes chart widget', () => {
    const test = sagaHelper(initializeChartWidget(action));
    const keenAnalysis = {
      query: jest.fn(),
    };

    const query: Query = {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    };

    const analysisResult = {
      result: 10,
      query,
    };

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query,
        settings: {
          visualizationType: 'metric',
        },
      };
    });

    test('get Keen client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('set widget in loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(query);

      return analysisResult;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
            data: analysisResult,
          })
        )
      );
    });

    test('set widget in loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, false)));
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

describe('editChartSavedQuery()', () => {
  const chartEditor = {
    isSavedQuery: false,
    hasQueryChanged: false,
    visualization: {
      chartSettings: {
        stackMode: 'normal',
      } as ChartSettings,
      type: 'area' as PickerWidgets,
      widgetSettings: {},
    },
    querySettings: {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    } as Query,
  };

  describe('Scenario 1: User edits widget settings without changing query', () => {
    const test = sagaHelper(editChartSavedQuery(widgetId));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));
      return chartEditor;
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: false,
            isConfigured: false,
            error: null,
            data: null,
          })
        )
      );
    });

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
      };
    });

    test('finishes chart widget configuration', (result) => {
      const {
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = finishChartWidgetConfiguration(
        widgetId,
        'purchases',
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User edits query and widget settings ', () => {
    const test = sagaHelper(editChartSavedQuery(widgetId));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));
      return {
        ...chartEditor,
        hasQueryChanged: true,
      };
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('shows query update confirmation', (result) => {
      expect(result).toEqual(put(showQueryUpdateConfirmation()));
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          HIDE_QUERY_UPDATE_CONFIRMATION,
          CONFIRM_SAVE_QUERY_UPDATE,
          USE_QUERY_FOR_WIDGET,
        ])
      );
    });
  });
});

describe('editChartWidget()', () => {
  const action = editChartWidgetAction(widgetId);
  const visualizationSettings = {
    chartSettings: {
      stackMode: 'percent',
    } as ChartSettings,
    visualizationType: 'area' as PickerWidgets,
    widgetSettings: {},
  };

  describe('Scenario 1: User edits widget with ad-hoc query', () => {
    const test = sagaHelper(editChartWidget(action));
    const query: Query = {
      analysis_type: 'count',
      event_collection: 'logins',
      order_by: null,
    };

    const pubsub = {
      publish: jest.fn(),
    };

    const chartEditor = {
      isSavedQuery: false,
      visualization: {
        chartSettings: {
          stackMode: 'percent',
        } as ChartSettings,
        type: 'bar' as PickerWidgets,
        widgetSettings: {},
      },
      querySettings: {
        analysis_type: 'count',
        event_collection: 'purchases',
        order_by: null,
      } as Query,
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetItem,
              data: { query, result: 10 },
              widget: {
                ...widgetItem.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          setVisualizationSettings(
            visualizationType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(put(setQueryResult({ query, result: 10 })));
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(EDITOR_MOUNTED));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return applyConfiguration();
    });

    test('gets chart editor settings', () => {
      return chartEditor;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: false,
            isConfigured: false,
            error: null,
            data: null,
          })
        )
      );
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

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User edits widget with saved query', () => {
    const test = sagaHelper(editChartWidget(action));
    const query = 'financial-report';

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetItem,
              data: { query, result: 10 },
              widget: {
                ...widgetItem.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(true)));
    });
  });

  describe('Scenario 3: User cancel chart widget edition', () => {
    const test = sagaHelper(editChartWidget(action));
    const query: Query = {
      analysis_type: 'count',
      event_collection: 'logins',
      order_by: null,
    };

    const pubsub = {
      publish: jest.fn(),
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetItem,
              data: { query, result: 500 },
              widget: {
                ...widgetItem.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          setVisualizationSettings(
            visualizationType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(put(setQueryResult({ query, result: 500 })));
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(EDITOR_MOUNTED));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return closeEditor();
    });

    test('waits until chart editor is unmounted', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('resets chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });
  });
});

describe('createQueryForWidget()', () => {
  describe('Scenario 1: User close chart widget editor', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return closeEditor();
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

  describe('Scenario 2: User applies chart widget configuration', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));
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

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return applyConfiguration();
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
      expect(result).toEqual(put(closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });
});

describe('selectQueryForWidget()', () => {
  describe('Scenario 1: User selects existing save query', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));
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
        event_collection: 'purchases',
        order_by: null,
      },
    };

    test('shows query picker', (result) => {
      expect(result).toEqual(put(showQueryPicker()));
    });

    test('waits until user select saved query', (result) => {
      expect(result).toEqual(
        take([SELECT_SAVED_QUERY, CREATE_QUERY, HIDE_QUERY_PICKER])
      );

      return selectSavedQuery(savedQuery);
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(hideQueryPicker()));
    });

    test('finishes chart widget configuration', (result) => {
      const {
        id: queryId,
        visualization: { type, chartSettings, widgetSettings },
      } = savedQuery;

      const action = finishChartWidgetConfiguration(
        widgetId,
        queryId,
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User cancel creation of chart widget', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(showQueryPicker()));
    });

    test('waits until user close query picker', (result) => {
      expect(result).toEqual(
        take([SELECT_SAVED_QUERY, CREATE_QUERY, HIDE_QUERY_PICKER])
      );

      return hideQueryPicker();
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
      expect(result).toEqual(put(showQueryPicker()));
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([SELECT_SAVED_QUERY, CREATE_QUERY, HIDE_QUERY_PICKER])
      );

      return createQuery();
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(hideQueryPicker()));
    });

    test('runs create query flow', (result) => {
      expect(result).toEqual(call(createQueryForWidget, widgetId));
    });
  });
});
