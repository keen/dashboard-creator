import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import KeenAnalysis from 'keen-analysis';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { screenBreakpoints } from '@keen.io/ui-core';

import App from './App';
import { APIContext } from './contexts';
import { BlobAPI } from './api';
import { appStart } from './modules/app';

import createI18n from './i18n';
import rootReducer, { history } from './rootReducer';
import rootSaga from './rootSaga';

import { BLOB_API, KEEN_ANALYSIS } from './constants';

import { Options, TranslationsSettings } from './types';

export class DashboardCreator {
  private container: string;

  /** Master key for Keen project */
  private readonly masterKey: string;

  /** Read key for Keen project */
  private readonly readKey: string;

  /** Write key for Keen project */
  private readonly writeKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Blob API url */
  private readonly blobApiUrl: string;

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

  constructor(config: Options) {
    const { container, blobApiUrl, project, translations } = config;

    const { projectId, masterKey, readKey, writeKey } = project;

    this.container = container;
    this.projectId = projectId;
    this.masterKey = masterKey;
    this.readKey = readKey;
    this.writeKey = writeKey;
    this.blobApiUrl = blobApiUrl;
    this.translationsSettings = translations || {};
  }

  render() {
    const blobApi = new BlobAPI({
      projectId: this.projectId,
      accessKey: this.masterKey,
      url: this.blobApiUrl,
    });

    const keenAnalysis = new KeenAnalysis({
      projectId: this.projectId,
      masterKey: this.masterKey,
      readKey: this.readKey,
      writeKey: this.writeKey,
      host: 'staging-api.keen.io',
    });

    createI18n(this.translationsSettings);

    const sagaMiddleware = createSagaMiddleware({
      context: {
        [BLOB_API]: blobApi,
        [KEEN_ANALYSIS]: keenAnalysis,
      },
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    sagaMiddleware.run(rootSaga);
    store.dispatch(appStart());

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider
          theme={{
            breakpoints: screenBreakpoints,
          }}
        >
          <ConnectedRouter history={history}>
            <APIContext.Provider value={{ blobApi, keenAnalysis }}>
              <App />
            </APIContext.Provider>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>,
      document.querySelector(this.container)
    );
  }
}

export default DashboardCreator;
