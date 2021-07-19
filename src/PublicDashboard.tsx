/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-ts-comment */
import { timezoneActions } from './modules/timezone';

if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  __webpack_public_path__ = window.dashboardCreatorResourcesBasePath;
}

import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import KeenAnalysis from 'keen-analysis';
import { ThemeProvider } from 'styled-components';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createMemoryHistory } from 'history';
import { PubSub } from '@keen.io/pubsub';
import { ToastProvider } from '@keen.io/toast-notifications';
import { screenBreakpoints } from '@keen.io/ui-core';

import { APIContext, AppContext } from './contexts';
import { DashboardAPI } from './api';
import { NotificationManager } from './modules/notifications';
import { viewPublicDashboard } from './modules/dashboards';

import PublicDashboardViewer from './components/PublicDashboardViewer';
import GlobalStyles from './components/GlobalStyles';

import createI18n from './i18n';
import createSagaMiddleware from './createSagaMiddleware';
import rootReducer from './rootReducer';
import { createRootSaga } from './rootSaga';

import { SHOW_TOAST_NOTIFICATION_EVENT } from './constants';

import { PublicDashboardOptions, TranslationsSettings } from './types';

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
  private dashboardsApiUrl = 'dashboard-service.us-west-2.test.aws.keen.io';

  /** Analytics API url */
  private analyticsApiUrl = 'api.keen.io';

  /** App localization settings */
  private readonly translationsSettings: TranslationsSettings;

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
    this.widgetsConfiguration = widgetsConfiguration;
  }

  render() {
    const dashboardApi = new DashboardAPI({
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
      dashboardApi,
      keenAnalysis,
      i18n,
      analyticsApiHost: this.analyticsApiUrl,
      notificationManager: new NotificationManager({
        pubsub: notificationPubSub,
        eventName: SHOW_TOAST_NOTIFICATION_EVENT,
      }),
    });

    const history = createMemoryHistory();

    const store = configureStore({
      reducer: combineReducers({
        ...rootReducer,
        router: connectRouter(history),
      }),
      middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    const rootSaga = createRootSaga();
    const projectSettings = {
      id: this.projectId,
      userKey: this.accessKey,
      masterKey: '',
    };

    sagaMiddleware.run(rootSaga);

    store.dispatch(timezoneActions.fetchTimezones());
    store.dispatch(viewPublicDashboard(this.dashboardId));

    ReactDOM.render(
      <Provider store={store}>
        <GlobalStyles modalContainer={this.modalContainer} />
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
                <APIContext.Provider value={{ dashboardApi, keenAnalysis }}>
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
