import { KeenDataviz } from '@keen.io/dataviz';

import { ChartWidget } from '../../../modules/widgets';

const createDataviz = (widget: ChartWidget, theme, container) => {
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
  });
};

export default createDataviz;
