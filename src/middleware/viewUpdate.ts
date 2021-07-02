import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router';
import { Store, Middleware, Action } from 'redux';

import { appSelectors } from '../modules/app';

import { View, ViewUpdateHandler } from '../types';

const ROUTES_MAP: Record<string, View> = {
  '/management': 'management',
  '/viewer': 'viewer',
  '/editor': 'editor',
};

/**
 * Creates route update middleware that notifies container applications
 * @param updateHandler - Update view handler
 *
 * @return Middleware - redux middleware
 *
 */
export const createViewUpdateMiddleware =
  (updateHandler: ViewUpdateHandler): Middleware =>
  (store: Store) =>
  (next) =>
  (action: Action) => {
    if (action.type === LOCATION_CHANGE) {
      const activeDashboardId = appSelectors.getActiveDashboard(
        store.getState()
      );
      const {
        payload: {
          location: { pathname },
        },
      } = action as LocationChangeAction;
      updateHandler(ROUTES_MAP[pathname], activeDashboardId);
    }
    next(action);
  };
