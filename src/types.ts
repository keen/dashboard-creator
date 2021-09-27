import {
  BarChartSettings,
  BubbleChartSettings,
  ChoroplethChartSettings,
  DonutChartSettings,
  FunnelChartSettings,
  GaugeChartSettings,
  HeatmapChartSettings,
  LineChartSettings,
  MetricChartSettings,
  PieChartSettings,
  TableChartSettings,
  Theme,
} from '@keen.io/charts';

import { Scopes } from './modules/app';

export type BackendSettings = {
  dashboardsApiUrl?: string;
  analyticsApiUrl?: string;
};

export type View = 'management' | 'editor' | 'viewer';

export type ViewUpdateHandler = (
  view: View,
  dashboardId: string | null
) => void;

export type DashboardCreatorOptions = {
  container: string;
  modalContainer: string;
  userPermissions?: Scopes[];
  onViewChange?: ViewUpdateHandler;
  project: {
    masterKey: string;
    accessKey: string;
    id: string;
  };
  backend?: BackendSettings;
  translations?: TranslationsSettings;
  theme?: Partial<Theme>;
  createSharedDashboardUrl: (accessKey: string, dashboardId: string) => string;
  cachedDashboardsNumber: number;
  disableTimezoneSelection?: boolean;
  defaultTimezoneForQuery?: string;
  widgetsConfiguration?: WidgetsConfiguration;
  features?: Features;
};

export type PublicDashboardOptions = {
  container: string;
  dashboardId: string;
  backend?: BackendSettings;
  project: {
    accessKey: string;
    id: string;
  };
  modalContainer: string;
  translations?: TranslationsSettings;
  widgetsConfiguration: WidgetsConfiguration;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};

export type WidgetType =
  | 'visualization'
  | 'text'
  | 'image'
  | 'date-picker'
  | 'filter';

export type DatePickerWidgetConfiguration = {
  disableTimezoneSelection?: boolean;
  defaultTimezone?: string;
};

export type WidgetsConfiguration = {
  datePicker?: DatePickerWidgetConfiguration;
};

type ComponentSettings =
  | BubbleChartSettings
  | BarChartSettings
  | LineChartSettings
  | GaugeChartSettings
  | PieChartSettings
  | DonutChartSettings
  | MetricChartSettings
  | FunnelChartSettings
  | HeatmapChartSettings
  | TableChartSettings
  | ChoroplethChartSettings
  | Record<string, any>;
export type ChartSettings = ComponentSettings & { theme?: Theme };

export type Features = {
  enableDashboardConnections?: boolean;
  enableFixedEditorBar?: boolean;
};
