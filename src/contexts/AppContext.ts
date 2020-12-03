import React from 'react';
import { PubSub } from '@keen.io/pubsub';

export const AppContext = React.createContext<{
  notificationPubSub: PubSub;
}>({
  notificationPubSub: null,
});
