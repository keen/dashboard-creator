/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import {
  put,
  select,
  take,
  fork,
  call,
  cancel,
  all,
  getContext,
} from 'redux-saga/effects';

import {
  setFilterWidget,
  updateWidgetsDistinction,
  applyFilterUpdates,
  applyFilterModifiers,
  unapplyFilterWidget,
  synchronizeFilterConnections,
  editFilterWidget,
  setupFilterWidget,
  removeConnectionFromFilter,
  removeFilterConnections,
  resetFilterWidgets,
} from './filterWidget';

import {
  updateChartWidgetFiltersConnections,
  setWidgetState,
  editFilterWidget as editFilterWidgetAction,
  unapplyFilterWidget as unapplyFilterWidgetAction,
  setFilterWidget as setFilterWidgetAction,
  applyFilterModifiers as applyFilterModifiersAction,
  configureFilerWidget,
  initializeChartWidget,
  setFilterPropertyList,
  resetFilterWidgets as resetFilterWidgetsAction,
} from '../actions';

import { filterActions } from '../../filter';
import { getWidgetSettings, getWidget } from '../../widgets';
import {
  saveDashboard,
  getDashboard,
  removeWidgetFromDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../../dashboards';

import { KEEN_ANALYSIS } from '../../../constants';
import { appSelectors } from '../../app';
import {
  getDetachedFilterWidgetConnections,
  getFilterWidgetConnections,
} from '../../filter/saga';

describe('applyFilterModifiers()', () => {
  describe('Scenario 1: Apply filter widget modifiers on connected charts', () => {
    const widgetId = '@filter/01';
    const action = applyFilterModifiersAction(widgetId);

    const test = sagaHelper(applyFilterModifiers(action));

    test('set filter widget active state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isActive: true,
          })
        )
      );
    });

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        settings: {
          widgets: ['@widget/01', '@widget/02'],
        },
      };
    });

    test('updates chart widgets state', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isInitialized: false,
              error: null,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isInitialized: false,
              error: null,
            })
          ),
        ])
      );
    });

    test('reinitializes chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(initializeChartWidget('@widget/01')),
          put(initializeChartWidget('@widget/02')),
        ])
      );
    });
  });
});

describe('setFilterWidget()', () => {
  describe('Scenario 1: Succesfully set filter widget settings', () => {
    const widgetId = '@filter/01';
    const action = setFilterWidgetAction(widgetId);

    const test = sagaHelper(setFilterWidget(action));

    const client = {
      query: jest.fn(),
    };

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidget, widgetId));

      return {
        widget: {
          id: widgetId,
          settings: {
            widgets: ['@widget/01', '@widget/02'],
            eventStream: 'logins',
            targetProperty: 'country',
          },
        },
      };
    });

    test('get connected chart widgets settings', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@widget/01'), select(getWidget, '@widget/02')])
      );

      return [
        {
          data: {
            query: {
              timeframe: 'this_30_days',
            },
          },
        },
        {
          data: {
            query: {
              timeframe: 'this_3_months',
            },
          },
        },
      ];
    });

    test('get client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return client;
    });

    test('set filter widget loading state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isLoading: true,
          })
        )
      );
    });

    test('calls client to fetch list of possible filter values', () => {
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({
          analysisType: 'select_unique',
          eventCollection: 'logins',
          targetProperty: 'country',
          timeframe: 'this_3_months',
        })
      );

      return {
        result: [
          'argentina',
          'Armenia',
          'Angola',
          'algeria',
          '12Australia',
          '33venezuela',
        ],
      };
    });

    test('sorts filter values alphabetically and sets them for filter widget ', (result) => {
      expect(result).toEqual(
        put(
          setFilterPropertyList(widgetId, [
            '12Australia',
            '33venezuela',
            'algeria',
            'Angola',
            'argentina',
            'Armenia',
          ])
        )
      );
    });

    test('set filter widget loading state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isLoading: false,
          })
        )
      );
    });
  });
});

describe('unapplyFilterWidget()', () => {
  describe('Scenario 1: User unapply filter widget settings', () => {
    const widgetId = '@filter/01';
    const action = unapplyFilterWidgetAction(widgetId);

    const test = sagaHelper(unapplyFilterWidget(action));

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidget, widgetId));

      return {
        data: {
          filter: { propertyName: 'logins', propertyValue: ['user.id'] },
        },
        widget: {
          settings: { widgets: ['@widget/01', '@widget/02'] },
        },
      };
    });

    test('removes filter data from widget', (result) => {
      expect(result).toEqual(
        put(setWidgetState(widgetId, { isActive: false, data: {} }))
      );
    });

    test('updates chart widgets state', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isInitialized: false,
              error: null,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isInitialized: false,
              error: null,
            })
          ),
        ])
      );
    });

    test('reinitializes chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(initializeChartWidget('@widget/01')),
          put(initializeChartWidget('@widget/02')),
        ])
      );
    });
  });
});

