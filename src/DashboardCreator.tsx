/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-ts-comment */

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
import { Theme } from '@keen.io/charts';

import App from './App';
import { APIContext, AppContext } from './contexts';
import { DashboardAPI } from './api';
import { appActions, Scopes } from './modules/app';
import { NotificationManager } from './modules/notifications';

import createI18n from './i18n';
import createSagaMiddleware from './createSagaMiddleware';
import rootReducer from './rootReducer';
import { createRootSaga } from './rootSaga';
import { createViewUpdateMiddleware } from './middleware';

import {
  DEFAULT_TIMEZONE,
  SHOW_TOAST_NOTIFICATION_EVENT,
  INITIAL_VIEWS,
} from './constants';

import {
  DashboardCreatorOptions,
  TranslationsSettings,
  ViewUpdateHandler,
  View,
} from './types';
import GlobalStyles from './components/GlobalStyles';

export class DashboardCreator {
  /** Container used to mount application */
  private container: string;

  /** Container used to mount application modals */
  private modalContainer: string;

  /** User privileges */
  private readonly userPermissions: Scopes[] = [
    Scopes.EDIT_DASHBOARD,
    Scopes.SHARE_DASHBOARD,
    Scopes.EDIT_DASHBOARD_THEME,
  ];

  /** Master key for Keen project */
  private readonly masterKey: string;

  /** User key for Keen project */
  private readonly accessKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Http protocol */
  private readonly protocol?: 'http' | 'https';

  /** Dashboards API url */
  private dashboardsApiUrl = 'dashboard-service.k-n.io';

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

  /** Cached dashboards number */
  private cachedDashboardsNumber = 3;

  /** Timezone selection disabled in query **/
  private disableTimezoneSelection = false;

  /** Default timezone for query **/
  private defaultTimezoneForQuery = DEFAULT_TIMEZONE;

  /** Filter suggestions disabled in query creator **/
  private disableQueryFilterSuggestions = false;

  /** Widgets configuration **/
  private widgetsConfiguration = {};

  /** Features */
  private features = {};

  /** View change event handler */
  private onViewChange?: ViewUpdateHandler = null;

  /** Timezones API url */
  private timezonesApiUrl = 'api.keen.io';

  constructor(config: DashboardCreatorOptions) {
    const {
      container,
      modalContainer,
      userPermissions,
      backend,
      project,
      translations,
      theme,
      createSharedDashboardUrl,
      cachedDashboardsNumber,
      disableTimezoneSelection,
      defaultTimezoneForQuery,
      widgetsConfiguration,
      features,
      onViewChange,
      disableQueryFilterSuggestions,
      timezonesHost,
    } = config;

    const { id, masterKey, accessKey, protocol = 'https' } = project;

    if (backend?.analyticsApiUrl)
      this.analyticsApiUrl = backend.analyticsApiUrl;
    if (backend?.dashboardsApiUrl)
      this.dashboardsApiUrl = backend.dashboardsApiUrl;
    if (userPermissions) this.userPermissions = userPermissions;
    if (onViewChange) this.onViewChange = onViewChange;

    this.container = container;
    this.modalContainer = modalContainer;
    this.projectId = id;
    this.masterKey = masterKey;
    this.accessKey = accessKey;
    this.protocol = protocol;
    this.translationsSettings = translations || {};
    this.themeSettings = theme || {};
    this.createSharedDashboardUrl = createSharedDashboardUrl;
    if (cachedDashboardsNumber) {
      this.cachedDashboardsNumber = cachedDashboardsNumber;
    }
    this.defaultTimezoneForQuery = defaultTimezoneForQuery;
    if (timezonesHost) {
      this.timezonesApiUrl = timezonesHost;
    }
    this.disableTimezoneSelection = disableTimezoneSelection;
    this.disableQueryFilterSuggestions = disableQueryFilterSuggestions;
    this.widgetsConfiguration = widgetsConfiguration;
    if (features) {
      this.features = features;
    }
  }

  /**
   * Creates dashboards api instance
   *
   * @return Dashboard API instance
   *
   */
  private createDashboardsAPI() {
    return new DashboardAPI({
      projectId: this.projectId,
      accessKey: this.accessKey,
      masterKey: this.masterKey,
      url: this.dashboardsApiUrl,
    });
  }

  /**
   * Creates analytics api instance
   *
   * @return Analytis API instance
   *
   */
  private createAnalytisAPI() {
    return new KeenAnalysis({
      projectId: this.projectId,
      masterKey: this.masterKey,
      readKey: this.accessKey,
      host: this.analyticsApiUrl,
      protocol: this?.protocol,
    });
  }

  /**
   * Unmounts application instance from container
   *
   * @return void
   *
   */
  destroy() {
    ReactDOM.unmountComponentAtNode(document.querySelector(this.container));
  }

  /**
   * Render dashboard creator instance in DOM container
   *
   * @param initialView - Application initial view
   * @param dashboardId - Initial dashboard identifer
   * @return DOM Node
   *
   */
  render(initialView: View = 'management', dashboardId: string = null) {
    const dashboardApi = this.createDashboardsAPI();
    const keenAnalysis = this.createAnalytisAPI();

    createI18n(this.translationsSettings);

    const notificationPubSub = new PubSub();
    const chartEventsPubSub = new PubSub();

    const sagaMiddleware = createSagaMiddleware({
      dashboardApi,
      keenAnalysis,
      i18n,
      notificationManager: new NotificationManager({
        pubsub: notificationPubSub,
        eventName: SHOW_TOAST_NOTIFICATION_EVENT,
      }),
      analyticsApiHost: this.analyticsApiUrl,
      timezonesApiHost: this.timezonesApiUrl,
      features: this.features,
    });

    const defaultTimezoneForQuery =
      this.defaultTimezoneForQuery || DEFAULT_TIMEZONE;

    const history = createMemoryHistory({
      initialIndex: 0,
      initialEntries: [INITIAL_VIEWS[initialView]],
    });

    const reduxMiddlewares = [sagaMiddleware, routerMiddleware(history)];

    if (this.onViewChange) {
      reduxMiddlewares.push(createViewUpdateMiddleware(this.onViewChange));
    }

    const store = configureStore({
      reducer: combineReducers({
        ...rootReducer,
        router: connectRouter(history),
      }),
      preloadedState: {
        timezone: {
          defaultTimezoneForQuery: defaultTimezoneForQuery,
          timezoneSelectionDisabled: !!this.disableTimezoneSelection,
        },
      },
      middleware: reduxMiddlewares,
    });

    const rootSaga = createRootSaga(this.userPermissions);

    sagaMiddleware.run(rootSaga);

    store.dispatch(
      appActions.appStart({
        baseTheme: this.themeSettings,
        userPermissions: this.userPermissions,
        cachedDashboardsNumber: this.cachedDashboardsNumber,
        initialView,
        dashboardId,
      })
    );

    const projectSettings = {
      id: this.projectId,
      userKey: this.accessKey,
      masterKey: this.masterKey,
      protocol: this.protocol,
    };

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
                  chartEventsPubSub,
                  project: projectSettings,
                  analyticsApiUrl: this.analyticsApiUrl,
                  timezonesApiUrl: this.timezonesApiUrl,
                  modalContainer: this.modalContainer,
                  createSharedDashboardUrl: this.createSharedDashboardUrl,
                  widgetsConfiguration: this.widgetsConfiguration,
                  features: this.features,
                  disableQueryFilterSuggestions: this
                    .disableQueryFilterSuggestions,
                }}
              >
                <APIContext.Provider value={{ dashboardApi, keenAnalysis }}>
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
