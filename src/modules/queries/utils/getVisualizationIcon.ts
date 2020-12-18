import { WIDGETS } from '@keen.io/widget-picker';

import { QueryVisualization } from '../types';

const getVisualizationIcon = ({ type, chartSettings }: QueryVisualization) => {
  const activeVisualization = WIDGETS.find(({ isActive }) =>
    isActive(type, chartSettings)
  );

  if (activeVisualization) {
    return activeVisualization.icon;
  }

  const { icon } = WIDGETS.find(({ widget }) => widget === type);
  return icon;
};

export default getVisualizationIcon;