describe('removeFilterConnections()', () => {
  const dashboardId = '@dashboard/01';
  const deletedFilterId = '@filter/01';

  const state = {
    dashboards: {
      items: {
        [dashboardId]: {
          settings: { widgets: ['@widget/01', '@widget/02', '@widget/03'] },
        },
      },
    },
    widgets: {
      items: {
        '@widget/01': {
          widget: {
            id: '@widget/01',
            type: 'visualization',
            filterIds: [deletedFilterId, '@filter/02'],
          },
        },
        '@widget/02': {
          widget: {
            id: '@widget/02',
            type: 'visualization',
            filterIds: [deletedFilterId, '@filter/02'],
          },
        },
        '@widget/03': {
          widget: {
            id: '@widget/03',
            type: 'date-picker',
          },
        },
      },
    },
  };

  describe('Scenario 1: Removes connection from chart widget after filter is removed', () => {
    const test = sagaHelper(
      removeFilterConnections(dashboardId, deletedFilterId)
    );

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('removes connections from chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(
            updateChartWidgetFiltersConnections('@widget/01', ['@filter/02'])
          ),
          put(
            updateChartWidgetFiltersConnections('@widget/02', ['@filter/02'])
          ),
        ])
      );
    });
  });
});

describe('removeConnectionFromFilter()', () => {
  describe('Scenario 1: Removes connection from filter widget after chart is removed', () => {
    const filterId = '@filter/01';
    const widgetId = '@widget/01';

    const test = sagaHelper(removeConnectionFromFilter(filterId, widgetId));

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, filterId));

      return {
        settings: {
          eventStream: 'logins',
          targetProperty: 'user.id',
          widgets: [widgetId, '@widget/02'],
        },
      };
    });

    test('updates filter widget connections', (result) => {
      expect(result).toEqual(
        put(configureFilerWidget(filterId, ['@widget/02'], 'logins', 'user.id'))
      );
    });
  });
});

describe('updateWidgetsDistinction()', () => {
  describe('Scenario 1: Updates widgets state', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';

    const widgetConnections = [
      {
        widgetId: '@widget/01',
        isConnected: true,
        title: null,
        positionIndex: 0,
      },
    ];

    const detachedWidgetConnections = [
      {
        widgetId: '@widget/02',
        isConnected: false,
        title: null,
        positionIndex: 0,
      },
    ];

    const test = sagaHelper(
      updateWidgetsDistinction(dashboardId, widgetId, widgetConnections)
    );

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return {
        dashboards: {
          items: {
            [dashboardId]: {
              settings: { widgets: ['@widget/01', '@widget/02', '@widget/03'] },
            },
          },
        },
        widgets: {
          items: {
            '@widget/01': {
              widget: {
                id: '@widget/01',
                type: 'visualization',
              },
            },
            '@widget/02': {
              widget: {
                id: '@widget/02',
                type: 'visualization',
                filterIds: [widgetId, '@filter/02'],
              },
            },
            '@widget/03': {
              widget: {
                id: '@widget/03',
                type: 'date-picker',
              },
            },
          },
        },
        filter: {
          detachedWidgetConnections,
        },
      };
    });

    test('updates widgets distinction', (result) => {
      expect(result).toEqual(
        all([
          put(setWidgetState('@widget/03', { isFadeOut: true })),
          put(
            setWidgetState('@widget/01', {
              isFadeOut: false,
              isHighlighted: true,
              isTitleCover: true,
              isDetached: false,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isFadeOut: false,
              isHighlighted: false,
              isTitleCover: true,
              isDetached: true,
            })
          ),
        ])
      );
    });
  });
});

