import { Theme } from '@keen.io/charts';

export type BackendSettings = {
  dashboardsApiUrl?: string;
  analyticsApiUrl?: string;
};

export type DashboardCreatorOptions = {
  container: string;
  modalContainer: string;
  editPrivileges: boolean;
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
  timezoneSelectionDisabled?: boolean;
  defaultTimezoneForQuery?: string;
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
