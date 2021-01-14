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

import { APIContext } from './contexts';
import { BlobAPI } from './api';
import { NotificationManager } from './modules/notifications';
import { viewPublicDashboard } from './modules/dashboards';

import PublicDashboardViewer from './components/PublicDashboardViewer';

import createI18n from './i18n';
import createSagaMiddleware from './createSagaMiddleware';
import rootReducer, { history } from './rootReducer';
import { publicDashboardRootSaga } from './rootSaga';

import { SHOW_TOAST_NOTIFICATION_EVENT } from './constants';

import { PublicDashboardOptions, TranslationsSettings } from './types';

export class PublicDashboard {
  /** Container used to mount application */
  private container: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Dashboard identifer */
  private readonly dashboardId: string;

  /** User key for Keen project */
  private readonly accessKey: string;

  /** Dashboards API url */
  private dashboardsApiUrl = 'blob-service.us-west-2.prod.aws.keen.io';

  /** Analytics API url */
  private analyticsApiUrl = 'api.keen.io';

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

  constructor(config: PublicDashboardOptions) {
    const { container, project, dashboardId, backend, translations } = config;

    if (backend?.analyticsApiUrl)
      this.analyticsApiUrl = backend.analyticsApiUrl;
    if (backend?.dashboardsApiUrl)
      this.dashboardsApiUrl = backend.dashboardsApiUrl;

    const { id: projectId, accessKey } = project;

    this.container = container;
    this.projectId = projectId;
    this.dashboardId = dashboardId;
    this.accessKey = accessKey;
    this.translationsSettings = translations || {};
  }

  render() {
    const blobApi = new BlobAPI({
      projectId: this.projectId,
      accessKey: this.accessKey,
      url: this.dashboardsApiUrl,
    });

    const keenAnalysis = new KeenAnalysis({
      projectId: this.projectId,
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

    sagaMiddleware.run(publicDashboardRootSaga);
    store.dispatch(viewPublicDashboard(this.dashboardId));

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider
          theme={{
            breakpoints: screenBreakpoints,
          }}
        >
          <ConnectedRouter history={history}>
            <ToastProvider>
              <APIContext.Provider value={{ blobApi, keenAnalysis }}>
                <PublicDashboardViewer dashboardId={this.dashboardId} />
              </APIContext.Provider>
            </ToastProvider>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>,
      document.querySelector(this.container)
    );
  }
}

export default PublicDashboard;
