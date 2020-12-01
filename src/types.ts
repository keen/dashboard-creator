export type Options = {
  container: string;
  blobApiUrl: string;
  project: {
    masterKey: string;
    readKey: string;
    writeKey: string;
    projectId: string;
  };
  translations?: TranslationsSettings;
};

export type TranslationsSettings = {
  backend?: {
    loadPath?: string;
  };
};
