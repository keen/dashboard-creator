import { serializeWidget } from '../serializers';

import { GridPosition, TextWidget, ChartWidget } from '../types';

type Options = {
  id: string;
  widgetType: 'visualization' | 'text';
  gridPosition: GridPosition;
};

export const createWidget = (
  { id, widgetType, gridPosition }: Options,
  isConfigured = false
) => {
  const baseWidget = {
    id,
    position: gridPosition,
    type: widgetType,
  };

  switch (widgetType) {
    case 'visualization':
      const settings = {
        visualizationType: null,
        chartSettings: {},
        widgetSettings: {},
      };
      return serializeWidget(
        {
          ...baseWidget,
          query: null,
          settings,
        } as ChartWidget,
        isConfigured
      );
    case 'text':
      return serializeWidget(
        {
          ...baseWidget,
          settings: {},
        } as TextWidget,
        isConfigured
      );
  }
};
