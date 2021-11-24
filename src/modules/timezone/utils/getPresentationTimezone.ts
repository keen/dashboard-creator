import { Query } from '@keen.io/query';

export const getPresentationTimezone = (
  queryResults: Record<string, any> & { query?: Query }
) => {
  if ('query' in queryResults) {
    const {
      query: { timezone },
    } = queryResults;

    return timezone;
  }
  return null;
};
