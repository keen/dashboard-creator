export type Options = {
  container: string;
  accessKey: string;
  blobApiUrl: string;
  projectId: string;
  translations?: TranslationsSettings;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};
