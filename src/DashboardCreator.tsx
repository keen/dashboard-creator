import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import KeenAnalysis from 'keen-analysis';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import { PubSub } from '@keen.io/pubsub';
import { ToastProvider } from '@keen.io/toast-notifications';
import { screenBreakpoints } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import App from './App';
import { APIContext, AppContext } from './contexts';
import { BlobAPI } from './api';
import { appStart } from './modules/app';
import { NotificationManager } from './modules/notifications';

import createI18n from './i18n';
import createSagaMiddleware from './createSagaMiddleware';
import rootReducer, { history } from './rootReducer';
import { createRootSaga } from './rootSaga';

import { SHOW_TOAST_NOTIFICATION_EVENT } from './constants';

import { DashboardCreatorOptions, TranslationsSettings } from './types';

export class DashboardCreator {
  /** Container used to mount application */
  private container: string;

  /** Container used to mount application modals */
  private modalContainer: string;

  /** User edit privileges */
  private readonly editPrivileges: boolean;

  /** Master key for Keen project */
  private readonly masterKey: string;

  /** User key for Keen project */
  private readonly accessKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Dashboards API url */
  private dashboardsApiUrl = 'blob-service.us-west-2.prod.aws.keen.io';

  /** Analytics API url */
  private analyticsApiUrl = 'api.keen.io';

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

  /** Charts theme settings */
  private readonly themeSettings: Partial<Theme>;

  /** Method that creates url for shared dashboard */
  private createSharedDashboardUrl: (
    accessKey: string,
    dashboardId: string
  ) => string;

  constructor(config: DashboardCreatorOptions) {
    const {
      container,
      modalContainer,
      editPrivileges,
      backend,
      project,
      translations,
      theme,
      createSharedDashboardUrl,
    } = config;

    const { id, masterKey, accessKey } = project;
    console.log({ project });

    if (backend?.analyticsApiUrl)
      this.analyticsApiUrl = backend.analyticsApiUrl;
    if (backend?.dashboardsApiUrl)
      this.dashboardsApiUrl = backend.dashboardsApiUrl;
    if (editPrivileges) this.editPrivileges = editPrivileges;

    this.container = container;
    this.modalContainer = modalContainer;
    this.projectId = id;
    this.masterKey = masterKey;
    this.accessKey = accessKey;
    this.translationsSettings = translations || {};
    this.themeSettings = theme || {};
    this.createSharedDashboardUrl = createSharedDashboardUrl;
  }

  render() {
    const blobApi = new BlobAPI({
      projectId: this.projectId,
      accessKey: this.accessKey,
      masterKey: this.masterKey,
      url: this.dashboardsApiUrl,
    });

    const keenAnalysis = new KeenAnalysis({
      projectId: this.projectId,
      masterKey: this.masterKey,
      readKey: this.accessKey,
      host: this.analyticsApiUrl,
    });

    createI18n(this.translationsSettings);

    const notificationPubSub = new PubSub();

    const sagaMiddleware = createSagaMiddleware({
      blobApi,
      keenAnalysis,
      i18n,
      notificationManager: new NotificationManager({
        pubsub: notificationPubSub,
        eventName: SHOW_TOAST_NOTIFICATION_EVENT,
      }),
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    const rootSaga = createRootSaga(this.editPrivileges);

    sagaMiddleware.run(rootSaga);
    store.dispatch(appStart(this.themeSettings, this.editPrivileges));

    const projectSettings = {
      id: this.projectId,
      userKey: this.accessKey,
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
                  analyticsApiUrl: this.analyticsApiUrl,
                  modalContainer: this.modalContainer,
                  createSharedDashboardUrl: this.createSharedDashboardUrl,
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
