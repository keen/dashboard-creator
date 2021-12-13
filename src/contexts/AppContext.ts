import React from 'react';
import { PubSub } from '@keen.io/pubsub';
import { Features, WidgetsConfiguration } from '../types';

export const AppContext = React.createContext<{
  notificationPubSub: PubSub;
  chartEventsPubSub?: PubSub;
  modalContainer: string;
  analyticsApiUrl: string;
  project: {
    id: string;
    userKey: string;
    masterKey: string;
  };
  createSharedDashboardUrl?: (accessKey: string, dashboardId: string) => string;
  widgetsConfiguration?: WidgetsConfiguration;
  features?: Features;
  disableQueryFilterSuggestions?: boolean;
}>({
  notificationPubSub: null,
  modalContainer: null,
  analyticsApiUrl: '',
  project: {
    id: null,
    userKey: null,
    masterKey: null,
  },
  createSharedDashboardUrl: () => '',
  widgetsConfiguration: {},
  features: {},
  disableQueryFilterSuggestions: false,
});
