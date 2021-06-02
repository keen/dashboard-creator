import deepMerge from 'deepmerge';
import { ChartWidget } from '../../../modules/widgets';
import { getFontFallback } from '../../ThemeEditor';

/**
 * Merges widget settings with font
 *
 * @param font - font name as string
 * @param settings - widget settings
 * @return widget settings with font fallback added
 *
 */

const mergeWidgetSettingsWithFont = (font: string, settings: ChartWidget) => {
  const fontsSettings = {
    settings: {
      widgetSettings: {
        title: { typography: { fontFamily: getFontFallback(font) } },
        subtitle: { typography: { fontFamily: getFontFallback(font) } },
      },
    },
  };

  return deepMerge.all([settings, fontsSettings]) as ChartWidget;
};

export default mergeWidgetSettingsWithFont;
