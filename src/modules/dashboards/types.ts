import { Theme } from '@keen.io/charts';
import { Widget } from '../widgets';
import { Typography } from '@keen.io/ui-core';

export type DashboardMetaData = {
  id: string;
  title: null | string;
  widgets: number;
  queries: number;
  tags: string[];
  lastModificationDate: number | null;
  isPublic: boolean;
  publicAccessKey: null | string;
};

export type DashboardSettings = {
  colorPalette: string;
  page: {
    gridGap: number;
    background: string;
    chartTitlesFont: string;
    visualizationsFont: string;
  };
  title: {
    typography: Typography;
  };
  subtitle: {
    typography: Typography;
  };
  legend: {
    typography: Typography;
  };
  tiles: {
    background: string;
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    padding: number;
    hasShadow: boolean;
  };
};

export type DashboardModel = {
  version: string;
  widgets: Widget[];
  settings?: DashboardSettings;
  theme?: Partial<Theme>;
};

export type Dashboard = {
  version: string;
  widgets: string[];
};

export enum DashboardError {
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_EXIST = 'NOT_EXIST',
  ACCESS_NOT_PUBLIC = 'ACCESS_NOT_PUBLIC',
  VIEW_PUBLIC_DASHBOARD = 'VIEW_PUBLIC_DASHBOARD',
}

export type DashboardItem = {
  initialized: boolean;
  isSaving: boolean;
  settings: Dashboard;
  error: null | DashboardError;
};

export type DashboardListOrder = 'recent' | 'oldest' | 'az' | 'za';

export type ConnectedDashboard = {
  id: string;
  title?: string;
};

export type ReducerState = {
  deleteConfirmation: {
    isVisible: boolean;
    dashboardId?: string;
  };
  metadata: {
    isInitiallyLoaded: boolean;
    error: boolean;
    data: DashboardMetaData[];
    isSavingMetadata: boolean;
    isRegeneratingAccessKey: boolean;
  };
  dashboardSettingsModal: {
    isVisible: boolean;
    dashboardId: string | null;
  };
  dashboardShareModal: {
    isVisible: boolean;
    dashboardId: string | null;
  };
  tagsPool: string[];
  tagsFilters: {
    showOnlyPublicDashboards: boolean;
    tags: string[];
  };
  items: Record<string, DashboardItem>;
  dashboardListOrder: DashboardListOrder;
  cachedDashboardIds: string[];
  connectedDashboards: {
    isLoading: boolean;
    isError: boolean;
    items: ConnectedDashboard[];
  };
};
