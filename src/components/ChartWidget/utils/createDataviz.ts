import { KeenDataviz } from '@keen.io/dataviz';
import { Theme } from '@keen.io/charts';

import { ChartWidget } from '../../../modules/widgets';
import { DashboardSettings } from '../../../modules/dashboards';

type Options = {
  widget: ChartWidget;
  theme: Partial<Theme>;
  container: HTMLElement;
  presentationTimezone?: string | number;
  dashboardSettings: DashboardSettings;
};

/**
 * Creates DataViz instance based on provided configuration
 *
 * @param widget - chart widget settings
 * @param theme - chart theme
 * @param container - DOM element used to mount component
 * @param presentationTimezone - named timezone or offset
 * @param dashboardSettings - Dashbaord settinfs
 * @return dataviz instance
 *
 */
const createDataviz = ({
  widget,
  theme,
  container,
  presentationTimezone,
  dashboardSettings,
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
