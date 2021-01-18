export type ViewMode = 'editor' | 'viewer' | 'management';

export type ReducerState = {
  view: ViewMode;
  activeDashboardId: string | null;
  user: {
    editPrivileges: boolean;
  };
  imagePicker: {
    isVisible: false;
  };
  visualizationEditor: {
    isVisible: false;
  };
  queryPicker: {
    isVisible: boolean;
  };
};
