import { Analysis } from '@keen.io/query';
import { Widgets } from '@keen.io/widgets';
import createSavedQueryTagsPool from './createSavedQueryTagsPool';

test('should return a tagsPool', () => {
  const queries = [
    {
      id: '1',
      displayName: 'Query 1',
      settings: {
        analysis_type: 'count' as Analysis,
        timeframe: 'this_7_days',
        event_collection: 'tags',
      },
      visualization: {
        type: 'line' as Widgets,
        chartSettings: {
          curve: 'linear',
        },
        widgetSettings: {},
      },
      tags: ['tag1', 'tag2'],
    },
    {
      id: '2',
      displayName: 'Query 2',
      settings: {
        analysis_type: 'count' as Analysis,
        timeframe: 'this_7_days',
        event_collection: 'tags',
      },
      visualization: {
        type: 'line' as Widgets,
        chartSettings: {
          curve: 'linear',
        },
        widgetSettings: {},
      },
      tags: ['tag3', 'tag4'],
    },
  ];

  const tagsPool = createSavedQueryTagsPool(queries);

  expect(tagsPool).toMatchInlineSnapshot(`
    Array [
      "tag1",
      "tag2",
      "tag3",
      "tag4",
    ]
  `);
});
