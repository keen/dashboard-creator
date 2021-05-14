import { Query } from '@keen.io/query';
import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';
import { TextSettings } from '@keen.io/widgets';

export enum EditorSection {
  QUERY = 'query',
  SETTINGS = 'settings',
}

export type EditorWidgetSettings = WidgetSettings & {
  title: TextSettings;
  subtitle: TextSettings;
};

export type ReducerState = {
  editorSection: EditorSection;
  isOpen: boolean;
  isEditMode: boolean;
  isSavedQuery: boolean;
  isDirtyQuery: boolean;
  isQueryPerforming: boolean;
  hasQueryChanged: boolean;
  changeQueryConfirmation: boolean;
  querySettings: Partial<Query>;
  initialQuerySettings: Partial<Query>;
  analysisResult: Record<string, any> | null;
  queryError: string | null;
  visualization: {
    type: Exclude<PickerWidgets, 'json'>;
    chartSettings: ChartSettings;
    widgetSettings: EditorWidgetSettings;
  };
};

export type VisualisationSettingsPayload = {
  type: PickerWidgets;
  chartSettings: ChartSettings;
  widgetSettings: Record<string, any>;
};
