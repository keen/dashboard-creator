import { Theme } from '@keen.io/charts';

import { DashboardSettings } from '../dashboards';

export type ThemeSettings = {
  theme: Partial<Theme>;
  settings: DashboardSettings;
};

export enum ThemeEditorSection {
  Main = 'main',
}

export type ReducerState = {
  defaultTheme: Partial<Theme>;
  initialTheme: Partial<ThemeSettings>;
  currentEditTheme: Partial<ThemeSettings>;
  dashboards: Record<string, ThemeSettings>;
  editorSection: ThemeEditorSection | null;
  modal: {
    isOpen: boolean;
    inPreviewMode: boolean;
  };
};
