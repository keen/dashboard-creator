export type ViewMode = 'editor' | 'viewer' | 'management';

export type ReducerState = {
  view: ViewMode;
  activeDashboardId: string | null;
  queryPicker: {
    isVisible: false;
  };
  visualizationEditor: {
    isVisible: false;
  };
};
