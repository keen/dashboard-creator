import { DashboardMetaData } from '../types';

const createDashboardMeta = (dashboardId: string): DashboardMetaData => ({
  id: dashboardId,
  widgets: 0,
  queries: 0,
  title: null,
  tags: [],
  lastModificationDate: +new Date(),
  isPublic: false,
});

export default createDashboardMeta;
