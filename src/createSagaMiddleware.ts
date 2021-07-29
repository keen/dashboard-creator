import createMiddleware from 'redux-saga';
import { i18n } from 'i18next';
import { getPubSub } from '@keen.io/pubsub';

import { DashboardAPI } from './api';
import { NotificationManager } from './modules/notifications';

import {
  PUBSUB,
  DASHBOARD_API,
  TRANSLATIONS,
  KEEN_ANALYSIS,
  NOTIFICATION_MANAGER,
  ANALYTICS_API_HOST,
} from './constants';

type SagaContext = {
  i18n: i18n;
  dashboardApi: DashboardAPI;
  keenAnalysis: any;
  notificationManager: NotificationManager;
  analyticsApiHost: string;
};

const createSagaMiddleware = ({
  dashboardApi,
  keenAnalysis,
  i18n,
  notificationManager,
  analyticsApiHost,
}: SagaContext) =>
  createMiddleware({
    context: {
      [DASHBOARD_API]: dashboardApi,
      [KEEN_ANALYSIS]: keenAnalysis,
      [TRANSLATIONS]: i18n,
      [PUBSUB]: getPubSub(),
      [NOTIFICATION_MANAGER]: notificationManager,
      [ANALYTICS_API_HOST]: analyticsApiHost,
    },
  });

export default createSagaMiddleware;
