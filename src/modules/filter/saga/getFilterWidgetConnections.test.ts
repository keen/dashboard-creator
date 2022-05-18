import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import { getFilterWidgetConnections } from './getFilterWidgetConnections';

describe('getFilterWidgetConnections()', () => {
  describe('Scenario 1: Creates filter widget connections list', () => {
    const dashboardId = '@dashboard/01';
    const filterWidgetId = '@filter/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              type: 'visualization',
              position: { y: 10 },
            },
            data: {
              query: {
                analysis_type: 'funnel',
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
          '@widget/04': {
            widget: {
              id: '@widget/04',
              type: 'visualization',
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {
                  title: {
                    content: '@widget/title',
                  },
                },
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: {
              widgets: ['@widget/01', '@widget/02', '@widget/03', '@widget/04'],
            },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getFilterWidgetConnections(
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
        {
          widgetId: '@widget/04',
          isConnected: false,
          title: '@widget/title',
          positionIndex: 4,
        },
      ]);
    });
  });

  describe('Scenario 2: Do not creates connection for widgets that are not initialized', () => {
    const dashboardId = '@dashboard/01';
    const filterWidgetId = '@filter/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              id: '@widget/01',
              type: 'visualization',
              position: { y: 10 },
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
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: {
              widgets: ['@widget/01', '@widget/02'],
            },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getFilterWidgetConnections(
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
});
