import { Query } from '@keen.io/query';
import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';

export type ReducerState = {
  isOpen: boolean;
  isQueryPerforming: boolean;
  querySettings: Partial<Query>;
  analysisResult: Record<string, any> | null;
  visualization: {
    type: PickerWidgets;
    chartSettings: ChartSettings;
    widgetSettings: WidgetSettings;
  };
};
