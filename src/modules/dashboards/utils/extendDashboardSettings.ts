import deepMerge from 'deepmerge';

import { DashboardSettings } from '../types';

/**
 * Extends dashboard settings with custom settings
 *
 * @param customSettings - partial dashboard settings
 * @return dashboard settings
 *
 */
const extendDashboardSettings = (
  customSettings: Partial<DashboardSettings> = {},
  baseSettings: DashboardSettings
) =>
  deepMerge(baseSettings, customSettings, {
    arrayMerge: (_target, source) => source,
  });

export default extendDashboardSettings;
