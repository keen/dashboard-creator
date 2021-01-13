import { DashboardMetaData } from '..';

const createTagsPool = (dashboards: DashboardMetaData[]) => {
  let tagsPool = [];
  dashboards.forEach(
    (dashboard) => (tagsPool = [...tagsPool, ...dashboard.tags])
  );
  return Array.from(new Set(tagsPool));
};

export default createTagsPool;
