import { serializeWidget } from '../serializers';

import { GridPosition, TextWidget, ChartWidget } from '../types';

type Options = {
  id: string;
  widgetType: 'visualization' | 'text';
  gridPosition: GridPosition;
};

export const createWidget = ({ id, widgetType, gridPosition }: Options) => {
  const baseWidget = {
    id,
    position: gridPosition,
    type: widgetType,
  };

  switch (widgetType) {
    case 'visualization':
      const settings = {
        chartSettings: {},
        widgetSettings: {},
      };
      return serializeWidget({
        ...baseWidget,
        settings,
      } as ChartWidget);
    case 'text':
      return serializeWidget({
        ...baseWidget,
        settings: {},
      } as TextWidget);
  }
};
