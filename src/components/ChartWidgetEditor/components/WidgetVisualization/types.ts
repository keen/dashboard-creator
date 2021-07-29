import { PickerWidgets } from '@keen.io/widget-picker';
import { WidgetSettings } from '@keen.io/widgets';
import { ChartSettings } from '../../../../types';

export type VisualizationSettings = {
  type: PickerWidgets;
  chartSettings: ChartSettings;
  widgetSettings: WidgetSettings;
};
