import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import KeenAnalysis from 'keen-analysis';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { PubSub, getPubSub } from '@keen.io/pubsub';
import { ToastProvider } from '@keen.io/toast-notifications';
import { screenBreakpoints } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import App from './App';
import { APIContext, AppContext } from './contexts';
import { BlobAPI } from './api';
import { appStart } from './modules/app';
import { NotificationManager } from './modules/notifications';

import createI18n from './i18n';
import rootReducer, { history } from './rootReducer';
import rootSaga from './rootSaga';

import {
  PUBSUB,
  BLOB_API,
  I18N,
  KEEN_ANALYSIS,
  NOTIFICATION_MANAGER,
  SHOW_TOAST_NOTIFICATION_EVENT,
} from './constants';

import { Options, TranslationsSettings } from './types';

export class DashboardCreator {
  private container: string;

  private modalContainer: string;

  /** Master key for Keen project */
  private readonly masterKey: string;

  /** User key for Keen project */
  private readonly userKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Blob API url */
  private readonly blobApiUrl: string;

  /** Keen API url */
  private keenApiUrl = 'api.keen.io';

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

  /** Charts theme settings */
  private readonly themeSettings: Partial<Theme>;

  constructor(config: Options) {
    const {
      container,
      modalContainer,
      blobApiUrl,
      keenApiUrl,
      project,
      translations,
      theme,
    } = config;

    const { id, masterKey, userKey } = project;
    if (keenApiUrl) this.keenApiUrl = keenApiUrl;

    this.container = container;
    this.modalContainer = modalContainer;
    this.projectId = id;
    this.masterKey = masterKey;
    this.userKey = userKey;
    this.blobApiUrl = blobApiUrl;
    this.translationsSettings = translations || {};
    this.themeSettings = theme || {};
  }

  render() {
    const blobApi = new BlobAPI({
      projectId: this.projectId,
      accessKey: this.userKey,
      masterKey: this.masterKey,
      url: this.blobApiUrl,
    });

    const keenAnalysis = new KeenAnalysis({
      projectId: this.projectId,
      masterKey: this.masterKey,
      readKey: this.userKey,
      host: 'staging-api.keen.io',
    });

    createI18n(this.translationsSettings);

    const notificationPubSub = new PubSub();

    const sagaMiddleware = createSagaMiddleware({
      context: {
        [BLOB_API]: blobApi,
        [KEEN_ANALYSIS]: keenAnalysis,
        [I18N]: i18n,
        [PUBSUB]: getPubSub(),
        [NOTIFICATION_MANAGER]: new NotificationManager({
          pubsub: notificationPubSub,
          eventName: SHOW_TOAST_NOTIFICATION_EVENT,
        }),
      },
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    sagaMiddleware.run(rootSaga);
    store.dispatch(appStart(this.themeSettings));

    const projectSettings = {
      id: this.projectId,
      userKey: this.userKey,
      masterKey: this.masterKey,
    };

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider
          theme={{
            breakpoints: screenBreakpoints,
          }}
        >
          <ConnectedRouter history={history}>
            <ToastProvider>
              <AppContext.Provider
                value={{
                  notificationPubSub,
                  project: projectSettings,
                  keenApiUrl: this.keenApiUrl,
                  modalContainer: this.modalContainer,
                }}
              >
                <APIContext.Provider value={{ blobApi, keenAnalysis }}>
                  <App />
                </APIContext.Provider>
              </AppContext.Provider>
            </ToastProvider>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>,
      document.querySelector(this.container)
    );
  }
}

export default DashboardCreator;
