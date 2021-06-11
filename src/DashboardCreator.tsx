/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/ban-ts-ignore */

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
import { BlobAPI } from './api';
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
  ];

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

  /** Cached dashboards number */
  private cachedDashboardsNumber = 3;

  /** Timezone selection disabled in query **/
  private disableTimezoneSelection = false;

  /** Default timezone for query **/
  private defaultTimezoneForQuery = DEFAULT_TIMEZONE;

  /** Widgets configuration **/
  private widgetsConfiguration = {};

  /** Enable fixed Editor bar */
  private enableFixedEditorBar = false;

  /** View change event handler */
  private onViewChange?: ViewUpdateHandler = null;

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
      enableFixedEditorBar,
      onViewChange,
    } = config;

    const { id, masterKey, accessKey } = project;
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
    this.translationsSettings = translations || {};
    this.themeSettings = theme || {};
    this.createSharedDashboardUrl = createSharedDashboardUrl;
    if (cachedDashboardsNumber) {
      this.cachedDashboardsNumber = cachedDashboardsNumber;
    }
    this.defaultTimezoneForQuery = defaultTimezoneForQuery;
    this.disableTimezoneSelection = disableTimezoneSelection;
    this.widgetsConfiguration = widgetsConfiguration;
    this.enableFixedEditorBar = enableFixedEditorBar;
  }

  /**
   * Creates dashboards api instance
   *
   * @return Blob API instance
   *
   */
  private createDashboardsAPI() {
    return new BlobAPI({
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
    const blobApi = this.createDashboardsAPI();
    const keenAnalysis = this.createAnalytisAPI();

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
      analyticsApiHost: this.analyticsApiUrl,
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
                  project: projectSettings,
                  analyticsApiUrl: this.analyticsApiUrl,
                  modalContainer: this.modalContainer,
                  createSharedDashboardUrl: this.createSharedDashboardUrl,
                  widgetsConfiguration: this.widgetsConfiguration,
                  enableFixedEditorBar: this.enableFixedEditorBar,
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
