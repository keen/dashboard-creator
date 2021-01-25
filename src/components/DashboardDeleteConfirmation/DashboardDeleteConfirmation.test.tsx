import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DashboardDeleteConfirmation from './DashboardDeleteConfirmation';

import { DISCLAIMERS } from '../DeleteDisclaimer';
import { dashboardsMeta } from '../../modules/dashboards/fixtures';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    ...overProps,
  };

  const state = {
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: dashboardsMeta,
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <Provider store={store}>
      <DashboardDeleteConfirmation {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('do not renders dashboard delete confirmation', () => {
  const {
    wrapper: { queryByTestId },
  } = render();

  expect(queryByTestId('delete-confirmation-content')).not.toBeInTheDocument();
});

test('allows user to confirm dashboard delete', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: true,
        dashboardId: '@dashboard/01',
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: [
          {
            id: '@dashboard/01',
            widgets: 5,
            queries: 0,
            title: 'Dashboard 1',
            tags: [],
            lastModificationDate: 1606895352390,
            isPublic: false,
          },
        ],
      },
    },
  };
  const {
    wrapper: { getByText },
    store,
  } = render(storeState);

  const element = getByText('delete_dashboard.confirm');
  fireEvent.click(element);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@dashboards/CONFIRM_DASHBOARD_DELETE",
      },
    ]
  `);
});

test('shows public dashboard disclaimer error', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: true,
        dashboardId: '@dashboard/01',
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: [
          {
            id: '@dashboard/01',
            widgets: 5,
            queries: 0,
            title: 'Dashboard 1',
            tags: [],
            lastModificationDate: 1606895352390,
            isPublic: true,
          },
        ],
      },
    },
  };
  const {
    wrapper: { getByText },
  } = render(storeState);

  const element = getByText('delete_dashboard.confirm');
  fireEvent.click(element);

  expect(
    getByText('delete_dashboard.public_dashboard_confirmation_error')
  ).toBeInTheDocument();
});

test('allows user to delete public dashboard', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: true,
        dashboardId: '@dashboard/01',
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: [
          {
            id: '@dashboard/01',
            widgets: 5,
            queries: 0,
            title: 'Dashboard 1',
            tags: [],
            lastModificationDate: 1606895352390,
            isPublic: true,
          },
        ],
      },
    },
  };
  const {
    store,
    wrapper: { getByTestId, getByText },
  } = render(storeState);

  DISCLAIMERS.forEach(({ id }) => {
    const element = getByTestId(`disclaimer-${id}`);
    fireEvent.click(element);
  });

  const button = getByText('delete_dashboard.confirm');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@dashboards/CONFIRM_DASHBOARD_DELETE",
      },
    ]
  `);
});

test('allows user to cancel dashboard delete', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: true,
        dashboardId: '@dashboard/01',
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: dashboardsMeta,
      },
    },
  };
  const {
    wrapper: { getByText },
    store,
  } = render(storeState);

  const element = getByText('delete_dashboard.cancel');
  fireEvent.click(element);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@dashboards/HIDE_DELETE_CONFIRMATION",
      },
    ]
  `);
});
