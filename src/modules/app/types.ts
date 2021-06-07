import { Theme } from '@keen.io/charts';

export type ViewMode = 'editor' | 'viewer' | 'management';

export enum Scopes {
  EDIT_DASHBOARD = 'edit-dashboard',
  SHARE_DASHBOARD = 'share-dashboard',
}

export type ReducerState = {
  view: ViewMode;
  activeDashboardId: string | null;
  cachedDashboardsNumber: number;
  user: {
    permissions: Scopes[];
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
  userPermissions: Scopes[];
  cachedDashboardsNumber: number;
};
