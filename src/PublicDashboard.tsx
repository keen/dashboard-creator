/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/ban-ts-ignore */
import { timezoneActions } from './modules/timezone';

if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  __webpack_public_path__ = window.dashboardCreatorResourcesBasePath;
}

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

import { APIContext, AppContext } from './contexts';
import { BlobAPI } from './api';
import { NotificationManager } from './modules/notifications';
import { viewPublicDashboard } from './modules/dashboards';

import PublicDashboardViewer from './components/PublicDashboardViewer';

import createI18n from './i18n';
import createSagaMiddleware from './createSagaMiddleware';
import rootReducer, { history } from './rootReducer';
import { createRootSaga } from './rootSaga';

import { SHOW_TOAST_NOTIFICATION_EVENT } from './constants';

import { PublicDashboardOptions, TranslationsSettings } from './types';
import { DEFAULT_TIMEZONE } from './components/DatePickerWidget/constants';

export class PublicDashboard {
  /** Container used to mount application */
  private container: string;

  /** Container used to mount application modals */
  private modalContainer: string;

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

  /** Timezone selection disabled in query **/
  private timezoneSelectionDisabled = false;

  /** Default timezone for query **/
  private defaultTimezoneForQuery = DEFAULT_TIMEZONE;

  /** Widgets configuration **/
  private widgetsConfiguration = {};

  constructor(config: PublicDashboardOptions) {
    const {
      container,
      modalContainer,
      project,
      dashboardId,
      backend,
      translations,
      timezoneSelectionDisabled,
      defaultTimezoneForQuery,
      widgetsConfiguration,
    } = config;

    if (backend?.analyticsApiUrl)
      this.analyticsApiUrl = backend.analyticsApiUrl;
    if (backend?.dashboardsApiUrl)
      this.dashboardsApiUrl = backend.dashboardsApiUrl;

    const { id: projectId, accessKey } = project;

    this.container = container;
    this.modalContainer = modalContainer;
    this.projectId = projectId;
    this.dashboardId = dashboardId;
    this.accessKey = accessKey;
    this.translationsSettings = translations || {};
    this.defaultTimezoneForQuery = defaultTimezoneForQuery;
    this.timezoneSelectionDisabled = timezoneSelectionDisabled;
    this.widgetsConfiguration = widgetsConfiguration;
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
      preloadedState: {
        timezone: {
          defaultTimezoneForQuery: this.defaultTimezoneForQuery,
          timezoneSelectionDisabled: !!this.timezoneSelectionDisabled,
        },
      },
      middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    const rootSaga = createRootSaga();
    const projectSettings = {
      id: this.projectId,
      userKey: this.accessKey,
      masterKey: '',
    };

    sagaMiddleware.run(rootSaga);

    timezoneActions.fetchTimezones();

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
              <AppContext.Provider
                value={{
                  notificationPubSub,
                  project: projectSettings,
                  analyticsApiUrl: this.analyticsApiUrl,
                  modalContainer: this.modalContainer,
                  widgetsConfiguration: this.widgetsConfiguration,
                }}
              >
                <APIContext.Provider value={{ blobApi, keenAnalysis }}>
                  <PublicDashboardViewer dashboardId={this.dashboardId} />
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

export default PublicDashboard;
