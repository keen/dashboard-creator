import { DashboardModel } from '../types';

export const serializeDashboard = (dashboard: DashboardModel) => ({
  ...dashboard,
  widgets: dashboard.widgets.map(({ id }) => id),
});
