import { SavedQuery } from '../modules/queries';

const createSavedQueryTagsPool = (queries: SavedQuery[]): string[] => {
  let tagsPool = [];
  queries.forEach((query) => {
    if (query.tags?.length > 0) {
      tagsPool = [...tagsPool, ...query.tags];
    }
  });
  return Array.from(new Set(tagsPool));
};

export default createSavedQueryTagsPool;
