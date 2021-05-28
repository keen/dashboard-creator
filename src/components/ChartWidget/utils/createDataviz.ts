import { KeenDataviz } from '@keen.io/dataviz';
import { Theme } from '@keen.io/charts';

import { ChartWidget } from '../../../modules/widgets';
import { DashboardSettings } from '../../../modules/dashboards';

type Options = {
  widget: ChartWidget;
  theme: Partial<Theme>;
  container: HTMLElement;
  dashboardSettings: Pick<DashboardSettings, 'tiles'>;
  presentationTimezone?: string | number;
};

/**
 * Creates DataViz instance based on provided configuration
 *
 * @param widget - chart widget settings
 * @param theme - chart theme
 * @param container - DOM element used to mount component
 * @param presentationTimezone - named timezone or offset
 * @param dashboardSettings - dashboard settings for tiles
 * @return dataviz instance
 *
 */
const createDataviz = ({
  widget,
  theme,
  container,
  dashboardSettings,
  presentationTimezone,
}: Options) => {
  const {
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget;

  const { tiles } = dashboardSettings;

  return new KeenDataviz({
    container,
    type: visualizationType as any,
    settings: {
      ...chartSettings,
      theme,
    },
    widget: {
      ...widgetSettings,
      card: {
        backgroundColor: tiles.background,
        borderColor: tiles.borderColor,
        borderWidth: tiles.borderWidth,
        borderRadius: tiles.borderRadius,
        padding: tiles.padding,
        hasShadow: tiles.hasShadow,
      },
    },
    presentationTimezone,
  });
};

export default createDataviz;
