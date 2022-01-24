import { DashboardMetaData } from '../types';

const createDashboardMeta = (dashboardId: string): DashboardMetaData => ({
  id: dashboardId,
  widgets: 0,
  queries: 0,
  title: null,
  tags: [],
  lastModificationDate: null,
  isPublic: false,
  publicAccessKey: null,
});

export default createDashboardMeta;
