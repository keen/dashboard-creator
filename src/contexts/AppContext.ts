import React from 'react';
import { PubSub } from '@keen.io/pubsub';

export const AppContext = React.createContext<{
  notificationPubSub: PubSub;
  modalContainer: string;
  keenApiUrl: string;
  project: {
    id: string;
    userKey: string;
    masterKey: string;
  };
}>({
  notificationPubSub: null,
  modalContainer: null,
  keenApiUrl: '',
  project: {
    id: null,
    userKey: null,
    masterKey: null,
  },
});
