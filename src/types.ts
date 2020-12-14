import { Theme } from '@keen.io/charts';

export type Options = {
  container: string;
  blobApiUrl: string;
  project: {
    masterKey: string;
    userKey: string;
    id: string;
  };
  translations?: TranslationsSettings;
  theme?: Partial<Theme>;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};

export type WidgetType = 'visualization' | 'text';

export type GridSize = {
  cols: number;
  containerPadding?: [number, number];
  containerWidth: number;
  margin: [number, number];
};
