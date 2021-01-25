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
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};

export type WidgetType = 'visualization' | 'text' | 'image';
