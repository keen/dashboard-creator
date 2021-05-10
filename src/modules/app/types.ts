import { Theme } from '@keen.io/charts';

export type ViewMode = 'editor' | 'viewer' | 'management';

export type ReducerState = {
  view: ViewMode;
  activeDashboardId: string | null;
  cachedDashboardsNumber: number;
  user: {
    editPrivileges: boolean;
  };
  imagePicker: {
    isVisible: boolean;
  };
  visualizationEditor: {
    isVisible: boolean;
  };
  queryPicker: {
    isVisible: boolean;
  };
};

export type AppStartPayload = {
  baseTheme: Partial<Theme>;
  editPrivileges: boolean;
  cachedDashboardsNumber: number;
};
