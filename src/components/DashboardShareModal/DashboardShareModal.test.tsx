import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import DashboardShareModal from './DashboardShareModal';

import { BlobAPI } from '../../api';

import { AppContext, APIContext } from '../../contexts';
import { createBodyElementById } from '../../utils/test/createBodyElementById';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const dashboardId = 'dashboardId';
  const state = {
    dashboards: {
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: [
          {
            id: dashboardId,
            isPublic: false,
            lastModificationDate: 1610013350396,
            queries: 0,
            tags: [],
            title: 'Example Title',
            widgets: 0,
          },
        ],
      },
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      dashboardShareModal: {
        isVisible: true,
        dashboardId,
      },
      tagsPool: [],
      items: {},
    },
    ...storeState,
  };

  const keenAnalysis = {
    get: jest.fn().mockReturnThis(),
    auth: jest.fn().mockReturnThis(),
    url: jest.fn(),
    masterKey: jest.fn(),
    send: jest.fn().mockResolvedValue([]),
  };

  const store = mockStore({ ...state });

  const props = {
    onSaveDashboard: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <AppContext.Provider
      value={
        {
          modalContainer: '#modal-root',
          createSharedDashboardUrl: () => 'url',
        } as any
      }
    >
      <APIContext.Provider value={{ keenAnalysis, blobApi: {} as BlobAPI }}>
        <Provider store={store}>
          <DashboardShareModal {...props} />
        </Provider>
      </APIContext.Provider>
    </AppContext.Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  createBodyElementById('modal-root');
});

test('allows user to close modal', () => {
  const {
    wrapper: { getByTestId },
    store,
  } = render();

  const closeButton = getByTestId('modal-close');
  fireEvent.click(closeButton);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@dashboards/HIDE_DASHBOARD_SHARE_MODAL",
      },
    ]
  `);
});
