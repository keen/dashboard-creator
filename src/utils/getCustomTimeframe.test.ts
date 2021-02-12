import getCustomTimeframe from './getCustomTimeframe';

test('should return custom timeframe', () => {
  const timeframe = 'this_14_days';
  const label = 'Last';

  const customTimeframe = getCustomTimeframe(timeframe, label);
  expect(customTimeframe).toMatchInlineSnapshot(`"Last 14 days"`);
});
