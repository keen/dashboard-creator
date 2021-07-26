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
  const composedWidgetSettingsSettings = {
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
  return mergeSettingsWithFontFallback<WidgetSettings>(
    dashboardSettings.page.chartTitlesFont,
    composedWidgetSettingsSettings
  );
};
