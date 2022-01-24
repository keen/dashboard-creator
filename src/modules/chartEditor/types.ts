import { Query } from '@keen.io/query';
import { PickerWidgets, WidgetSettings } from '@keen.io/widget-picker';
import { TextSettings } from '@keen.io/widgets';
import { MENU_ITEMS_ENUM } from '@keen.io/widget-customization';
import { ChartSettings } from '../../types';

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
  isLoading: boolean;
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
  chartSettingsSection: MENU_ITEMS_ENUM;
};

export type VisualisationSettingsPayload = {
  type: PickerWidgets;
  chartSettings: ChartSettings;
  widgetSettings: Record<string, any>;
};
