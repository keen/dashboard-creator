import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DashboardDeleteConfirmation from './DashboardDeleteConfirmation';
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
        data: dashboardsMeta,
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
