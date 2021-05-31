import { KeenDataviz } from '@keen.io/dataviz';
import { Theme } from '@keen.io/charts';

import { ChartWidget } from '../../../modules/widgets';

type Options = {
  widget: ChartWidget;
  theme: Partial<Theme>;
  container: HTMLElement;
  presentationTimezone?: string | number;
};

/**
 * Creates DataViz instance based on provided configuration
 *
 * @param widget - chart widget settings
 * @param theme - chart theme
 * @param container - DOM element used to mount component
 * @param presentationTimezone - named timezone or offset
 * @return dataviz instance
 *
 */
const createDataviz = ({
  widget,
  theme,
  container,
  presentationTimezone,
}: Options) => {
  const {
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget;

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
        padding: 0,
        hasShadow: false,
      },
    },
    presentationTimezone,
  });
};

export default createDataviz;
