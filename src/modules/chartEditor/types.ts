import { Query } from '@keen.io/query';
import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';

export type ReducerState = {
  isOpen: boolean;
  isEditMode: boolean;
  isQueryPerforming: boolean;
  querySettings: Partial<Query>;
  analysisResult: Record<string, any> | null;
  visualization: {
    type: Exclude<PickerWidgets, 'json'>;
    chartSettings: ChartSettings;
    widgetSettings: WidgetSettings;
  };
};