describe('synchronizeFilterConnections()', () => {
  describe('Scenario 1: Synchronize widget connections after event stream is changed', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';

    const widgetConnections = [
      {
        widgetId: '@widget/01',
        isConnected: false,
        title: null,
        positionIndex: 0,
      },
    ];

    const detachedWidgetConnections = [
      {
        widgetId: '@widget/02',
        isConnected: false,
        title: null,
        positionIndex: 0,
      },
    ];

    const test = sagaHelper(
      synchronizeFilterConnections(dashboardId, widgetId, false)
    );

    test('wait for event stream change', (result) => {
      expect(result).toEqual(take(filterActions.setEventStream.type));

      return filterActions.setEventStream('logins');
    });

    test('resets target property', (result) => {
      expect(result).toEqual(put(filterActions.setTargetProperty(null)));
    });

    test('creates filter widget connections', (result) => {
      console.log('result', result);
      expect(result).toEqual(
        call(getFilterWidgetConnections, dashboardId, widgetId, 'logins', false)
      );

      return widgetConnections;
    });

    test('creates filter widget detached connections', (result) => {
      expect(result).toEqual(
        call(
          getDetachedFilterWidgetConnections,
          dashboardId,
          widgetId,
          'logins'
        )
      );

      return detachedWidgetConnections;
    });

    test('set detached widget connections', (result) => {
      expect(result).toEqual(
        put(
          filterActions.setEditorDetachedConnections(detachedWidgetConnections)
        )
      );
    });

    test('set widget connections', (result) => {
      expect(result).toEqual(
        put(filterActions.setEditorConnections(widgetConnections))
      );
    });

    test('updates widget distinction', (result) => {
      expect(result).toEqual(
        call(updateWidgetsDistinction, dashboardId, widgetId, widgetConnections)
      );
    });
  });
});

describe('editFilterWidget()', () => {
  describe('Scenario 1: User succesfully edits filter widget', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';

    const action = editFilterWidgetAction(widgetId);
    const test = sagaHelper(editFilterWidget(action));

    const widgetConnections = [
      {
        widgetId: '@widget/01',
        isConnected: false,
        title: null,
        positionIndex: 0,
      },
    ];

    const detachedWidgetConnections = [
      {
        widgetId: '@widget/02',
        isConnected: false,
        title: null,
        positionIndex: 0,
      },
    ];

    test('get active dashboard identifier', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(
        put(filterActions.setupDashboardEventStreams(dashboardId))
      );
    });

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        settings: {
          eventStream: 'logins',
          targetProperty: 'user.id',
          name: 'filterWidgetName',
        },
      };
    });

    test('creates filter widget connections', (result) => {
      expect(result).toEqual(
        call(getFilterWidgetConnections, dashboardId, widgetId, 'logins', false)
      );

      return widgetConnections;
    });

    test('creates filter widget detached connections', (result) => {
      expect(result).toEqual(
        call(
          getDetachedFilterWidgetConnections,
          dashboardId,
          widgetId,
          'logins'
        )
      );

      return detachedWidgetConnections;
    });

    test('set detached widget connections', (result) => {
      expect(result).toEqual(
        put(
          filterActions.setEditorDetachedConnections(detachedWidgetConnections)
        )
      );
    });

    test('set event stream', (result) => {
      expect(result).toEqual(put(filterActions.setEventStream('logins')));
    });

    test('set target property', (result) => {
      expect(result).toEqual(put(filterActions.setTargetProperty('user.id')));
    });

    test('set widget connections', (result) => {
      expect(result).toEqual(
        put(filterActions.setEditorConnections(widgetConnections))
      );
    });

    test('set filter widget name', (result) => {
      expect(result).toEqual(put(filterActions.setName('filterWidgetName')));
    });

    test('updates widget distinction', (result) => {
      expect(result).toEqual(
        call(updateWidgetsDistinction, dashboardId, widgetId, widgetConnections)
      );
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(filterActions.openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([filterActions.applySettings.type, filterActions.closeEditor.type])
      );

      return { type: filterActions.applySettings.type };
    });

    test('cancel widget connections watcher', (result) => {
      expect(result).toEqual(cancel());
    });

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return {
        widgets: {
          items: {
            '@widget/01': {
              widget: {
                id: '@widget/01',
              },
            },
            '@widget/02': {
              widget: {
                id: '@widget/02',
                filterIds: [widgetId, '@filter/02'],
              },
            },
          },
        },
        filter: {
          detachedWidgetConnections,
        },
      };
    });

    test('removes detached connections from chart widget', (result) => {
      expect(result).toEqual(
        all([
          put(
            updateChartWidgetFiltersConnections('@widget/02', ['@filter/02'])
          ),
        ])
      );
    });

    test('applies filter widget connections', (result) => {
      expect(result).toEqual(call(applyFilterUpdates, widgetId));
    });

    test('closes filter widget editor', (result) => {
      expect(result).toEqual(put(filterActions.closeEditor()));
    });

    test('saves dashboard', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });

    test('get dashboard widgets', (result) => {
      expect(result).toEqual(select(getDashboard, dashboardId));

      return {
        settings: { widgets: ['@widget/01', '@widget/02'] },
      };
    });

    test('reset widgets state', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isHighlighted: false,
              isFadeOut: false,
              isDetached: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isHighlighted: false,
              isFadeOut: false,
              isDetached: false,
              isTitleCover: false,
            })
          ),
        ])
      );
    });

    test('reset filter editor state', (result) => {
      expect(result).toEqual(put(filterActions.resetEditor()));
    });
  });
});

