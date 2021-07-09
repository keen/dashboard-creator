/* eslint-disable @typescript-eslint/naming-convention */
import queriesReducer, { initialState } from './reducer';

import {
  addInterimQuery,
  removeInterimQuery,
  removeInterimQueries,
} from './actions';

test('adds interim query based on widget identifer', () => {
  const widgetId = '@widget/01';
  const data = {
    query: {
      analysis_type: 'count',
      event_collection: 'logins',
    },
    result: 100,
  };

  const action = addInterimQuery(widgetId, data);
  const { interimQueries } = queriesReducer(initialState, action);

  expect(interimQueries).toMatchInlineSnapshot(`
    Object {
      "@widget/01": Object {
        "query": Object {
          "analysis_type": "count",
          "event_collection": "logins",
        },
        "result": 100,
      },
    }
  `);
});

test('removes specific interim query', () => {
  const widgetId = '@widget/01';
  const action = removeInterimQuery(widgetId);

  const state = {
    ...initialState,
    interimQueries: {
      '@widget/01': {
        query: {
          analysis_type: 'count_unique',
          event_collection: 'logins',
        },
        result: 200,
      },
    },
  };

  const { interimQueries } = queriesReducer(state, action);

  expect(interimQueries).toMatchInlineSnapshot(`Object {}`);
});

test('removes all interim queries', () => {
  const action = removeInterimQueries();
  const state = {
    ...initialState,
    interimQueries: {
      '@widget/01': {
        query: {
          analysis_type: 'count_unique',
          event_collection: 'logins',
        },
        result: 200,
      },
    },
  };

  const { interimQueries } = queriesReducer(state, action);

  expect(interimQueries).toMatchInlineSnapshot(`Object {}`);
});
