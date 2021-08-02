import deepMerge from 'deepmerge';
import { Theme } from '@keen.io/charts';

import createDashboardSettings from './createDashboardSettings';

import { DashboardModel } from '../types';

/**
 * Enhances dashboard model with properties. Used for providing
 * backward compatibility,
 *
 * @param dashboard - Dashboard model
 * @param baseTheme - Base theme connected with partial provided in configuration
 * @return dashboard model with extended properties
 *
 */
const enhanceDashboard = (dashboard: DashboardModel, baseTheme: Theme) => {
  return {
    ...dashboard,
    ...('theme' in dashboard
      ? {}
      : {
          theme: baseTheme,
        }),
    ...('settings' in dashboard
      ? {
          settings: deepMerge(createDashboardSettings(), dashboard.settings, {
            arrayMerge: (_target, source) => source,
          }),
        }
      : {
          settings: createDashboardSettings(),
        }),
  };
};

export default enhanceDashboard;
