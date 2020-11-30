const createDashboardMeta = (dashboardId: string) => ({
  id: dashboardId,
  widgets: 0,
  queries: 0,
  title: null,
  isPublic: false,
});

export default createDashboardMeta;
