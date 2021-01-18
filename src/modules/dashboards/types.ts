import { Theme } from '@keen.io/charts';
import { Widget } from '../widgets';

export type DashboardMetaData = {
  id: string;
  title: null | string;
  widgets: number;
  queries: number;
  tags: string[];
  lastModificationDate: number;
  isPublic: boolean;
};

export type DashboardModel = {
  version: string;
  widgets: Widget[];
  baseTheme?: Partial<Theme>;
};

export type Dashboard = {
  version: string;
  widgets: string[];
};

export type DashboardItem = {
  initialized: boolean;
  isSaving: boolean;
  settings: Dashboard;
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
  items: Record<string, DashboardItem>;
  dashboardListOrder: string;
};
