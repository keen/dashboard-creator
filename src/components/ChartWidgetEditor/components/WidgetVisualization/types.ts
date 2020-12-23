import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';

export type VisualizationSettings = {
  type: PickerWidgets;
  chartSettings: ChartSettings;
  widgetSettings: WidgetSettings;
};
