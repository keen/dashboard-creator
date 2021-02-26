import { getOldestTimeframe } from './getOldestTimeframe';

test('should return oldest timeframe', () => {
  const timeframes = [
    'this_7_years',
    'this_8_days',
    'this_2_hours',
    'last_2_hours',
    'last_8_years',
    {
      start: '2019-11-01T12:00:00Z',
      end: '2021-02-18T00:00:00Z',
    },
  ];
  const result = getOldestTimeframe(timeframes);
  expect(result).toEqual('last_8_years');
});
