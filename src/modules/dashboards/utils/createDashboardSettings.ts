import { DashboardSettings } from '../types';
import { FONTS } from '../../../modules/theme';

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
    chartTitlesFont: FONTS[1].name,
    visualizationsFont: FONTS[0].name,
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
