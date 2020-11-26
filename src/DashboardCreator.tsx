import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import { APIContext } from './contexts';
import { BlobAPI } from './api';
import { appStart } from './modules/app';

import createI18n from './i18n';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import { BLOB_API } from './constants';

import { Options, TranslationsSettings } from './types';

export class DashboardCreator {
  private container: string;

  /** Authorization access key for project */
  private readonly accessKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Blob API url */
  private readonly blobApiUrl: string;

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

  constructor(config: Options) {
    const {
      container,
      accessKey,
      blobApiUrl,
      projectId,
      translations,
    } = config;

    this.container = container;
    this.projectId = projectId;
    this.accessKey = accessKey;
    this.blobApiUrl = blobApiUrl;
    this.translationsSettings = translations || {};
  }

  render() {
    const blobApi = new BlobAPI({
      projectId: this.projectId,
      accessKey: this.accessKey,
      url: this.blobApiUrl,
    });

    createI18n(this.translationsSettings);

    const sagaMiddleware = createSagaMiddleware({
      context: {
        [BLOB_API]: blobApi,
      },
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: [sagaMiddleware],
    });

    sagaMiddleware.run(rootSaga);
    store.dispatch(appStart());

    ReactDOM.render(
      <Provider store={store}>
        <APIContext.Provider value={{ blobApi }}>
          <App />
        </APIContext.Provider>
      </Provider>,
      document.querySelector(this.container)
    );
  }
}

export default DashboardCreator;
