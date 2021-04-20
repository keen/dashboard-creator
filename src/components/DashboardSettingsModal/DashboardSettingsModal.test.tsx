import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import DashboardSettingsModal from './DashboardSettingsModal';

import { AppContext } from '../../contexts';

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
      dashboardSettingsModal: {
        isVisible: true,
        dashboardId,
      },
      tagsPool: [],
      items: {},
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    onSaveDashboard: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <AppContext.Provider value={{ modalContainer: '#modal-root' } as any}>
      <Provider store={store}>
        <DashboardSettingsModal {...props} />
      </Provider>
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
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
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
        "type": "@dashboard/PREPARE_TAGS_POOL",
      },
      Object {
        "payload": undefined,
        "type": "@dashboards/HIDE_DASHBOARD_SETTINGS_MODAL",
      },
    ]
  `);
});
