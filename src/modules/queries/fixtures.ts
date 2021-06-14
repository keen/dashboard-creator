/* eslint-disable @typescript-eslint/naming-convention */

import { SavedQuery, SavedQueryAPIResponse } from './types';

export const savedQueriesResponse: SavedQueryAPIResponse[] = [
  {
    query: {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    },
    refresh_rate: 0,
    query_name: '@query/01',
    metadata: {
      display_name: 'Query 01',
      visualization: {
        type: 'bar',
        chart_settings: {},
        widget_settings: {},
      },
    },
  },
  {
    query: {
      analysis_type: 'sum',
      timeframe: 'this_14_days',
      event_collection: 'purchases',
      order_by: null,
    },
    refresh_rate: 0,
    query_name: '@query/02',
    metadata: {
      display_name: 'Query 02',
      visualization: {
        type: 'area',
        chart_settings: {},
        widget_settings: {},
      },
    },
  },
];

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
      timeframe: 'this_14_days',
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
      timeframe: 'this_14_days',
      event_collection: 'pageviews',
      order_by: null,
    },
  },
];
