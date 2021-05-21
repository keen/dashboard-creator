import { Theme } from '@keen.io/charts';

export type ReducerState = {
  defaultTheme: Partial<Theme>;
  initialTheme: Partial<Theme>;
  currentEditTheme: Partial<Theme>;
  dashboards: Record<string, Partial<Theme>>;
  modal: {
    isOpen: boolean;
    inPreviewMode: boolean;
  };
};
