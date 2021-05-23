import { DashboardSettings } from '../types';

/**
 * Creates default dashboard configuration settings
 *
 * @return dashboard settings
 *
 */
const createDashboardSettings = (): DashboardSettings => ({
  colorPalette: 'default',
  page: {
    gridGap: 20,
    background: '#f1f5f8',
    chartTitlesFont: 'default',
    visualizationsFont: 'default',
  },
  tiles: {
    background: '#ffffff',
    borderColor: 'none',
    borderRadius: 0,
    borderWidth: 0,
    padding: 20,
    hasShadow: true,
  },
});

export default createDashboardSettings;
