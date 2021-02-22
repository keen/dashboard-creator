/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, select, take, fork, call, cancel, all } from 'redux-saga/effects';

import {
  updateWidgetsDistinction,
  applyFilterUpdates,
  synchronizeFilterConnections,
  editFilterWidget,
  setupFilterWidget,
  removeConnectionFromFilter,
  removeFilterConnections,
} from './filterWidget';

import {
  updateChartWidgetFiltersConnections,
  setWidgetState,
  editFilterWidget as editFilterWidgetAction,
  configureFilerWidget,
} from '../actions';

import {
  resetEditor,
  getFilterWidgetConnections,
  getDetachedFilterWidgetConnections,
  setEventStream,
  setTargetProperty,
  setupDashboardEventStreams,
  openEditor,
  closeEditor,
  setEditorDetachedConnections,
  setEditorConnections,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
  SET_EVENT_STREAM,
} from '../../filter';
import { getWidgetSettings } from '../../widgets';
import { getActiveDashboard } from '../../app';
import {
  saveDashboard,
  getDashboard,
  removeWidgetFromDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../../dashboards';

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
      expect(result).toEqual(take(SET_EVENT_STREAM));

      return setEventStream('logins');
    });

    test('resets target property', (result) => {
      expect(result).toEqual(put(setTargetProperty(null)));
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
        put(setEditorDetachedConnections(detachedWidgetConnections))
      );
    });

    test('set widget connections', (result) => {
      expect(result).toEqual(put(setEditorConnections(widgetConnections)));
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
      expect(result).toEqual(select(getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(put(setupDashboardEventStreams(dashboardId)));
    });

    test('get filter widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        settings: { eventStream: 'logins', targetProperty: 'user.id' },
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
        put(setEditorDetachedConnections(detachedWidgetConnections))
      );
    });

    test('set event stream', (result) => {
      expect(result).toEqual(put(setEventStream('logins')));
    });

    test('set target property', (result) => {
      expect(result).toEqual(put(setTargetProperty('user.id')));
    });

    test('set widget connections', (result) => {
      expect(result).toEqual(put(setEditorConnections(widgetConnections)));
    });

    test('updates widget distinction', (result) => {
      expect(result).toEqual(
        call(updateWidgetsDistinction, dashboardId, widgetId, widgetConnections)
      );
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]));

      return { type: APPLY_EDITOR_SETTINGS };
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
      expect(result).toEqual(put(closeEditor()));
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
      expect(result).toEqual(put(resetEditor()));
    });
  });
});

describe('setupFilterWidget()', () => {
  describe('Scenario 1: User succesfully creates filter widget', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';
    const test = sagaHelper(setupFilterWidget(widgetId));

    test('get active dashboard identifier', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(put(setupDashboardEventStreams(dashboardId)));
    });

    test('waits until widget is added to dashboard', (result) => {
      expect(result).toEqual(take(ADD_WIDGET_TO_DASHBOARD));

      return { type: ADD_WIDGET_TO_DASHBOARD };
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]));

      return { type: APPLY_EDITOR_SETTINGS };
    });

    test('cancel widget connections watcher', (result) => {
      expect(result).toEqual(cancel());
    });

    test('applies filter widget connections', (result) => {
      expect(result).toEqual(call(applyFilterUpdates, widgetId));
    });

    test('closes filter widget editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
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
      expect(result).toEqual(put(resetEditor()));
    });
  });

  describe('Scenario 2: User cancel filter widget configuration', () => {
    const dashboardId = '@dashboard/01';
    const widgetId = '@filter/01';
    const test = sagaHelper(setupFilterWidget(widgetId));

    test('get active dashboard identifier', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return dashboardId;
    });

    test('creates event streams pool', (result) => {
      expect(result).toEqual(put(setupDashboardEventStreams(dashboardId)));
    });

    test('waits until widget is added to dashboard', (result) => {
      expect(result).toEqual(take(ADD_WIDGET_TO_DASHBOARD));

      return { type: ADD_WIDGET_TO_DASHBOARD };
    });

    test('opens filter widget editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('creates filter widget connections watcher', (result) => {
      expect(result).toEqual(
        fork(synchronizeFilterConnections, dashboardId, widgetId, true)
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]));

      return { type: CLOSE_EDITOR };
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
