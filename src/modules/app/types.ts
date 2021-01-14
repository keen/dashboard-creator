export type ViewMode = 'editor' | 'viewer' | 'management';

export type ReducerState = {
  view: ViewMode;
  activeDashboardId: string | null;
  user: {
    editPrivileges: boolean;
  };
  queryPicker: {
    isVisible: boolean;
  };
};
