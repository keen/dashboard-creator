import { Theme } from '@keen.io/charts';

import { View } from '../../types';

export enum Scopes {
  EDIT_DASHBOARD = 'edit-dashboard',
  SHARE_DASHBOARD = 'share-dashboard',
  EDIT_DASHBOARD_THEME = 'edit-dashboard-theme',
}

export type ReducerState = {
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
  initialView: View;
  dashboardId: string | null;
};
