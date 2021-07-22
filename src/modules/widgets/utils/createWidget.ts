import { serializeWidget } from '../serializers';

import { WidgetType } from '../../../types';
import {
  GridPosition,
  TextWidget,
  ChartWidget,
  ImageWidget,
  DatePickerWidget,
  FilterWidget,
} from '../types';

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
          datePickerId: null,
          filterIds: [],
          settings,
        } as ChartWidget,
        isConfigured
      );
    case 'text':
      return serializeWidget(
        {
          ...baseWidget,
          settings: {
            textAlignment: 'left',
            content: {
              blocks: [],
              entityMap: {},
            },
          },
        } as TextWidget,
        isConfigured
      );
    case 'date-picker':
      return serializeWidget(
        {
          ...baseWidget,
          settings: {
            widgets: [],
            name: '',
          },
        } as DatePickerWidget,
        isConfigured
      );
    case 'filter':
      return serializeWidget(
        {
          ...baseWidget,
          settings: {
            widgets: [],
            eventStream: null,
            targetProperty: null,
            name: '',
          },
        } as FilterWidget,
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
