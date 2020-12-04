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
};

export type Dashboard = {
  version: string;
  widgets: string[];
};

export type DashboardItem = {
  initialized: boolean;
  settings: Dashboard;
};

export type ReducerState = {
  metadata: {
    isInitiallyLoaded: boolean;
    error: boolean;
    data: DashboardMetaData[];
  };
  items: Record<string, DashboardItem>;
};
