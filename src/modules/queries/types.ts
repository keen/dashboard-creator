import { Query } from '@keen.io/query';
import { PickerWidgets } from '@keen.io/widget-picker';

export type SavedQueryAPIResponse = {
  query: Query;
  query_name: string;
  refresh_rate: number;
  metadata?: SavedQueryMetadata;
};

export type SavedQueryMetadata = {
  display_name?: string;
  visualization: {
    type: PickerWidgets;
    chart_settings: Record<string, any>;
    widget_settings: Record<string, any>;
  };
};

export type QueryVisualization = {
  type: PickerWidgets;
  chartSettings: Record<string, any>;
  widgetSettings: Record<string, any>;
};

export type SavedQuery = {
  id: string;
  displayName: string;
  settings: Query;
  visualization: QueryVisualization;
};
