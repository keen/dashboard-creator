import deepMerge from 'deepmerge';

import { KeenDataviz } from '@keen.io/dataviz';
import { Theme } from '@keen.io/charts';
import { Tag } from '@keen.io/widgets';

import { ChartWidget } from '../../../modules/widgets';
import { DashboardSettings } from '../../../modules/dashboards';

type Options = {
  widget: ChartWidget;
  theme: Partial<Theme>;
  container: HTMLElement;
  presentationTimezone?: string | number;
  dashboardSettings: DashboardSettings;
  tags: Tag[];
};

/**
 * Creates DataViz instance based on provided configuration
 *
 * @param widget - chart widget settings
 * @param theme - chart theme
 * @param container - DOM element used to mount component
 * @param presentationTimezone - named timezone or offset
 * @param dashboardSettings - Dashboard settings
 * @param tags - Widget tags
 * @return dataviz instance
 *
 */
const createDataviz = ({
  widget,
  theme,
  container,
  presentationTimezone,
  dashboardSettings,
  tags,
}: Options) => {
  const {
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget;

  const { tiles } = dashboardSettings;

  const extendedWidgetSettings = {
    ...widgetSettings,
    legend: {
      ...widgetSettings.legend,
      ...dashboardSettings.legend,
    },
    title: {
      ...widgetSettings.title,
      typography: {
        ...widgetSettings.title?.typography,
        ...dashboardSettings.title?.typography,
      },
    },
    subtitle: {
      ...widgetSettings.subtitle,
      typography: {
        ...widgetSettings.subtitle?.typography,
        ...dashboardSettings.subtitle?.typography,
      },
    },
  };

  const composedChartSettings = () => {
    if ('theme' in chartSettings) {
      return {
        ...chartSettings,
        theme: deepMerge(theme, chartSettings.theme, {
          arrayMerge: (_target, source) => source,
        }),
      };
    }
    return {
      ...chartSettings,
      theme: theme,
    };
  };

  return new KeenDataviz({
    container,
    type: visualizationType as any,
    settings: composedChartSettings(),
    widget: {
      ...extendedWidgetSettings,
      tags,
      card: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        padding: tiles.padding,
        hasShadow: false,
      },
    },
    presentationTimezone,
  });
};

export default createDataviz;
