const createDashboardMeta = (dashboardId: string) => ({
  id: dashboardId,
  lastModificationDate: new Date().toLocaleDateString('us-US'),
  widgets: 0,
  queries: 0,
  title: null,
  isPublic: false,
});

export default createDashboardMeta;
