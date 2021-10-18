import { Query } from '@keen.io/query';
import { getEventCollections } from './getEventCollections';

test('returns event collection from query other than funnel', () => {
  const query = {
    analysis_type: 'count',
    event_collection: 'eventStream1',
  } as Query;
  const result = getEventCollections(query);

  expect(result).toMatchInlineSnapshot(`
    Array [
      "eventStream1",
    ]
  `);
});

test('returns event collections from funnel query', () => {
  const funnelQuery = {
    analysis_type: 'funnel',
    steps: [
      {
        event_collection: 'eventStream1',
        actor_property: 'property1',
        timeframe: 'last 14 days',
      },
      {
        event_collection: 'eventStream2',
        actor_property: 'property2',
        timeframe: 'last 14 days',
      },
      {
        event_collection: 'eventStream3',
        actor_property: 'property3',
        timeframe: 'last 14 days',
      },
    ],
  } as Query;
  const result = getEventCollections(funnelQuery);

  expect(result).toMatchInlineSnapshot(`
    Array [
      "eventStream1",
      "eventStream2",
      "eventStream3",
    ]
  `);
});
