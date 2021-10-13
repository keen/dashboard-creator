import { Query } from '@keen.io/query';

export const getEventCollections = (query: string | Query): string[] => {
  if (typeof query === 'string') return [query];
  const { event_collection, analysis_type, steps } = query;
  if (analysis_type === 'funnel') {
    const collections: Set<string> = new Set();
    for (const step of steps) {
      collections.add(step.event_collection);
    }
    return [...collections];
  }
  return [event_collection];
};
