import { Theme } from '@keen.io/charts';

export type Options = {
  container: string;
  modalContainer: string;
  editPrivileges: boolean;
  blobApiUrl: string;
  project: {
    masterKey: string;
    userKey: string;
    id: string;
  };
  keenApiUrl?: string;
  translations?: TranslationsSettings;
  theme?: Partial<Theme>;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};

export type WidgetType = 'visualization' | 'text' | 'image';
