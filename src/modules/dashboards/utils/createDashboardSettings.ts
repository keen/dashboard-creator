import { DashboardSettings } from '../types';
import { FONTS, getFontFallback } from '../../../modules/theme';
import { DEFAULT_BACKGROUND_COLOR } from '../../../constants';
import { widgetSettings } from '@keen.io/widgets';

/**
 * Creates default dashboard configuration settings
 *
 * @return dashboard settings
 *
 */
const createDashboardSettings = (): DashboardSettings => {
  const fontFallback = getFontFallback(FONTS[1].name);
  return {
    colorPalette: 'default',
    page: {
      gridGap: 20,
      background: DEFAULT_BACKGROUND_COLOR,
      chartTitlesFont: FONTS[1].name,
      visualizationsFont: FONTS[0].name,
    },
    title: {
      typography: {
        ...widgetSettings.title.typography,
        fontFamily: fontFallback,
      },
    },
    subtitle: {
      typography: {
        ...widgetSettings.subtitle.typography,
        fontFamily: fontFallback,
      },
    },
    legend: {
      typography: {
        ...widgetSettings.legend.typography,
        fontFamily: fontFallback,
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
  };
};

export default createDashboardSettings;
