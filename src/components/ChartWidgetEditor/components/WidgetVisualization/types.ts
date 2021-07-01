import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { WidgetSettings } from '@keen.io/widgets';

export type VisualizationSettings = {
  type: PickerWidgets;
  chartSettings: ChartSettings;
  widgetSettings: WidgetSettings;
};
