import { Store } from 'redux';
import { LOCATION_CHANGE } from 'connected-react-router';

import { createViewUpdateMiddleware } from './viewUpdate';

test('calls "updateHandler" with management view details', () => {
  const updateMock = jest.fn();
  const next = jest.fn();

  const store = {
    getState: () => ({
      app: {
        activeDashboardId: null,
      },
    }),
  } as Store;

  const middleware = createViewUpdateMiddleware(updateMock);
  const action = {
    type: LOCATION_CHANGE,
    payload: {
      isFirstRendering: false,
      location: {
        hash: '',
        search: '',
        query: {},
        state: null,
        pathname: '/management',
      },
    },
  };

  middleware(store)(next)(action);

  expect(updateMock).toHaveBeenCalledWith('management', null);
});

test('calls "updateHandler" with editor view details', () => {
  const updateMock = jest.fn();
  const next = jest.fn();

  const store = {
    getState: () => ({
      app: {
        activeDashboardId: '@dashboardId',
      },
    }),
  } as Store;

  const middleware = createViewUpdateMiddleware(updateMock);
  const action = {
    type: LOCATION_CHANGE,
    payload: {
      isFirstRendering: false,
      location: {
        hash: '',
        search: '',
        query: {},
        state: null,
        pathname: '/editor',
      },
    },
  };

  middleware(store)(next)(action);

  expect(updateMock).toHaveBeenCalledWith('editor', '@dashboardId');
});

test('do not calls "updateHandler" method', () => {
  const updateMock = jest.fn();
  const next = jest.fn();

  const store = {
    getState: () => ({
      app: {
        activeDashboardId: null,
      },
    }),
  } as Store;

  const middleware = createViewUpdateMiddleware(updateMock);
  const action = {
    type: '@action',
  };

  middleware(store)(next)(action);

  expect(updateMock).not.toHaveBeenCalled();
});

test('calls "next" action handler', () => {
  const updateMock = jest.fn();
  const next = jest.fn();

  const store = {
    getState: () => ({
      app: {
        activeDashboardId: null,
      },
    }),
  } as Store;

  const middleware = createViewUpdateMiddleware(updateMock);
  const action = {
    type: '@action',
  };

  middleware(store)(next)(action);

  expect(next).toHaveBeenCalledWith(action);
});
