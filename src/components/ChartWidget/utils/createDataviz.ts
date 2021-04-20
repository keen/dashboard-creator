import { KeenDataviz } from '@keen.io/dataviz';

import { ChartWidget } from '../../../modules/widgets';

const createDataviz = (
  widget: ChartWidget,
  theme,
  container,
  presentationTimezone
) => {
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
    widget: widgetSettings,
    presentationTimezone,
  });
};

export default createDataviz;
