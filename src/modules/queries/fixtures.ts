/* eslint-disable @typescript-eslint/camelcase */

import { SavedQuery } from './types';

export const savedQueries: SavedQuery[] = [
  {
    id: '@query/01',
    displayName: 'Query 01',
    visualization: {
      type: 'bar',
      chartSettings: {},
      widgetSettings: {},
    },
    settings: {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    },
  },
  {
    id: '@query/02',
    displayName: 'Query 02',
    visualization: {
      type: 'metric',
      chartSettings: {},
      widgetSettings: {},
    },
    settings: {
      analysis_type: 'count',
      event_collection: 'pageviews',
      order_by: null,
    },
  },
];
