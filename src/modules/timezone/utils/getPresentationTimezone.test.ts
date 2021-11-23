import { getPresentationTimezone } from './index';

describe('getPresentationTimezone()', () => {
  test('get presentation timezone offset when timeframe is an object', () => {
    const queryResults = {
      query: {
        timeframe: {
          start: '2021-04-06T00:00:00-04:00',
          end: '2021-04-07T00:00:00-04:00',
        },
        timezone: 'America/Barbados',
      },
    } as any;
    const presentationTimezone = getPresentationTimezone(queryResults);
    expect(presentationTimezone).toBe('America/Barbados');
  });

  test('get presentation timezone when timeframe is a string', () => {
    const queryResults = {
      query: {
        timeframe: 'this_14_hours',
        timezone: 'Europe/Warsaw',
      },
    } as any;
    const presentationTimezone = getPresentationTimezone(queryResults);
    expect(presentationTimezone).toBe('Europe/Warsaw');
  });

  test('return null when no query in query results', () => {
    const queryResults = {} as any;
    const presentationTimezone = getPresentationTimezone(queryResults);
    expect(presentationTimezone).toBe(null);
  });
});
