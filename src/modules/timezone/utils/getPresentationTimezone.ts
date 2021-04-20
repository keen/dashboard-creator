import { Query } from '@keen.io/query';
import { getOffsetFromDate } from '@keen.io/time-utils';

export const getPresentationTimezone = (
  queryResults: Record<string, any> & { query?: Query }
) => {
  if ('query' in queryResults) {
    const {
      query: { timeframe, timezone },
    } = queryResults;
    if (typeof timeframe === 'string') return timezone;
    return getOffsetFromDate(timeframe.start);
  }
  return null;
};
