import createMiddleware from 'redux-saga';
import { i18n } from 'i18next';
import { getPubSub } from '@keen.io/pubsub';

import { BlobAPI } from './api';
import { NotificationManager } from './modules/notifications';

import {
  PUBSUB,
  BLOB_API,
  TRANSLATIONS,
  KEEN_ANALYSIS,
  NOTIFICATION_MANAGER,
} from './constants';

type SagaContext = {
  i18n: i18n;
  blobApi: BlobAPI;
  keenAnalysis: any;
  notificationManager: NotificationManager;
};

const createSagaMiddleware = ({
  blobApi,
  keenAnalysis,
  i18n,
  notificationManager,
}: SagaContext) =>
  createMiddleware({
    context: {
      [BLOB_API]: blobApi,
      [KEEN_ANALYSIS]: keenAnalysis,
      [TRANSLATIONS]: i18n,
      [PUBSUB]: getPubSub(),
      [NOTIFICATION_MANAGER]: notificationManager,
    },
  });

export default createSagaMiddleware;
