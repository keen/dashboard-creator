import { DashboardError } from '../../modules/dashboards';

export const DASHBOARD_ERROR: Record<DashboardError, string> = {
  [DashboardError.SERVER_ERROR]: 'public_dashboard_errors.view_public_message',
  [DashboardError.ACCESS_NOT_PUBLIC]:
    'public_dashboard_errors.access_not_public_message',
  [DashboardError.NOT_EXIST]: 'public_dashboard_errors.not_exist_message',
  [DashboardError.VIEW_PUBLIC_DASHBOARD]:
    'public_dashboard_errors.view_public_message',
};
