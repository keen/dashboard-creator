import { DashboardMetaData } from '../types';

/**
 * Get the HTMLElement offset based on layout.
 *
 * @param dashboardId - Dashboard identifier
 * @param dashboardsMeta - Collection of dashboards metadata
 * @param action - type of modification
 * @return collection of
 *
 */
const reduceWidgetsCount = (
  dashboardId: string,
  dashboardsMeta: DashboardMetaData[],
  action: 'decrease' | 'increase'
) => {
  const modifier = action === 'increase' ? 1 : -1;
  return dashboardsMeta.map((dashboard) => {
    if (dashboard.id === dashboardId) {
      return { ...dashboard, widgets: dashboard.widgets + modifier };
    }
    return dashboard;
  });
};

export default reduceWidgetsCount;