describe('setupFilterWidget()', () => {
  describe('Scenario 1: User succesfully creates filter widget', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';
    const test = sagaHelper(setupFilterWidget(widgetId));

    test('get active dashboard identifier', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(
        put(filterActions.setupDashboardEventStreams(dashboardId))
      );
    });

    test('waits until widget is added to dashboard', (result) => {
      expect(result).toEqual(take(ADD_WIDGET_TO_DASHBOARD));

      return { type: ADD_WIDGET_TO_DASHBOARD };
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(filterActions.openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([filterActions.applySettings.type, filterActions.closeEditor.type])
      );

      return { type: filterActions.applySettings.type };
    });

    test('cancel widget connections watcher', (result) => {
      expect(result).toEqual(cancel());
    });

    test('applies filter widget connections', (result) => {
      expect(result).toEqual(call(applyFilterUpdates, widgetId));
    });

    test('closes filter widget editor', (result) => {
      expect(result).toEqual(put(filterActions.closeEditor()));
    });

    test('saves dashboard', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });

    test('get dashboard widgets', (result) => {
      expect(result).toEqual(select(getDashboard, dashboardId));

      return {
        settings: { widgets: ['@widget/01', '@widget/02'] },
      };
    });

    test('reset widgets state', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isHighlighted: false,
              isFadeOut: false,
              isDetached: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isHighlighted: false,
              isFadeOut: false,
              isDetached: false,
              isTitleCover: false,
            })
          ),
        ])
      );
    });

    test('reset filter editor state', (result) => {
      expect(result).toEqual(put(filterActions.resetEditor()));
    });
  });

  describe('Scenario 2: User cancel filter widget configuration', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';
    const test = sagaHelper(setupFilterWidget(widgetId));

    test('get active dashboard identifier', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(
        put(filterActions.setupDashboardEventStreams(dashboardId))
      );
    });

    test('waits until widget is added to dashboard', (result) => {
      expect(result).toEqual(take(ADD_WIDGET_TO_DASHBOARD));

      return { type: ADD_WIDGET_TO_DASHBOARD };
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(filterActions.openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([filterActions.applySettings.type, filterActions.closeEditor.type])
      );

      return { type: filterActions.closeEditor.type };
    });

    test('cancel widget connections watcher', (result) => {
      expect(result).toEqual(cancel());
    });

    test('removes widget from dashboard', (result) => {
      expect(result).toEqual(
        put(removeWidgetFromDashboard(dashboardId, widgetId))
      );
    });
  });
});

describe('resetFilterWidgets()', () => {
  describe('Scenario 1: Resets all filter widgets state', () => {
    const dashboardId = '@dashboard/01';
    const action = resetFilterWidgetsAction('@dashboard/01');
    const test = sagaHelper(resetFilterWidgets(action));

    test('gets application state', (result) => {
      expect(result).toEqual(select());

      return {
        widgets: {
          items: {
            '@filter/01': {
              widget: {
                type: 'filter',
                id: '@filter/01',
                data: {},
              },
            },
            '@date-picker/01': {
              widget: {
                type: 'date-picker',
                id: '@date-picker/01',
              },
            },
            '@widget/02': {
              widget: {
                type: 'visualization',
              },
            },
            '@filter/03': {
              widget: {
                type: 'filter',
                id: '@filter/03',
                data: {},
              },
            },
          },
        },
        dashboards: {
          items: {
            [dashboardId]: {
              settings: {
                widgets: [
                  '@filter/01',
                  '@date-picker/01',
                  '@widget/02',
                  '@filter/03',
                ],
              },
            },
          },
        },
      };
    });

    test('reset filter widgets states', (result) => {
      expect(result).toEqual(
        all([
          put(setWidgetState('@filter/01', { isActive: false, data: null })),
          put(setWidgetState('@filter/03', { isActive: false, data: null })),
        ])
      );
    });
  });
});
