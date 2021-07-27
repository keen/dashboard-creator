import { WidgetSettings } from '@keen.io/widgets';
import { DashboardSettings } from '../../dashboards';
import { mergeSettingsWithFontFallback } from './mergeSettingsWithFontFallback';

/**
 * Merges dashboard settings with widget settings
 */
export const composeWidgetSettings = (
  widgetSettings: WidgetSettings,
  dashboardSettings: DashboardSettings
) => {
  let composedWidgetSettings = {
    ...widgetSettings,
    legend: {
      ...widgetSettings.legend,
      typography: {
        ...dashboardSettings.legend.typography,
      },
    },
    title: {
      ...widgetSettings.title,
      typography: dashboardSettings.title.typography,
    },
    subtitle: {
      ...widgetSettings.subtitle,
      typography: dashboardSettings.subtitle.typography,
    },
  };
  if (!widgetSettings.hasOwnProperty('card')) {
    composedWidgetSettings = {
      ...composedWidgetSettings,
      card: {
        enabled: true,
      },
    };
  }
  return mergeSettingsWithFontFallback<WidgetSettings>(
    dashboardSettings.page.chartTitlesFont,
    composedWidgetSettings
  );
};
