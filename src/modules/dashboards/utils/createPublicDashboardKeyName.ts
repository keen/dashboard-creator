import { PUBLIC_DASHBOARD_ID } from '../constants';

const createPublicDashboardKeyName = (dashboardId: string) =>
  `${PUBLIC_DASHBOARD_ID}-${dashboardId}`;

export default createPublicDashboardKeyName;
