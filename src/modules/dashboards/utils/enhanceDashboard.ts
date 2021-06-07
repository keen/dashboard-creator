import deepMerge from 'deepmerge';

import createDashboardSettings from './createDashboardSettings';

import { DashboardModel } from '../types';

/**
 * Enhances dashboard model with properties. Used for providing
 * backward compatibility,
 *
 * @param dashboard - Dashboard model
 * @return dashboard model with extended properties
 *
 */
const enhanceDashboard = (dashboard: DashboardModel) => {
  if ('settings' in dashboard) {
    return {
      ...dashboard,
      settings: deepMerge(createDashboardSettings(), dashboard.settings, {
        arrayMerge: (_target, source) => source,
      }),
    };
  }

  return {
    ...dashboard,
    settings: createDashboardSettings(),
  };
};

export default enhanceDashboard;
