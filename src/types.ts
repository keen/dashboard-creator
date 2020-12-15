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
