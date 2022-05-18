import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import { getDetachedFilterWidgetConnections } from './getDetachedFilterWidgetConnections';

describe('getDetachedFilterWidgetConnections()', () => {
  describe('Scenario 1: Creates list of detached filter widget connections', () => {
    const dashboardId = '@dashboard/01';
    const filterWidgetId = '@filter/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              id: '@widget/01',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 10 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count_unique',
                event_collection: 'logins',
              },
            },
          },
          '@widget/02': {
            widget: {
              id: '@widget/02',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
          '@widget/03': {
            widget: {
              type: 'date-picker',
              position: { y: 5 },
            },
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: { widgets: ['@widget/01', '@widget/02', '@widget/03'] },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getDetachedFilterWidgetConnections(
        dashboardId,
        filterWidgetId,
        'purchases'
      );
      return result;
    }

    const test = sagaHelper(wrapper());

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('returns filter widget connections', (result) => {
      expect(result).toEqual([
        {
          widgetId: '@widget/01',
          isConnected: true,
          title: null,
          positionIndex: 1,
        },
      ]);
    });
  });

  describe('Scenario 2: Add not initialized widget to detached filter widget connections', () => {
    const dashboardId = '@dashboard/01';
    const filterWidgetId = '@filter/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              id: '@widget/01',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 10 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count_unique',
                event_collection: 'purchases',
              },
            },
          },
          '@widget/02': {
            widget: {
              id: '@widget/02',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: null,
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: { widgets: ['@widget/01', '@widget/02'] },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getDetachedFilterWidgetConnections(
        dashboardId,
        filterWidgetId,
        'purchases'
      );
      return result;
    }

    const test = sagaHelper(wrapper());

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('returns filter widget connections', (result) => {
      expect(result).toEqual([
        {
          widgetId: '@widget/02',
          isConnected: true,
          title: null,
          positionIndex: 2,
        },
      ]);
    });
  });

  describe('Scenario 3: Dont add widgets with error state to detached filter widget connections', () => {
    const dashboardId = '@dashboard/01';
    const filterWidgetId = '@filter/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            error: {},
            widget: {
              id: '@widget/01',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 10 },
              settings: {
                widgetSettings: {},
              },
            },
            data: null,
          },
          '@widget/02': {
            widget: {
              id: '@widget/02',
              type: 'visualization',
              filterIds: [filterWidgetId],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: null,
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: { widgets: ['@widget/01', '@widget/02'] },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getDetachedFilterWidgetConnections(
        dashboardId,
        filterWidgetId,
        'purchases'
      );
      return result;
    }

    const test = sagaHelper(wrapper());

    test('get application state', (result) => {
      expect(result).toEqual(select());
      return state;
    });

    test('returns filter widget connections', (result) => {
      expect(result).toEqual([
        {
          isConnected: true,
          positionIndex: 2,
          title: null,
          widgetId: '@widget/02',
        },
      ]);
    });
  });
});
