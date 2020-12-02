export type Options = {
  container: string;
  blobApiUrl: string;
  project: {
    masterKey: string;
    userKey: string;
    id: string;
  };
  translations?: TranslationsSettings;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};
