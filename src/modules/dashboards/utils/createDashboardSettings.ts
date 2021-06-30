import { DashboardSettings } from '../types';
import { FONTS } from '../../../modules/theme';
import { DEFAULT_BACKGROUND_COLOR } from '../../../constants';

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
    background: DEFAULT_BACKGROUND_COLOR,
    chartTitlesFont: FONTS[1].name,
    visualizationsFont: FONTS[0].name,
  },
  // title: {
  //
  // },
  // subtitle: {
  //
  // },
  legend: {
    typography: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 10,
      fontFamily: FONTS[0].name, // add fallback
      fontColor: 'teal',
    },
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
