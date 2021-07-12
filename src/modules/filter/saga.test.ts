/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { put, select, getContext } from 'redux-saga/effects';
import fetchMock from 'jest-fetch-mock';

import {
  updateConnection,
  setEventStreamsPool,
  setupDashboardEventStreams as setupDashboardEventStreamsAction,
  setEventStreamSchema,
  setEventStream,
  setSchemaProcessingError,
  setSchemaProcessing,
} from './actions';

import {
  setWidgetHighlight,
  setupDashboardEventStreams,
  prepareFilterTargetProperties,
  getFilterWidgetConnections,
  getDetachedFilterWidgetConnections,
} from './saga';

import { setWidgetState } from '../widgets';

import { KEEN_ANALYSIS } from '../../constants';

describe('setWidgetHighlight()', () => {
  describe('Scenario 1: Set highlight state after enabling widget connection ', () => {
    const action = updateConnection('@widget/01', true);
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates widget highlight state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState('@widget/01', {
            isHighlighted: true,
          })
        )
      );
    });
  });

  describe('Scenario 2: Set highlight state after removing widget connection ', () => {
    const action = updateConnection('@widget/01', false);
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates widget highlight state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState('@widget/01', {
            isHighlighted: false,
          })
        )
      );
    });
  });
});

describe('setupDashboardEventStreams()', () => {
  describe('Scenario 1: Creates event streams pool', () => {
    const action = setupDashboardEventStreamsAction('@dashboard/01');
    const test = sagaHelper(setupDashboardEventStreams(action));

    const dashboardId = '@dashboard/01';

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
                analysis_type: 'average',
                event_collection: 'logins',
              },
            },
          },
          '@widget/02': {
            widget: {
              id: '@widget/02',
              type: 'visualization',
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

    test('get application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('set event streams pool', (result) => {
      expect(result).toEqual(put(setEventStreamsPool(['logins', 'purchases'])));
    });
  });
});

describe('prepareFilterTargetProperties()', () => {
  describe('Scenario 1: Creates filter widget connections list', () => {
    const action = setEventStream('logins');
    const test = sagaHelper(prepareFilterTargetProperties(action));

    const keenClient = {
      url: jest.fn().mockImplementation(() => '@keen/url'),
      config: {
        masterKey: '@masterKey',
      },
    };

    const schemaProperties = {
      id: 'string',
      'user.gender': 'string',
    };

    const tree = {
      user: { gender: ['user.gender', 'string'] },
      id: ['id', 'string'],
    };

    const schemaList = [
      { path: 'id', type: 'string' },
      { path: 'user.gender', type: 'string' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(setSchemaProcessing(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return {
        properties: schemaProperties,
      };
    });

    test('creates tree from schema properties', (result) => {
      expect(result).toEqual(tree);

      return tree;
    });

    test('set event stream schema', (result) => {
      expect(result).toEqual(
        put(setEventStreamSchema(schemaProperties, tree, schemaList))
      );
    });

    test('clears schema processing error', (result) => {
      expect(result).toEqual(put(setSchemaProcessingError(false)));
    });

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(setSchemaProcessing(false)));
    });
  });

  describe('Scenario 2: Failed to creates schema tree', () => {
    const action = setEventStream('logins');
    const test = sagaHelper(prepareFilterTargetProperties(action));

    const keenClient = {
      url: jest.fn().mockImplementation(() => '@keen/url'),
      config: {
        masterKey: '@masterKey',
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(setSchemaProcessing(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return new Error();
    });

    test('set schema processing error', (result) => {
      expect(result).toEqual(put(setSchemaProcessingError(true)));
    });
  });
});

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
