import { setupDashboardEventStreams as setupDashboardEventStreamsAction } from '../actions';
import sagaHelper from 'redux-saga-testing';
import { setupDashboardEventStreams } from '../saga';
import { put, select } from 'redux-saga/effects';
import { filterActions } from '../index';

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
      expect(result).toEqual(
        put(filterActions.setEventStreamsPool(['logins', 'purchases']))
      );
    });
  });
});
