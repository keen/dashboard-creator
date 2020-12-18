/* eslint-disable @typescript-eslint/camelcase */
import { serializeSavedQuery } from './savedQuery';

import { SavedQueryAPIResponse } from '../types';

test('serializes query without metadata', () => {
  const savedQuery: SavedQueryAPIResponse = {
    query: {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    },
    query_name: 'purchases',
  };

  expect(serializeSavedQuery(savedQuery)).toMatchObject({
    displayName: 'purchases',
    id: 'purchases',
    visualization: {
      chartSettings: {},
      widgetSettings: {},
      type: 'metric',
    },
  });
});

test('serializes query with metadata', () => {
  const savedQuery: SavedQueryAPIResponse = {
    query: {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    },
    query_name: 'purchases',
    metadata: {
      visualization: {
        type: 'bar',
        chart_settings: {
          layout: 'horizontal',
        },
        widget_settings: {},
      },
    },
  };

  expect(serializeSavedQuery(savedQuery)).toMatchObject({
    displayName: 'purchases',
    id: 'purchases',
    visualization: {
      chartSettings: {
        layout: 'horizontal',
      },
      widgetSettings: {},
      type: 'bar',
    },
  });
});
