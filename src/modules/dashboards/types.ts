import { Widget } from '../widgets';

export type DashboardMetaData = {
  id: string;
};

export type DashboardModel = {
  id: string;
  version: string;
  widgets: Widget[];
};

export type Dashboard = {
  id: string;
  version: string;
  widgets: string[];
};

export type DashboardItem = {
  initialized: boolean;
  settings: Dashboard;
};

export type ReducerState = {
  metadata: {
    isLoaded: boolean;
    error: boolean;
    data: DashboardMetaData[];
  };
  items: Record<string, DashboardItem>;
};
