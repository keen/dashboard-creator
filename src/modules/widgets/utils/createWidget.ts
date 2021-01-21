import { serializeWidget } from '../serializers';

import { WidgetType } from '../../../types';
import { GridPosition, TextWidget, ChartWidget, ImageWidget } from '../types';

type Options = {
  id: string;
  widgetType: WidgetType;
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
          settings: {
            content: {
              blocks: [],
              entityMap: {},
            },
          },
        } as TextWidget,
        isConfigured
      );
    case 'image':
      return serializeWidget(
        {
          ...baseWidget,
          settings: { link: '' },
        } as ImageWidget,
        isConfigured
      );
  }
};
