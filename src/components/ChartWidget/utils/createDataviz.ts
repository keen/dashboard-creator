import { KeenDataviz } from '@keen.io/dataviz';
import { Tag, WidgetSettings } from '@keen.io/widgets';
import { PickerWidgets } from '@keen.io/widget-picker';

import { DashboardSettings } from '../../../modules/dashboards';
import { ChartSettings } from '../../../types';

type Options = {
  visualizationType: PickerWidgets;
  widgetSettings: WidgetSettings;
  chartSettings: ChartSettings;
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
  visualizationType,
  widgetSettings,
  chartSettings,
  container,
  presentationTimezone,
  dashboardSettings,
  tags,
}: Options) => {
  const { tiles } = dashboardSettings;

  return new KeenDataviz({
    container,
    type: visualizationType as any,
    settings: chartSettings,
    widget: {
      ...widgetSettings,
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
